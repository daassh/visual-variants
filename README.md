# visual-variants

`visual-variants` is an Agent Skill for creating project-native visual variant switchers in frontend codebases.

It helps an AI coding agent add a small, maintainable way to compare multiple UI directions directly inside the real app. The skill is intentionally framework-agnostic: it adapts to the project's existing frontend stack and styling system instead of forcing a package, framework, or design convention.

The skill is portable by design. Codex can use it directly as a skill, and other coding agents can reuse the same `SKILL.md`, reference files, and starter templates when their instruction system allows it.

## What It Does

- Detects the target project's frontend framework and styling approach.
- Adds or extends a lightweight visual variant switcher.
- Implements variant styles using the project's own conventions.
- Keeps visual experiments reviewable in the actual product surface.
- Helps finalize one direction without leaving stale variant code behind.

## What It Is Not

- Not a production A/B testing platform.
- Not an analytics or traffic allocation system.
- Not a Tailwind-only, React-only, or framework-specific package.
- Not a replacement for Storybook, design systems, or feature flag tools.
- Not a CLI, npm package, browser extension, or hosted service.

## Example Requests

```text
Add three visual directions for this dashboard and let me switch between them.
```

```text
Create a visual variant switcher for this page using the project's existing styling setup.
```

```text
Finalize variant 2 and clean up the unused visual alternatives.
```

## Installation

```bash
npx skills add <owner>/visual-variants
```

For local development:

```bash
npx skills add ./visual-variants
```

See [INSTALL.md](./INSTALL.md) for local, global, and GitHub installation notes.

## Tool Compatibility

The runtime entry point is [SKILL.md](./SKILL.md). `README.md` and `INSTALL.md` are mainly for humans, while `references/` and `assets/` provide optional deeper guidance and starter templates.

See [tool compatibility](./references/tool-compatibility.md) for notes on using this skill with Codex, Claude Code, Cursor, Gemini CLI, OpenCode, or other agents that support reusable instruction files.

## Repository Structure

```text
visual-variants/
├── SKILL.md
├── README.md
├── INSTALL.md
├── references/
│   ├── adaptation.md
│   ├── implementation-patterns.md
│   └── tool-compatibility.md
└── assets/
    ├── css-data-attribute-pattern.css
    ├── react-visual-variants.tsx
    ├── vue-visual-variants.ts
    └── vanilla-visual-variants.ts
```

## Complexity Boundary

This project intentionally stays small. Larger skill packs may include CLIs, generated websites, browser extensions, command systems, or platform-specific packaging. `visual-variants` avoids that until there is a concrete need. Its value should come from clear agent instructions, native project adaptation, and a few useful implementation patterns.

## Design Philosophy

Visual variants should feel native to the project they live in.

If the project uses Tailwind, the agent should use Tailwind-shaped solutions. If it uses Sass, the agent should use Sass-shaped solutions. If it uses scoped component styles, CSS Modules, design tokens, or plain CSS, the output should follow those patterns. The point is not to ship one universal UI widget; the point is to give the agent a reliable workflow for choosing the right implementation for each codebase.
