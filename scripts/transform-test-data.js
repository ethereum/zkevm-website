/**
 * Transform raw test monitor data from eth-act/zkevm-test-monitor
 * into a simplified summary for the website.
 *
 * Input:  src/data/test-monitor-raw/{zkvm}-act4-{standard,full}.json
 * Output: src/data/test-monitor-summary.json
 *
 * Each input file has the format:
 * {
 *   "zkvm": "jolt",
 *   "suite": "act4-standard",
 *   "runs": [{ "date": "...", "commit": "...", "isa": "...", "total": N, "passed": [...], "failed": [...] }]
 * }
 */

const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, '..', 'src', 'data', 'test-monitor-raw');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'test-monitor-summary.json');

function parseFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8').trim();
  if (!content || content === '404: Not Found') return null;
  try {
    const data = JSON.parse(content);
    const runs = data.runs || [];
    if (!runs.length) return null;
    // runs are stored oldest-first; pick the most recent by date
    const run = runs.reduce((latest, r) =>
      new Date(r.date) > new Date(latest.date) ? r : latest
    );
    const passed = Array.isArray(run.passed) ? run.passed.length : 0;
    const failed = Array.isArray(run.failed) ? run.failed.length : 0;
    const total = run.total || (passed + failed);
    return { passed, failed, total, date: run.date, commit: run.commit, isa: run.isa };
  } catch { return null; }
}

try {
  const summary = { lastUpdated: new Date().toISOString(), zkvms: {} };

  if (!fs.existsSync(rawDir)) {
    console.error('Raw data directory not found:', rawDir);
    process.exit(1);
  }

  // Discover zkVM names from filenames
  const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.json'));
  const zkvmNames = [...new Set(files.map(f => f.replace(/-act4-(standard|full)\.json$/, '')))];

  for (const name of zkvmNames) {
    const standard = parseFile(path.join(rawDir, `${name}-act4-standard.json`));
    const full = parseFile(path.join(rawDir, `${name}-act4-full.json`));

    if (!standard && !full) {
      console.warn(`Skipping ${name} — no data`);
      continue;
    }

    const isa = (standard || full).isa || 'unknown';

    summary.zkvms[name] = {
      isa,
      commit: (standard || full).commit || null,
      lastRun: (standard || full).date || null,
      isRV64: isa.toUpperCase().startsWith('RV64'),
      full: full ? {
        passed: full.passed,
        failed: full.failed,
        total: full.total,
        passRate: full.total > 0 ? ((full.passed / full.total) * 100).toFixed(1) : '0.0',
      } : null,
      standard: standard ? {
        passed: standard.passed,
        failed: standard.failed,
        total: standard.total,
        passRate: standard.total > 0 ? ((standard.passed / standard.total) * 100).toFixed(1) : '0.0',
      } : null,
    };
  }

  // An empty summary means every fetch failed (e.g. the upstream path moved);
  // fail instead of overwriting the last good data.
  if (Object.keys(summary.zkvms).length === 0) {
    console.error('No zkVM data found in', rawDir);
    process.exit(1);
  }

  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
  console.log(`Transformed ${Object.keys(summary.zkvms).length} zkVMs -> ${outputPath}`);
} catch (err) {
  console.error('Failed to transform test data:', err.message);
  process.exit(1);
}
