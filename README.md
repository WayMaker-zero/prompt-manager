# 🪄 AI Prompt Manager | 提示词管家

<div align="center">

A beautiful, local-first web application designed to help you organize and manage your AI prompts. Stop losing your best prompts in random notes!

**提示词管家** 是一个漂亮且完全本地化的前端工具。它可以帮你把零碎的 AI 提示词整理得井井有条。

[English](#english-documentation) | [中文说明](#中文说明)

</div>

---

## English Documentation

### Quick Start
You don't need to install or run anything locally. Simply visit the live website to start managing your prompts:

👉 **[Launch AI Prompt Manager](https://waymaker-zero.github.io/prompt-manager/)**

### The Philosophy
In the era of AI agents, not every prompt needs to be engineered into a complex "Skill" or automated workflow. Many times, we just have simple, highly effective templates that we use every single day. **This project was born precisely for this reason: to provide a proper, dedicated home for these everyday essential prompts.**

### What is this?
AI Prompt Manager is a modern web application built for heavy AI users. It allows you to save, categorize, and quickly copy your frequently used prompts. 

What makes it special is its **variable feature**. You can put `{{something}}` in your text, and the app will turn it into a tiny input box. Fill in the blanks, click copy, and boom—your prompt is ready!

**Best of all: Privacy First.**
Your data never leaves your computer. The app uses your browser's File System Access API to read and write directly to a local `.json` file on your hard drive. Once you select the file, the browser remembers it for your next visit!

### Features
- 🚀 **Lightning Fast:** Built with Vite and React.
- 💅 **Gorgeous UI:** Glassmorphism, smooth spring animations, and an auto-adapting Dark Mode.
- 🧩 **Magic Variables:** Write `{{topic}}` in your prompt to create fillable blanks.
- 💾 **Local Storage:** Your prompts are saved as a transparent `.json` file wherever you want.
- 🌍 **Bilingual:** Native English and Simplified Chinese support.

---

## 中文说明

### 快速开始
你不需要在本地安装或运行任何代码。直接点击下方链接即可开始使用：

👉 **[立即打开 提示词管家](https://waymaker-zero.github.io/prompt-manager/)**

### 初衷与理念
在各类 AI Agent 大行其道的今天，**有些提示词可能并不至于上升到编写成一个复杂 “Skill”（技能/工作流）的级别，但它们在日常工作中却极为常用。** 这正是本项目诞生的原因——为这些高频使用的、简单却不可或缺的提示词，提供一个妥善保存和随时调用的“家”。

### 这是什么？
**提示词管家** 是为高频 AI 用户打造的现代化网页工具。它可以帮你分门别类地保存常用提示词，并在需要时一键复制。

它的杀手锏是 **“魔法变量”** 功能。只要你在文本里写上 `{{主题}}` 或者 `{{language}}`，它就会在界面上变成一个精美的小填空框。把空填好，点击复制，一气呵成！

**最重要的是：绝对的隐私安全。**
你的数据永远不会上传到任何服务器。网页利用现代浏览器的本地文件访问技术，直接读取和修改你电脑里的一个 `.json` 格式文件。选过一次文件之后，浏览器就会自动记住它，下次打开网页点一下就能继续用。

### 核心功能
- 🚀 **极速启动**：基于 Vite 和 React 构建，轻量无负担。
- 💅 **惊艳的界面**：毛玻璃质感、舒适丝滑的弹性动画、以及自动跟随系统的日夜间模式。
- 🧩 **魔法变量**：在提示词中加入 `{{变量名}}` 即可生成美观的填空框。
- 💾 **纯本地保存**：你的心血提示词会以 `.json` 文件的形式保存在你指定的任意位置，安全可控。
- 🌍 **原生双语**：自带中英双语，并可一键无缝切换。

