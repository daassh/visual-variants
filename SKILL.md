---
name: visual-variants
description: Create and maintain project-native visual variant systems for comparing multiple UI directions inside real frontend codebases.
---

# visual-variants

Use this skill when a user wants to compare, prototype, switch, preserve, or review multiple visual directions inside a real frontend codebase. Typical requests mention visual variants, design options, alternate UI directions, A/B UI drafts, layout candidates, theme trials, style explorations, design versions, or a small developer-only switcher for comparing implementations. Non-English requests should trigger this skill too when they describe the same intent, such as Chinese requests mentioning 视觉变体, 设计版本, 多个 UI 方向, 界面方案, 视觉方案, 设计方案, or 切换比较.

This skill is agent-agnostic. It is written to work as a portable skill/spec for coding agents that can read `SKILL.md`, optional files in `references/`, and optional starter templates in `assets/`. Codex-specific installation paths are documentation details, not a requirement of the skill itself.

## Goal

Create and maintain a project-native visual variant system. The result should feel like it belongs to the target project instead of importing a foreign framework, styling convention, or build pattern.

## Core Principles

- Fit the existing project first. Detect the framework, styling approach, component patterns, build tool, naming conventions, and design tokens before proposing implementation details.
- Stay framework-agnostic. This skill can support React, Vue, Svelte, Astro, Solid, plain HTML/CSS/JS, server-rendered templates, and other frontend stacks.
- Stay style-system native. Use the project's existing CSS strategy: Tailwind, Sass, Less, CSS Modules, vanilla CSS, scoped component styles, CSS-in-JS, design tokens, or existing theme utilities.
- Prefer small runtime surfaces. Add the minimum switcher/controller needed to compare variants without taking over the app.
- Keep variants inspectable. Variants should map to clear DOM attributes, classes, component props, route state, local storage, query params, or existing feature flag systems.
- Preserve useful experimentation tools. When a visual direction is finalized, remove dead candidate UI if requested, but keep reusable visual-variant infrastructure when it may help future work.
- Avoid production leakage. Default to development-only mounting unless the user explicitly wants public-facing variant controls.
- Do not stop at creating helper files. A visible switcher must be mounted into the app, page, layout, preview shell, or existing dev toolbar unless the user explicitly asks for state-only variants.
- Do not add explanatory review copy to the UI being compared. Variant names, rationale, comparison notes, or implementation explanations belong in agent responses, comments, docs, or hidden metadata, not inside the target product DOM.

## Workflow

1. Inspect the target project.
   - Identify framework, router, bundler, package manager, and styling system.
   - Locate nearby components, layouts, style files, design tokens, or existing developer tools.
   - Check whether there is already a theme switcher, feature flag system, storybook setup, preview toolbar, or experiment utility.
   - Read `references/adaptation.md` when the project structure or styling system is not obvious.

2. Choose the least foreign integration point.
   - Component apps: prefer a small component/hook/composable/action that follows local patterns.
   - Static or server-rendered apps: prefer a small DOM controller and data attributes/classes.
   - Tokenized systems: prefer switching token scopes or variant attributes instead of duplicating full styles.
   - Existing dev toolbar: extend it instead of adding a second floating control.
   - Read `references/implementation-patterns.md` when choosing between DOM attributes, local component state, tokens, CSS modules, utility classes, or feature flags.

3. Implement variants in the project's own language.
   - Tailwind projects should primarily use existing class composition conventions, config tokens, and data/class variants already present in the codebase.
   - Sass/Less projects should use existing partials, variables, mixins, nesting style, and import organization.
   - CSS Modules projects should keep variant classes local and typed when the project uses typing.
   - Scoped component styles should keep styles close to the component unless the project has a central design layer.
   - Plain CSS projects should use readable selectors, custom properties, and data attributes.
   - Keep the target UI faithful to the product surface. Do not insert headings, captions, banners, helper paragraphs, side notes, "variant direction" summaries, or multi-variant explanations into the component/page just to explain the experiment.
   - If variant metadata is needed for maintainers, keep it outside visible product DOM: variant arrays, code comments, Storybook metadata, docs, final response summaries, or `title`/`aria-label` on the switcher controls when appropriate. Use `title` for optional hover metadata and `aria-label` for assistive names; do not rely on `aria-label` as a visible tooltip.
   - Use files in `assets/` only as starter patterns. Adapt them to local framework, naming, typing, accessibility, linting, and styling conventions before committing them to a project.

4. Make switching ergonomic.
   - Mount the switcher in a real runtime path. For component apps, render it from the relevant page, layout, app shell, or existing preview toolbar. For static/server-rendered apps, run the controller after the DOM is ready and append it to the document or an existing tool root.
   - Confirm the selected integration point is actually loaded by the page being reviewed. Avoid adding an unused component, composable, utility, or asset without wiring it into the route/page.
   - Gate visible controls behind the project's development flag when appropriate, but make sure that flag is true in local preview. If the control is development-only, keep the variant state path working independently from production code.
   - Default visible switchers to a lower-left overlay that is removed from normal layout flow. Mount the control under `document.body` by default and use page-level absolute positioning with `left` and `bottom` offsets, so it is positioned relative to the whole page rather than a component container. Only use a component-local root when the user explicitly asks for a scoped preview control. The switcher must not resize, push, or reflow page content.
   - Keep the default visible control compact and text-only: `style: 1 | [2] | 3 | 4 | 5`, where the selected variant is wrapped in brackets. Preserve the `style` label and bracketed selected-state convention unless the user asks for different wording or the project already has a better preview-toolbar convention.
   - Support click controls when useful.
   - Support keyboard number shortcuts for variants when they do not conflict with the app: `1` selects the first variant, `2` selects the second, and so on. Ignore shortcuts while the user is typing in inputs, textareas, selects, or editable content.
   - Persist the selected variant in local storage or query params when useful for review. Prefer query params when reviewers need shareable URLs; mirror the value to local storage when persistence is helpful.
   - Mark overlays or controls so project scanners, capture tools, or game/bookmarklet systems can ignore them when needed.
   - Keep controls keyboard and screen-reader accessible when they are visible to users or reviewers.

5. Verify that switching is visible.
   - Run the app when possible and inspect it in a browser.
   - Check that `[data-visual-variant-switcher]` or the project-native equivalent exists in the DOM.
   - Click through each variant and confirm the root attribute, class, prop, route state, or feature flag changes.
   - Confirm the visual surface changes for each variant. If variants are subtle token changes, name the exact token or selector that changed.
   - Check reload behavior when persistence was added.
   - If browser verification is impossible, run the closest available build/type/lint check and state clearly that the switcher was not visually verified.

6. Clean up deliberately.
   - If the user asks to finalize one direction, remove obsolete variant branches and styles.
   - Preserve the reusable switcher utility unless the user asks to delete the whole experimentation system.
   - Remove stale translations, docs, screenshots, or config entries that refer to deleted variants.

## Trigger Guidance

Use this skill directly when the user asks for multiple visual directions, visual options, design variants, versioned UI alternatives, or a way to switch between interface looks in the running app.

Also use it for equivalent non-English phrasing. For example, Chinese requests like "给这个页面做几个不同的视觉版本", "生成 3 个 UI 设计方向并加切换器", "做几个界面方案让我切换比较", or "确定第 2 个版本并清理其它方案" match this skill.

If the user asks only for a critique, design opinion, or mockup without implementation, use the principles here to structure the answer, but do not add a switcher unless they ask to implement or compare variants in code.

If the user asks for production experimentation, analytics allocation, traffic splitting, or statistical measurement, clarify that this skill covers visual review infrastructure, not production A/B testing.

## Output Standards

- Explain which project patterns were detected and how the implementation adapts to them.
- Keep code changes scoped to the visual variant system and the UI being compared.
- Do not introduce a new styling library, component framework, state manager, or build dependency unless the user explicitly asks.
- Prefer names based on "visual variants", "variants", or "design variants". Avoid internal or project-specific terms unless the target project already uses them.
- Verify the result in the browser when a local app can be run.
- In the final response, state which project patterns were detected, where the variant switcher is mounted, where the variant state lives, and how to finalize or remove variants later.
- If browser verification is not possible, say what was checked instead.

## Common Failure Checks

Before finishing, explicitly rule out these common misses:

- The switcher component/composable/controller exists but is never imported or rendered.
- The switcher is mounted in a route, layout, Storybook story, or preview shell different from the page the user is reviewing.
- A development-only guard hides the switcher in the local command being used.
- The DOM controller runs before `document.body` exists.
- The variant state changes but no CSS selector, class map, token scope, or component branch consumes it.
- The selected variant persists to storage but invalid stored values prevent a valid default from rendering.
- The implementation added visible review notes, variant rationale, or comparison text inside the target UI instead of keeping that explanation outside the product DOM.

## Portability Notes

- `SKILL.md` is the runtime entry point. Keep all essential behavior guidance here.
- `README.md` and `INSTALL.md` are primarily for humans and repository browsing.
- `references/` files are optional deep context. Link to them from this file when they matter.
- `assets/` files are optional templates. Agents should copy and adapt them only when they fit the target codebase.
- See `references/tool-compatibility.md` for notes on using this skill outside Codex.

## When Not To Use

- Do not use this skill for production A/B testing infrastructure, analytics allocation, experimentation platforms, or statistical analysis unless the user explicitly asks for that direction.
- Do not use this skill for theme systems where the user only wants dark/light mode and no visual comparison workflow.
- Do not use this skill to create generic design critiques without implementing or specifying a variant mechanism.
