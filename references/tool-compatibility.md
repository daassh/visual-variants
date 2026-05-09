# Tool Compatibility

`visual-variants` is designed as a portable agent skill. The instructions are not tied to one coding agent, framework, package manager, or frontend stack.

## Portable Core

These parts should work across agent environments:

- `SKILL.md`: the main behavior contract for when and how to create visual variants.
- `references/adaptation.md`: the project inspection and adaptation checklist.
- `references/implementation-patterns.md`: implementation decision patterns.
- `assets/`: optional starter templates that an agent can copy and adapt.

The skill does not require a runtime package, CLI, browser extension, or hosted service.

## Codex

Codex can install this skill through a skills CLI or by placing the folder in a supported skills directory such as:

```text
~/.codex/skills/visual-variants/
.agents/skills/visual-variants/
```

When publishing for a skills CLI, keep the YAML metadata at the very top of `SKILL.md`; installers use it to discover `name` and `description`.

Codex should treat `SKILL.md` as the entry point and load reference files only when the task needs deeper guidance.

## Claude Code, Cursor, Gemini CLI, OpenCode, And Similar Agents

Other agents can use this skill if they support reusable instruction files or project-level agent context.

Suggested approach:

1. Place the `visual-variants` folder in the agent's preferred instruction or skill location.
2. Point the agent at `SKILL.md` as the primary instruction file.
3. Keep `references/` and `assets/` available when the agent can read related files.
4. If the agent cannot load related files automatically, paste or import only the specific reference or template needed for the task.

## Single-File Environments

Some agents only support one custom instruction file. In those environments:

- Use `SKILL.md` as the base.
- Copy selected guidance from `references/adaptation.md` when project inspection needs to be explicit.
- Copy selected guidance from `references/implementation-patterns.md` when implementation choices need to be explicit.
- Copy asset templates manually only when they match the target project.

## Compatibility Boundaries

This skill intentionally avoids features that would make portability harder:

- No npm package is required.
- No global command is required.
- No agent-specific API is required.
- No framework-specific dependency is required.
- No production experimentation platform is assumed.

If a target agent has its own skill manifest format, wrap this folder in that format while keeping `SKILL.md` as the source of truth.
