# Implementation Patterns

Use these as decision patterns, not as mandatory templates.

## Vanilla DOM

Best for plain HTML/CSS/JS, static sites, bookmarklets, or unknown stacks.

- Add a root attribute such as `data-visual-variant="1"`.
- Add a small fixed switcher in development.
- Persist the value in local storage or the URL.
- Keep CSS selectors readable and scoped.
- Use `assets/vanilla-visual-variants.ts` as a starter only when the project does not already have a better local preview utility.

## Tailwind

Best when the project already uses utility-first styling.

- Follow existing class composition patterns.
- Use `data-*` variants if the project already enables them.
- Prefer local arrays/maps of class sets when that matches the codebase.
- Avoid adding Tailwind plugins for a small variant task unless the project already uses custom variants heavily.

## Sass or Less

Best when the project uses partials, variables, mixins, or nested component styles.

- Add variant rules near the component's existing styles.
- Reuse variables and mixins.
- Prefer `data-visual-variant` or existing state classes as the selector boundary.
- Keep finalized cleanup aligned across partials and imports.

## CSS Modules

Best when component styles are imported as module objects.

- Add explicit variant classes in the module file.
- Compose class names using the project's existing helper, if any.
- Preserve generated typing workflows when present.

## Component Frameworks

Best when the app already has clear component boundaries.

- React: use a small component, hook, or context only if the scope requires it.
- Vue: use a composable or local component state.
- Svelte: use a store or local component state.
- Astro: use a small client script only where interactivity is required.
- Use `assets/react-visual-variants.tsx` or `assets/vue-visual-variants.ts` as starting points when they match the project's conventions.
- Prefer local component state for one page. Use context, stores, or route state only when variants must coordinate across multiple components.

## Data Attribute Tokens

Best when variants can be expressed as token changes instead of separate component branches.

- Put `data-visual-variant` on `document.documentElement`, the app root, or the smallest stable section root.
- Use custom properties for colors, spacing, shadows, borders, and other reusable values.
- Keep component selectors unchanged where possible.
- Use `assets/css-data-attribute-pattern.css` as a small example, then rename tokens to match the target project.

## Existing Feature Flags

Best when the project already has a preview or flag system.

- Add visual variants as preview-only flags.
- Avoid mixing visual review variants with production experiment allocation unless requested.
- Document how to remove or finalize variants.
