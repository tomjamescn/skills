# Agent Skills Specification (V1)

This specification defines the directory structure, file formats, and metadata schemas for **Agent Skills**.

---

## 1. Directory Structure

A "Skill" is a self-contained folder containing instructions and optional resources.

```
skills/
└── my-skill-name/
    ├── SKILL.md            # [Required] Core metadata and instructions
    ├── scripts/            # [Optional] Scripts the agent can run
    │   └── run.sh
    ├── references/         # [Optional] Supplemental documentation/guides
    │   └── api-reference.md
    └── assets/             # [Optional] Supporting static files
```

---

## 2. The `SKILL.md` File

Every skill directory **MUST** contain a `SKILL.md` file at its root. This file contains metadata and the instructions.

### 2.1 YAML Frontmatter

The `SKILL.md` file must start with a YAML frontmatter block enclosed by triple-dashes (`---`).

#### Metadata Schema

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** | A unique, slug-like name for the skill (e.g. `git-automation`). |
| `description` | `string` | **Yes** | A precise explanation of when this skill should be used. The agent uses this to match tasks to skills. |
| `compatibility` | `string` | No | Requirements/constraints, such as runtime versions or OS (e.g. `node>=18`, `macOS`). |
| `allowed-tools` | `string[]` | No | List of tools the skill is authorized or expected to use. |

#### Example Frontmatter
```yaml
---
name: webapp-testing
description: Use this skill to write, run, and debug Playwright tests for modern web applications.
compatibility: node>=18
allowed-tools:
  - run_command
  - view_file
  - write_to_file
---
```

### 2.2 Markdown Instructions

Following the YAML frontmatter, the markdown body defines the workflow, step-by-step instructions, and checklist for the agent to execute.

- **Conciseness**: Keep the main instruction focused.
- **Progressive Disclosure**: Move detailed reference tables or API docs into the `/references` folder. Use links to refer to them, so they are only loaded if needed.

---

## 3. Tooling and Executables (`scripts/`)

If the skill requires executing custom tools or logic, place them in the `/scripts` directory.
- Avoid installing heavy system-level dependencies.
- Ensure scripts are documented in `SKILL.md` so the agent knows how and when to execute them.
