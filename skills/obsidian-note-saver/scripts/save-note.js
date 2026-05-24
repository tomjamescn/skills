#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

function printUsage() {
  console.log(`
Usage: node save-note.js [options]

Options:
  --title, -t       Title of the note (used as filename and heading) (required)
  --content, -c     Content of the note (required)
  --agent, -a       Agent type/name (e.g. claude-code, opencode, antigravity-cli) (default: auto-detected)
  --vault, -v       Path to the Obsidian vault directory (optional)
  --file, -f        Specific file path to write the note to (optional)
  --help, -h        Show this help message
`);
}

// Parse arguments
const args = process.argv.slice(2);
let title = '';
let content = '';
let agent = '';
let vaultPath = process.env.OBSIDIAN_VAULT_PATH || '';
let specificFilePath = '';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--title' || arg === '-t') {
    title = args[++i];
  } else if (arg === '--content' || arg === '-c') {
    content = args[++i];
  } else if (arg === '--agent' || arg === '-a') {
    agent = args[++i];
  } else if (arg === '--vault' || arg === '-v') {
    vaultPath = args[++i];
  } else if (arg === '--file' || arg === '-f') {
    specificFilePath = args[++i];
  } else if (arg === '--help' || arg === '-h') {
    printUsage();
    process.exit(0);
  }
}

if (!title || !content) {
  console.error('Error: Both --title (-t) and --content (-c) are required.');
  printUsage();
  process.exit(1);
}

// Auto-detect agent
if (!agent) {
  if (process.env.AGY_AGENT_NAME) {
    agent = process.env.AGY_AGENT_NAME;
  } else if (process.env.USER_AGENT) {
    agent = process.env.USER_AGENT;
  } else {
    // Attempt detection via common env patterns
    const envKeys = Object.keys(process.env).join(',');
    if (envKeys.includes('CLAUDE') || envKeys.includes('ANTHROPIC')) {
      agent = 'claude-code';
    } else if (envKeys.includes('GEMINI') || envKeys.includes('ANTIGRAVITY')) {
      agent = 'antigravity-cli (agy)';
    } else {
      agent = 'unknown-agent';
    }
  }
}

// Format local date and time
const now = new Date();
const offset = now.getTimezoneOffset();
const localTime = new Date(now.getTime() - (offset * 60 * 1000));
const dateStr = localTime.toISOString().split('T')[0];
const timeStr = localTime.toISOString().split('T')[1].slice(0, 8);

// Current project directory info
const projectPath = process.cwd();
const projectName = path.basename(projectPath);

// Construct note with frontmatter
const formattedNote = `---
agent: ${agent}
date: ${dateStr}
time: ${timeStr}
project_name: ${projectName}
project_path: ${projectPath}
---

# ${title}

${content}
`;

// Save note if paths are specified, otherwise output to stdout
if (specificFilePath) {
  const resolvedPath = path.resolve(specificFilePath);
  await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
  await fs.writeFile(resolvedPath, formattedNote, 'utf-8');
  console.log(`✓ Note saved successfully to: ${resolvedPath}`);
} else if (vaultPath) {
  const resolvedVaultPath = path.resolve(vaultPath);
  await fs.mkdir(resolvedVaultPath, { recursive: true });
  const cleanTitle = title.replace(/[/\\?%*:|"<>\s]+/g, '_');
  const targetPath = path.join(resolvedVaultPath, `${cleanTitle}.md`);
  await fs.writeFile(targetPath, formattedNote, 'utf-8');
  console.log(`✓ Note saved successfully to Obsidian vault: ${targetPath}`);
} else {
  // Print formatted output for capture by calling agent/MCP
  console.log(formattedNote);
}
