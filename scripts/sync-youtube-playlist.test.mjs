import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import fs from 'node:fs';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import sync from './sync-youtube-playlist.js';

const entry = (id, date) => `<entry><title>Breakout call</title><yt:videoId>${id}</yt:videoId><published>${date}T12:00:00Z</published><author><name>Ethereum</name></author></entry>`;
const feed = `<feed>${entry('older', '2026-10-01')}${entry('newer', '2026-11-01')}</feed>`;

test('parses video metadata and sorts newest first', () => {
  assert.deepEqual(sync.parseVideos(feed), ['newer', 'older'].map((videoId, i) => ({
    title: 'Breakout call', videoId, url: `https://www.youtube.com/watch?v=${videoId}`,
    date: i ? '2026-10-01' : '2026-11-01', author: 'Ethereum',
  })));
});

test('failed and empty syncs preserve the entire last-known-good file', async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'playlist-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const outputPath = path.join(dir, 'playlist.json');
  const original = JSON.stringify({ lastUpdated: 'unchanged', videos: [{ videoId: 'saved' }] });
  fs.writeFileSync(outputPath, original);
  for (const xml of ['<feed></feed>', '<html>Unavailable</html>', '<feed><entry><title>No ID</title></entry></feed>']) {
    await assert.rejects(sync.syncPlaylist({ outputPath, fetchFeed: async () => xml }), /no videos/);
    assert.equal(fs.readFileSync(outputPath, 'utf8'), original);
  }
  await assert.rejects(sync.syncPlaylist({ outputPath, fetchFeed: async () => { throw new Error('network'); } }), /network/);
  assert.equal(fs.readFileSync(outputPath, 'utf8'), original);
  await sync.syncPlaylist({ outputPath, fetchFeed: async () => feed });
  const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  assert.deepEqual(saved.videos, sync.parseVideos(feed));
  assert.notEqual(saved.lastUpdated, 'unchanged');
});

test('rejects non-200 HTTP responses even when they contain entries', async (t) => {
  for (const statusCode of [301, 403, 500]) {
    const request = new EventEmitter();
    request.setTimeout = () => request;
    const response = new EventEmitter();
    response.statusCode = statusCode;
    response.resume = () => {};
    const mock = t.mock.method(https, 'get', (_url, callback) => {
      queueMicrotask(() => { callback(response); response.emit('data', feed); response.emit('end'); });
      return request;
    });
    await assert.rejects(sync.fetchFeed('https://example.com'), new RegExp(`HTTP ${statusCode}`));
    mock.mock.restore();
  }
});

test('times out stalled feed requests', async (t) => {
  const request = new EventEmitter();
  request.destroy = (error) => request.emit('error', error);
  request.setTimeout = (timeout, callback) => {
    assert.equal(timeout, 30_000);
    queueMicrotask(callback);
  };
  t.mock.method(https, 'get', () => request);
  await assert.rejects(sync.fetchFeed('https://example.com'), /timed out/);
});
