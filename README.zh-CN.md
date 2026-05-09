# visual-variants

![Agent Skill](https://img.shields.io/badge/agent-skill-111827)
![Portable](https://img.shields.io/badge/portable-Codex%20%7C%20Claude%20Code%20%7C%20Cursor%20%7C%20Gemini%20CLI-blue)
![Frontend](https://img.shields.io/badge/frontend-visual%20variants-0f766e)

[English](./README.md) | 简体中文

`visual-variants` 是一个 Agent Skill，用来在真实前端项目中创建项目原生的视觉变体切换器。

它帮助 AI 编程 agent 在实际应用界面里加入一个轻量、可维护的方式，用来比较多个 UI 方向。这个 skill 有意保持框架无关：它会适配项目已有的前端栈和样式系统，而不是强行引入新的包、框架或设计约定。

这个 skill 也按可迁移的方式设计。Codex 可以直接把它作为 skill 使用，其它 coding agent 如果支持可复用指令文件，也可以复用同一份 `SKILL.md`、参考文档和 starter templates。

## 它能做什么

- 识别目标项目的前端框架和样式方案。
- 添加或扩展一个轻量的视觉变体切换器。
- 使用项目已有约定来实现变体样式。
- 让视觉实验能在真实产品界面里被查看和比较。
- 在确定某个方向后，帮助清理不再使用的变体代码。

## 它不是什么

- 不是生产环境 A/B 测试平台。
- 不是 analytics 或流量分配系统。
- 不是 Tailwind-only、React-only 或绑定某个框架的包。
- 不是 Storybook、设计系统或 feature flag 工具的替代品。
- 不是 CLI、npm package、浏览器扩展或托管服务。

## 示例请求

```text
给这个 dashboard 做 3 个不同的视觉方向，并加一个切换器让我比较。
```

```text
用项目现有的样式体系，为这个页面创建一个视觉变体切换器。
```

```text
确定第 2 个版本，并清理其它不再使用的视觉方案代码。
```

也可以用更自然的中文触发，比如“做几个界面方案让我切换比较”、“生成几个 UI 设计版本”或“给这个页面加视觉变体”。

## 安装

```bash
npx skills add daassh/visual-variants
```

本地开发时：

```bash
npx skills add ./visual-variants
```

更多本地、全局和 GitHub 安装方式见 [INSTALL.md](./INSTALL.md)。

## 工具兼容性

运行时入口是 [SKILL.md](./SKILL.md)。`README.md` 和 `INSTALL.md` 主要给人阅读，`references/` 和 `assets/` 则提供可选的深入说明和 starter templates。

关于 Codex、Claude Code、Cursor、Gemini CLI、OpenCode 或其它支持可复用指令文件的 agent，见 [tool compatibility](./references/tool-compatibility.md)。

## 仓库结构

```text
visual-variants/
├── SKILL.md
├── README.md
├── README.zh-CN.md
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

## 复杂度边界

这个项目有意保持小而清楚。更大型的 skill pack 可能会包含 CLI、生成式官网、浏览器扩展、命令系统或平台专用打包流程。`visual-variants` 在没有具体需求之前不会引入这些东西。它的价值应该来自清晰的 agent 指令、对项目原生模式的适配，以及少量有用的实现模式。

## 设计理念

视觉变体应该像是目标项目自己长出来的。

如果项目使用 Tailwind，agent 应该给出 Tailwind 风格的方案。如果项目使用 Sass，方案就应该符合 Sass 的组织方式。如果项目使用 scoped component styles、CSS Modules、design tokens 或普通 CSS，输出也应该沿用这些模式。重点不是交付一个通用 UI widget，而是给 agent 一套可靠流程，让它能为每个代码库选择合适的实现方式。
