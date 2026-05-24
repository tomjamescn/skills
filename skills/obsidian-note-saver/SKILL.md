---
name: obsidian-note-saver
description: Formats and saves markdown notes to Obsidian with standardized frontmatter metadata (agent, date, time, project name, and project path).
compatibility: all
allowed-tools:
  - run_command
---

# Obsidian Note Saver

This skill ensures that notes saved to Obsidian (manually or via MCP tools like `fns mcp`) follow a strict frontmatter format to capture execution context.

## Quickstart

Run the helper node script to format and output a note, or write it directly:
```bash
node skills/obsidian-note-saver/scripts/save-note.js -t "My Note Title" -c "My Note Content"
```

## Workflow

1. **Information Gathering**: Identify the current agent name, project name, full project path, and local date/time.
2. **Formatting**: Format the note with YAML frontmatter at the very top:
   - `agent`: The name/type of the active agent (e.g. `antigravity-cli (agy)`, `claude-code`, etc.).
   - `date`: Today's local date (`YYYY-MM-DD`).
   - `time`: Current local time (`HH:mm:ss`).
   - `project_name`: Current directory name.
   - `project_path`: Current directory absolute path.
3. **Execution (via fns mcp)**: Use the `fns` MCP tools (or other file-writing tools) to save the formatted markdown note into the Obsidian vault under the directory `0-收件箱/agent笔记/`.
   - If using the helper script, run `node skills/obsidian-note-saver/scripts/save-note.js --title "<Title>" --content "<Content>" --vault "<VaultPath>"` to write directly to `<VaultPath>/0-收件箱/agent笔记/`.
4. **Validation**: Check that the frontmatter contains all 5 required fields and that the Markdown compiles cleanly.

## Available Scripts

- [save-note.js](scripts/save-note.js): A Node.js CLI script to format notes and output them or write them to the vault.

## References

- [api-reference.md](references/api-reference.md): Lists recommended values, formats, and integration notes for Obsidian frontmatter.
