#!/usr/bin/env node

/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Build single-file executables for Gemini Sharp
 * Uses Bun's compile feature for true standalone binaries with ESM support
 */

import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  existsSync,
  copyFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist-single');
const bundleDir = join(rootDir, 'bundle');

// Bun compile targets
const targets = {
  'linux-x64': 'bun-linux-x64',
  'linux-arm64': 'bun-linux-arm64',
  'mac-x64': 'bun-darwin-x64',
  'mac-arm64': 'bun-darwin-arm64',
  'win-x64': 'bun-windows-x64',
};

const outputNames = {
  'linux-x64': 'gsharp',
  'linux-arm64': 'gsharp',
  'mac-x64': 'gsharp',
  'mac-arm64': 'gsharp',
  'win-x64': 'gsharp.exe',
};

function run(command, args, options = {}) {
  console.log(`> ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: rootDir,
    ...options,
  });
  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
  return result;
}

function getCurrentPlatform() {
  const platform = process.platform;
  const arch = process.arch;
  if (platform === 'win32') return 'win-x64';
  if (platform === 'darwin') return arch === 'arm64' ? 'mac-arm64' : 'mac-x64';
  return arch === 'arm64' ? 'linux-arm64' : 'linux-x64';
}

function ensureBundle() {
  const bundleFile = join(bundleDir, 'gemini.js');
  if (!existsSync(bundleFile)) {
    console.log('Bundle not found, building...');
    run('npm', ['run', 'bundle']);
  }
  return bundleFile;
}

function buildForPlatform(platform, bundlePath) {
  const target = targets[platform];
  const outputName = outputNames[platform];
  const platformDir = join(distDir, platform);
  const outputPath = join(platformDir, outputName);

  mkdirSync(platformDir, { recursive: true });

  console.log(`\nBuilding single-file for ${platform}...`);

  // Use Bun to compile (bun should be in PATH from setup-bun action)
  run('bun', [
    'build',
    bundlePath,
    '--compile',
    '--target',
    target,
    '--outfile',
    outputPath,
    '--minify',
  ]);

  // Copy native addons alongside (node-pty still needs .node files)
  copyNativeAddons(platform, platformDir);

  console.log(`  Built: ${outputPath}`);
  return outputPath;
}

function copyNativeAddons(platform, destDir) {
  const ptyMap = {
    'win-x64': '@lydell/node-pty-win32-x64',
    'mac-x64': '@lydell/node-pty-darwin-x64',
    'mac-arm64': '@lydell/node-pty-darwin-arm64',
    'linux-x64': '@lydell/node-pty-linux-x64',
    'linux-arm64': '@lydell/node-pty-linux-arm64',
  };

  const ptyPackage = ptyMap[platform];
  if (!ptyPackage) return;

  try {
    const ptyPath = join(rootDir, 'node_modules', ptyPackage);
    if (existsSync(ptyPath)) {
      const files = readdirSync(ptyPath).filter((f) => f.endsWith('.node'));
      for (const file of files) {
        copyFileSync(join(ptyPath, file), join(destDir, file));
        console.log(`  Copied addon: ${file}`);
      }
    }
  } catch (_e) {
    console.warn(`  Warning: Could not copy native addons`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const buildAll = args.includes('--all');
  const specificPlatform = args.find((a) => !a.startsWith('--'));

  // Check if bun is available
  const bunCheck = spawnSync('bun', ['--version'], { stdio: 'pipe' });
  if (bunCheck.status !== 0) {
    console.error(
      'Bun not found. Install with: curl -fsSL https://bun.sh/install | bash',
    );
    process.exit(1);
  }
  console.log(`Using Bun ${bunCheck.stdout.toString().trim()}`);

  // Clean and create dist directory
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true });
  }
  mkdirSync(distDir, { recursive: true });

  // Ensure bundle exists
  const bundlePath = ensureBundle();

  // Build executables
  if (buildAll) {
    console.log('\nBuilding for all platforms...');
    for (const platform of Object.keys(targets)) {
      try {
        buildForPlatform(platform, bundlePath);
      } catch (err) {
        console.error(`Failed to build for ${platform}:`, err.message);
      }
    }
  } else if (specificPlatform && targets[specificPlatform]) {
    buildForPlatform(specificPlatform, bundlePath);
  } else if (specificPlatform) {
    console.error(`Unknown platform: ${specificPlatform}`);
    console.log('Available:', Object.keys(targets).join(', '));
    process.exit(1);
  } else {
    buildForPlatform(getCurrentPlatform(), bundlePath);
  }

  console.log('\nDone! Single-file executables are in dist-single/');
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
