# Obsidian Note Standardized Frontmatter Reference

This reference details the conventions and fields required for saving notes to Obsidian.

## Frontmatter Fields

### 1. `agent`
- **Description**: The type or name of the AI agent calling this skill.
- **Allowed / Recommended Values**:
  - `antigravity-cli (agy)`: Google's Antigravity CLI agent.
  - `claude-code`: Anthropic's Claude Code agent.
  - `opencode`: OpenCode developer agent.
  - `github-copilot`: GitHub Copilot CLI or agent.
  - `custom-agent`: Any customized or user-defined agent.

### 2. `date`
- **Description**: The local calendar date of the note creation.
- **Format**: `YYYY-MM-DD` (ISO-8601 date component in the local timezone).
- **Example**: `2026-05-25`

### 3. `time`
- **Description**: The local time of the note creation.
- **Format**: `HH:mm:ss` (24-hour time format in the local timezone).
- **Example**: `14:32:05`

### 4. `project_name`
- **Description**: The name of the project folder where the agent is executing.
- **Example**: `skills`

### 5. `project_path`
- **Description**: The absolute file path of the project folder.
- **Example**: `/Users/tangwei/workspace/github/tomjamescn/skills`

---

## Integration with `fns mcp`

When using an MCP server like `fns` to save files, follow these guidelines:
1. Generate the note content with the required frontmatter.
2. Call the `fns` write or create file tool, specifying the note's target path inside the Obsidian vault.
3. If direct write isn't possible, use the helper script `scripts/save-note.js` to write directly or print the output.
