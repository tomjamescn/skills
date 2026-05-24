import fs from 'fs/promises';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

async function createSkill() {
  const arg = process.argv[2];
  if (!arg) {
    console.error(`${colors.red}Error: Please provide a skill name.${colors.reset}`);
    console.log(`Usage: ${colors.bold}npm run create <skill-name>${colors.reset}`);
    process.exit(1);
  }

  // Format to standard slug
  const skillName = arg
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (!skillName) {
    console.error(`${colors.red}Error: Invalid skill name '${arg}'.${colors.reset}`);
    process.exit(1);
  }

  const skillDir = path.resolve('skills', skillName);

  try {
    // Check if directory already exists
    try {
      await fs.access(skillDir);
      console.error(`${colors.red}Error: A skill named '${skillName}' already exists at skills/${skillName}.${colors.reset}`);
      process.exit(1);
    } catch {
      // Directory doesn't exist, which is what we want
    }

    // Create directories
    await fs.mkdir(skillDir, { recursive: true });
    await fs.mkdir(path.join(skillDir, 'scripts'), { recursive: true });
    await fs.mkdir(path.join(skillDir, 'references'), { recursive: true });

    // Write SKILL.md template
    const skillMdContent = `---
name: ${skillName}
description: Write a 1-2 sentence description of when the agent should use this skill. Keep it precise.
compatibility: all
allowed-tools:
  - run_command
---

# ${skillName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}

Provide a clear and actionable overview of what this skill does and how the agent should execute it.

## Quickstart

Describe the quick steps to get started with this skill.

## Workflow

1. Step 1: Explain what the agent should check or prepare.
2. Step 2: Detail how to run scripts or commands.
3. Step 3: Outline validation and quality checks.

## Available Scripts

- [run.sh](scripts/run.sh): Brief description of what the script does.

## References

- [api-reference.md](references/api-reference.md): Supplemental details.
`;

    await fs.writeFile(path.join(skillDir, 'SKILL.md'), skillMdContent, 'utf-8');

    // Write placeholder script
    const scriptContent = `#!/bin/bash
# Sample script for skill: ${skillName}
set -e

echo "Running script for skill: ${skillName}"
# Add your custom logic here
`;
    const scriptPath = path.join(skillDir, 'scripts', 'run.sh');
    await fs.writeFile(scriptPath, scriptContent, 'utf-8');
    
    // Set execution permissions (mac/linux)
    try {
      await fs.chmod(scriptPath, 0o755);
    } catch (err) {
      // Ignore errors on platforms where chmod fails (e.g. Windows)
    }

    // Write placeholder reference file
    const referenceContent = `# References for ${skillName}

Add API documentation, design systems, cheatsheets, or external command options here.
Keeping this separate from SKILL.md keeps the agent's startup context clean!
`;
    await fs.writeFile(path.join(skillDir, 'references', 'api-reference.md'), referenceContent, 'utf-8');

    console.log(`${colors.green}${colors.bold}✓ Successfully created skill '${skillName}'!${colors.reset}`);
    console.log(`Path: ${colors.cyan}skills/${skillName}/${colors.reset}\n`);
    console.log(`Next steps:`);
    console.log(`  1. Edit ${colors.bold}skills/${skillName}/SKILL.md${colors.reset} to document your workflow.`);
    console.log(`  2. Add logic to ${colors.bold}skills/${skillName}/scripts/run.sh${colors.reset}.`);
    console.log(`  3. Run ${colors.bold}npm run lint${colors.reset} to validate your new skill.\n`);

  } catch (err) {
    console.error(`${colors.red}Failed to create skill: ${err.message}${colors.reset}`);
    process.exit(1);
  }
}

createSkill();
