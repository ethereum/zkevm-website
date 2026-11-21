/**
 * Fetch videos from a YouTube playlist via its RSS feed
 * and write them to src/data/youtube-playlist.json
 *
 * Usage: node scripts/sync-youtube-playlist.js
 */

/* eslint-disable @typescript-eslint/no-require-imports -- Node CLI uses CommonJS. */
const https = require('https');
const fs = require('fs');
const path = require('path');

const PLAYLIST_ID = 'PLJqWcTqh_zKH-673NddaSqiQFIWMMopf_';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'youtube-playlist.json');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`YouTube feed returned HTTP ${res.statusCode}`));
        return;
      }
      res.setEncoding('utf8');
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    request.on('error', reject);
    request.setTimeout(30_000, () => {
      request.destroy(new Error('YouTube feed request timed out'));
    });
  });
}

function parseVideos(xml) {
  // Simple XML parsing — extract <entry> blocks
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    const title = (entry.match(/<title>(.*?)<\/title>/) || [])[1] || '';
    const videoId = (entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/) || [])[1] || '';
    const published = (entry.match(/<published>(.*?)<\/published>/) || [])[1] || '';
    const author = (entry.match(/<author>[\s\S]*?<name>(.*?)<\/name>/) || [])[1] || '';

    if (videoId) {
      entries.push({
        title,
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        date: published.split('T')[0],
        author,
      });
    }
  }

  // Sort by date descending
  entries.sort((a, b) => b.date.localeCompare(a.date));

  if (entries.length === 0) {
    throw new Error('YouTube feed contained no videos; keeping the existing playlist');
  }

  return entries;
}

async function syncPlaylist({ fetchFeed = fetch, outputPath = OUTPUT_PATH } = {}) {
  const entries = parseVideos(await fetchFeed(FEED_URL));
  const output = {
    playlistId: PLAYLIST_ID,
    playlistUrl: `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`,
    lastUpdated: new Date().toISOString(),
    videos: entries,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Synced ${entries.length} videos from playlist -> ${outputPath}`);
}

if (require.main === module) {
  syncPlaylist().catch((err) => {
    console.error('Failed to sync playlist:', err.message);
    process.exitCode = 1;
  });
}

module.exports = { fetchFeed: fetch, parseVideos, syncPlaylist };
