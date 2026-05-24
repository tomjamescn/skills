import fs from 'fs/promises';
import path from 'path';
import YAML from 'yaml';

// ANSI escape codes for beautiful coloring
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

async function validateSkills() {
  const skillsDir = path.resolve('skills');
  let hasErrors = false;

  console.log(`${colors.bold}${colors.cyan}=== Running Agent Skills Linter ===${colors.reset}\n`);

  try {
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    const skillFolders = entries.filter((entry) => entry.isDirectory());

    if (skillFolders.length === 0) {
      console.log(`${colors.yellow}No skills found in the 'skills/' directory.${colors.reset}`);
      return;
    }

    const uniqueNames = new Set();

    for (const folder of skillFolders) {
      const folderPath = path.join(skillsDir, folder.name);
      const skillMdPath = path.join(folderPath, 'SKILL.md');

      console.log(`Checking skill in: ${colors.bold}${folder.name}${colors.reset}`);

      // 1. Check if SKILL.md exists
      try {
        await fs.access(skillMdPath);
      } catch {
        console.error(`  ${colors.red}✗ Error: Missing SKILL.md in skills/${folder.name}${colors.reset}`);
        hasErrors = true;
        continue;
      }

      // 2. Read and parse SKILL.md
      const content = await fs.readFile(skillMdPath, 'utf-8');
      const frontmatterRegex = /^---([\s\S]*?)---/;
      const match = content.match(frontmatterRegex);

      if (!match) {
        console.error(`  ${colors.red}✗ Error: SKILL.md must start with YAML frontmatter enclosed in '---'${colors.reset}`);
        hasErrors = true;
        continue;
      }

      const yamlString = match[1];
      const markdownBody = content.slice(match[0].length);

      let frontmatter;
      try {
        frontmatter = YAML.parse(yamlString);
      } catch (err) {
        console.error(`  ${colors.red}✗ Error: Failed to parse YAML frontmatter: ${err.message}${colors.reset}`);
        hasErrors = true;
        continue;
      }

      if (!frontmatter || typeof frontmatter !== 'object') {
        console.error(`  ${colors.red}✗ Error: Frontmatter is empty or invalid.${colors.reset}`);
        hasErrors = true;
        continue;
      }

      // 3. Validate metadata fields
      const { name, description, compatibility, 'allowed-tools': allowedTools } = frontmatter;

      // Validate name
      if (!name) {
        console.error(`  ${colors.red}✗ Error: Missing 'name' in frontmatter.${colors.reset}`);
        hasErrors = true;
      } else if (typeof name !== 'string') {
        console.error(`  ${colors.red}✗ Error: 'name' must be a string (got ${typeof name}).${colors.reset}`);
        hasErrors = true;
      } else if (name !== folder.name) {
        console.error(`  ${colors.yellow}⚠ Warning: Skill 'name' (${name}) does not match directory name (${folder.name}). Recommended to match.${colors.reset}`);
      } else if (uniqueNames.has(name)) {
        console.error(`  ${colors.red}✗ Error: Duplicate skill name '${name}' found.${colors.reset}`);
        hasErrors = true;
      } else {
        uniqueNames.add(name);
      }

      // Validate description
      if (!description) {
        console.error(`  ${colors.red}✗ Error: Missing 'description' in frontmatter.${colors.reset}`);
        hasErrors = true;
      } else if (typeof description !== 'string') {
        console.error(`  ${colors.red}✗ Error: 'description' must be a string.${colors.reset}`);
        hasErrors = true;
      } else {
        if (description.length < 10) {
          console.error(`  ${colors.yellow}⚠ Warning: 'description' is too short (${description.length} chars). Agents might not trigger it properly.${colors.reset}`);
        } else if (description.length > 300) {
          console.error(`  ${colors.yellow}⚠ Warning: 'description' is too long (${description.length} chars). Keep under 300 characters to conserve agent context window.${colors.reset}`);
        }
      }

      // Validate compatibility (optional)
      if (compatibility && typeof compatibility !== 'string') {
        console.error(`  ${colors.red}✗ Error: 'compatibility' must be a string.${colors.reset}`);
        hasErrors = true;
      }

      // Validate allowed-tools (optional)
      if (allowedTools) {
        if (!Array.isArray(allowedTools)) {
          console.error(`  ${colors.red}✗ Error: 'allowed-tools' must be an array of strings.${colors.reset}`);
          hasErrors = true;
        } else {
          for (const tool of allowedTools) {
            if (typeof tool !== 'string') {
              console.error(`  ${colors.red}✗ Error: Tool name '${tool}' in 'allowed-tools' must be a string.${colors.reset}`);
              hasErrors = true;
            }
          }
        }
      }

      // 4. Validate internal markdown links (relative links pointing to scripts/references)
      const linkRegex = /\[[^\]]*\]\(([^)]+)\)/g;
      let linkMatch;
      while ((linkMatch = linkRegex.exec(markdownBody)) !== null) {
        const linkPath = linkMatch[1];
        // Check only relative local files (avoid web URLs or anchors)
        if (!linkPath.startsWith('http://') && !linkPath.startsWith('https://') && !linkPath.startsWith('#')) {
          const resolvedLinkPath = path.resolve(folderPath, linkPath);
          try {
            await fs.access(resolvedLinkPath);
          } catch {
            console.error(`  ${colors.red}✗ Error: Broken link in SKILL.md: '${linkPath}' does not exist.${colors.reset}`);
            hasErrors = true;
          }
        }
      }

      if (!hasErrors) {
        console.log(`  ${colors.green}✓ Passed${colors.reset}`);
      }
      console.log('');
    }

    if (hasErrors) {
      console.error(`${colors.red}${colors.bold}Linter Failed: One or more validation errors occurred.${colors.reset}`);
      process.exit(1);
    } else {
      console.log(`${colors.green}${colors.bold}Linter Passed: All skills are valid!${colors.reset}`);
      process.exit(0);
    }
  } catch (err) {
    console.error(`${colors.red}Linter crashed: ${err.message}${colors.reset}`);
    process.exit(1);
  }
}

validateSkills();
