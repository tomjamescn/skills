# Custom Agent Skills Library

A portable, standard-compliant library for packaging custom instructions, workflows, and execution scripts for AI coding agents (such as Claude Code, Cursor, and Copilot).

This repository follows the open **[Agent Skills Specification](spec/agent-skills-spec.md)** developed by Anthropic.

---

## 📂 Repository Structure

Each "skill" is a self-contained directory containing instructions and optional resources to automate or guide specific developer tasks.

```
├── .gitignore
├── package.json
├── README.md
├── scripts/
│   ├── validate.js         # Linter for skill structure and YAML metadata
│   └── create-skill.js     # Bootstrapper tool to initialize new skills
├── spec/
│   └── agent-skills-spec.md # The official Agent Skills specification
└── skills/
    └── template-skill/     # Example/template skill folder
        ├── SKILL.md        # Core instructions & metadata
        ├── scripts/        # Executable scripts (e.g. run.sh)
        └── references/     # Deep-dive guides/APIs (progressive disclosure)
```

---

## 🚀 Getting Started

### 1. Install Dependencies
This project uses Node.js for validation and bootstrapping tooling.
```bash
npm install
```

### 2. Create a New Skill
To quickly bootstrap a new skill directory (e.g., `my-custom-skill`):
```bash
npm run create my-custom-skill
```
This command automatically creates:
- `skills/my-custom-skill/SKILL.md` (pre-filled template)
- `skills/my-custom-skill/scripts/run.sh` (executable script)
- `skills/my-custom-skill/references/api-reference.md` (reference doc)

### 3. Validate Your Skills
To ensure all your skills conform to the metadata guidelines and have valid file links:
```bash
npm run lint
```

---

## 💡 Best Practices

*   **Optimized Descriptions**: Keep your YAML `description` under 300 characters. Make sure it explicitly states *when* the agent should load the skill (e.g., *"Use this skill to deploy a Next.js application to Vercel and run smoke tests"*).
*   **Progressive Disclosure**: Keep the main `SKILL.md` file focused on high-level workflows. Put detailed logs, lists of arguments, schema files, and deep APIs into the `references/` folder and link to them using standard relative links.
*   **Self-Contained Executables**: If a skill needs script logic, place it inside the skill's `scripts/` directory so it travels with the skill.
