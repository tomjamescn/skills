---
name: template-skill
description: Use this skill as a template or starting point for authoring new agent skills.
compatibility: macOS
allowed-tools:
  - run_command
  - view_file
---

# Template Skill

This is a reference skill demonstrating the structure and formatting standards for the Agent Skills library.

## Quickstart

To run the sample script included in this skill, execute:
```bash
./skills/template-skill/scripts/run.sh
```

## Workflow

1. **Discovery & Setup**: The agent identifies this skill because the user's task matches the skill's description.
2. **Execution**: The agent runs [run.sh](scripts/run.sh) if requested to demonstrate custom command execution.
3. **Reference Lookup**: For technical details, refer to the [api-reference.md](references/api-reference.md) document rather than loading it all in the main prompt.

## Available Scripts

- [run.sh](scripts/run.sh): Prints a greeting and logs environment info.

## References

- [api-reference.md](references/api-reference.md): Contains additional metadata.
