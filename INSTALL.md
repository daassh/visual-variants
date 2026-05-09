# Installation

`visual-variants` is distributed as an Agent Skill. The core requirement is that the target agent can read the installed directory and use `SKILL.md` as the entry point.

## Recommended: skills CLI

Install from GitHub shorthand:

```bash
npx skills add daassh/visual-variants
```

The repository `SKILL.md` must start with YAML metadata so the skills CLI can discover it:

```md
---
name: visual-variants
description: Create and maintain project-native visual variant systems for comparing multiple UI directions inside real frontend codebases.
---
```

Repository URL:

https://github.com/daassh/visual-variants

## Local Development

Install from a local checkout while developing the skill:

```bash
npx skills add ./visual-variants
```

Run that command from the parent directory that contains the `visual-variants` folder.

## Manual Install: Codex

If your agent environment does not use the `skills` CLI, copy this folder into one of the supported skill locations:

```text
~/.codex/skills/visual-variants/
.agents/skills/visual-variants/
```

The installed directory should contain `SKILL.md` at its top level.

## Manual Install: Other Agents

For other coding agents, install the folder wherever that agent expects reusable instructions, prompt skills, or project-level agent guidance. Keep the directory intact:

```text
visual-variants/
├── SKILL.md
├── README.md
├── INSTALL.md
├── references/
└── assets/
```

If the agent only supports a single instruction file, use `SKILL.md` as the primary source and manually copy only the relevant sections from `references/` or `assets/` when needed.

Known portability expectations:

- `SKILL.md` contains the behavior that should survive across tools.
- `README.md` and `INSTALL.md` are mainly for humans.
- `references/` provides optional deeper guidance.
- `assets/` provides optional starter templates, not mandatory dependencies.

See `references/tool-compatibility.md` for more detail.

## Verification

After installation, ask your agent:

```text
Use visual-variants to add two visual directions to this component.
```

The agent should inspect the target project first, then choose an implementation that matches the existing framework and styling system.
