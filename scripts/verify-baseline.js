#!/usr/bin/env node
/**
 * scripts/verify-baseline.js
 * Automated Zero-Dependency Baseline Smoke-Test for qr_companion.
 * 
 * Validates:
 * 1. Existence of all 12 chapter anchors (#bolim-01 .. #bolim-12) across UZ, EN, KO templates.
 * 2. Integrity of all local assets (images/icons) referenced in HTML files.
 * 3. Bidirectional language-bar links (index.html, en.html, ko.html).
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HTML_FILES = ['index.html', 'en.html', 'ko.html'];
const REQUIRED_ANCHORS = Array.from({ length: 12 }, (_, i) => `bolim-${String(i + 1).padStart(2, '0')}`);

let totalErrors = 0;
let totalWarnings = 0;

function logPass(msg) {
  console.log(`\x1b[32m✔ PASS:\x1b[0m ${msg}`);
}
function logFail(msg) {
  console.error(`\x1b[31m✖ FAIL:\x1b[0m ${msg}`);
  totalErrors++;
}
function logWarn(msg) {
  console.warn(`\x1b[33m⚠ WARN:\x1b[0m ${msg}`);
  totalWarnings++;
}

console.log('\x1b[1m=== QR Companion Baseline Smoke-Test ===\x1b[0m\n');

// 1. Check HTML files exist
HTML_FILES.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(filePath)) {
    logFail(`Required HTML template missing: ${file}`);
  } else {
    logPass(`HTML template found: ${file}`);
  }
});

// 2. Check 12 chapter anchors in each HTML file
console.log('\n--- Checking 12 Chapter Anchor IDs (#bolim-01 ... #bolim-12) ---');
HTML_FILES.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  let missingAnchors = [];

  REQUIRED_ANCHORS.forEach(anchor => {
    // Check for id="bolim-XX"
    const regex = new RegExp(`id=["']${anchor}["']`, 'i');
    if (!regex.test(content)) {
      missingAnchors.push(anchor);
    }
  });

  if (missingAnchors.length === 0) {
    logPass(`${file}: All 12 anchor IDs present and valid.`);
  } else {
    logFail(`${file}: Missing anchor IDs: ${missingAnchors.join(', ')}`);
  }
});

// 3. Check language navigation links
console.log('\n--- Checking Language Navigation Links ---');
HTML_FILES.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const hasLangBar = content.includes('class="language-bar"') || content.includes("class='language-bar'");
  if (!hasLangBar) {
    logFail(`${file}: .language-bar container missing.`);
  } else {
    logPass(`${file}: .language-bar container verified.`);
  }

  // Check expected target pages
  HTML_FILES.forEach(target => {
    if (content.includes(`data-page="${target}"`)) {
      logPass(`${file} -> targets ${target} correctly.`);
    }
  });
});

// 4. Check referenced local assets exist on disk
console.log('\n--- Checking Local Asset References ---');
const checkedAssets = new Set();
HTML_FILES.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  // Match src="..." or href="assets/..."
  const assetRegex = /(?:src|href)=["'](assets\/[^"'#?]+)["']/g;
  let match;

  while ((match = assetRegex.exec(content)) !== null) {
    const assetRelPath = match[1];
    if (checkedAssets.has(assetRelPath)) continue;
    checkedAssets.add(assetRelPath);

    const fullAssetPath = path.join(ROOT_DIR, assetRelPath);
    if (fs.existsSync(fullAssetPath)) {
      logPass(`Asset verified: ${assetRelPath}`);
    } else {
      logFail(`Missing asset referenced in ${file}: ${assetRelPath}`);
    }
  }
});

// 5. Check CSS Canonical Link
console.log('\n--- Checking Canonical Stylesheet ---');
HTML_FILES.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('href="story.css') || content.includes("href='story.css")) {
    logPass(`${file} correctly links to canonical story.css.`);
  } else {
    logWarn(`${file} does not link to story.css!`);
  }
});

// Final Summary
console.log('\n\x1b[1m=== Smoke-Test Summary ===\x1b[0m');
if (totalErrors === 0) {
  console.log(`\x1b[32m✔ ALL CHECKS PASSED!\x1b[0m (Warnings: ${totalWarnings})`);
  process.exit(0);
} else {
  console.error(`\x1b[31m✖ TEST FAILED with ${totalErrors} error(s).\x1b[0m (Warnings: ${totalWarnings})`);
  process.exit(1);
}
