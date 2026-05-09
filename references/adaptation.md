# Adaptation Guide

Before implementing a visual variant system, inspect the project and choose an approach that matches what is already there.

## Detection Checklist

- Framework: React, Vue, Svelte, Astro, Solid, Angular, plain HTML, server-rendered templates, or another stack.
- Styling: Tailwind, Sass, Less, CSS Modules, vanilla CSS, scoped styles, CSS-in-JS, design tokens, UI library classes, or theme utilities.
- State and persistence: local component state, global store, URL params, local storage, cookies, feature flags, or existing preview controls.
- App environment: dev-only pages, production routes, Storybook, docs site, embedded widget, bookmarklet, browser extension, or static build.
- Existing conventions: file naming, component boundaries, class naming, token names, import aliases, lint rules, and package manager.

## Adaptation Rules

- If a project has an existing dev toolbar or preview shell, extend it first.
- If a project has design tokens, prefer variant-specific token scopes.
- If a project uses data attributes for themes or states, use the same pattern for variants.
- If a project uses utility classes, compose variant utility sets in the local convention.
- If a project uses Sass or Less, place variant rules near the relevant component or in the existing partial structure.
- If a project uses CSS Modules, keep selectors local and avoid global selectors unless the project already uses them.
- If a project has no clear pattern, use a small vanilla controller that writes `data-visual-variant` on a stable root element.

## Naming

Prefer neutral names:

- `visualVariant`
- `visual-variant`
- `data-visual-variant`
- `mountVisualVariantSwitcher`
- `createVisualVariantController`

Avoid names tied to one project's internal terminology unless the target project already uses those names.

## Production Safety

Default to development-only controls. If the switcher must ship publicly, make that an explicit product decision and ensure accessibility, localization, analytics, and QA expectations are handled.
