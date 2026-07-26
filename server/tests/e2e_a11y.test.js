const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');

test('E2E & PWA Test: Web App Manifest file is valid JSON with shortcuts and icons', () => {
  const manifestPath = path.join(rootDir, 'client/public/manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist');

  const content = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  assert.equal(content.short_name, 'LifeOS');
  assert.equal(content.display, 'standalone');
  assert.ok(Array.isArray(content.icons) && content.icons.length >= 2);
  assert.ok(Array.isArray(content.shortcuts) && content.shortcuts.length >= 2);
});

test('E2E & PWA Test: Service Worker script sw.js exists with cache-first logic', () => {
  const swPath = path.join(rootDir, 'client/public/sw.js');
  assert.ok(fs.existsSync(swPath), 'sw.js must exist');

  const content = fs.readFileSync(swPath, 'utf-8');
  assert.ok(content.includes('CACHE_NAME'), 'Service worker must specify CACHE_NAME');
  assert.ok(content.includes('caches.open'), 'Service worker must open cache');
});

test('TWA & Deep Linking Test: Digital Asset Links assetlinks.json exists and is valid', () => {
  const assetPath = path.join(rootDir, 'client/public/.well-known/assetlinks.json');
  assert.ok(fs.existsSync(assetPath), 'assetlinks.json must exist');

  const content = JSON.parse(fs.readFileSync(assetPath, 'utf-8'));
  assert.ok(Array.isArray(content));
  assert.equal(content[0].target.package_name, 'app.lifeos.twa');
});

test('Accessibility (a11y) Test: index.html contains viewport, lang, and manifest link', () => {
  const indexPath = path.join(rootDir, 'client/index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');

  assert.ok(content.includes('lang="en"'), 'HTML must declare lang attribute');
  assert.ok(content.includes('name="viewport"'), 'HTML must declare viewport meta tag');
  assert.ok(content.includes('rel="manifest"'), 'HTML must link to Web App Manifest');
});
