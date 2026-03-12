# GitHub Profile Update Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 GitHub 个人主页 README 与 GitHub Pages 页面同步更新为按 Stars 排序的 Top 6 项目展示。

**Architecture:** 仅做内容与展示层更新，不引入自动化抓取。README 更新项目列表，网站新增项目卡片区块并补全导航锚点。

**Tech Stack:** Markdown（GitHub README）、原生 HTML/CSS/JS（个人站点）

---

### Task 1: 更新 README 项目展示区

**Files:**
- Modify: `README.md`

**Step 1: 替换 Featured Projects 区块**

把 `## 🔥 Featured Projects` 下的 `<table>...</table>` 以及后续 `### 📚 Learning & Research Projects` 折叠块替换为以下内容：

```markdown
## 🔥 Featured Projects

<table>
<tr>
<td width="50%">

### 🌟 Top Projects (1/2)

**[kiro-account-manager](https://github.com/hj01857655/kiro-account-manager)**
- ⭐ Stars: 1106
- 📝 简介: 智能管理 Kiro IDE 账号，一键切换，配额监控

**[Kiro-GateWay-Go](https://github.com/hj01857655/Kiro-GateWay-Go)**
- ⭐ Stars: 5
- 📝 简介: Go + Gin implementation of Kiro API proxy gateway. Provides OpenAI and Anthropic API compatibility for Kiro accounts.

**[orchids-account-manager](https://github.com/hj01857655/orchids-account-manager)**
- ⭐ Stars: 3
- 📝 简介: Orchids Manager - 账号管理工具

</td>
<td width="50%">

### 🌟 Top Projects (2/2)

**[warpdev-account-manager](https://github.com/hj01857655/warpdev-account-manager)**
- ⭐ Stars: 3
- 📝 简介: WarpDev Account Tool - 账户管理工具

**[maintainer-firewall](https://github.com/hj01857655/maintainer-firewall)**
- ⭐ Stars: 1
- 📝 简介: 暂无公开描述

**[zencoder-account-manager](https://github.com/hj01857655/zencoder-account-manager)**
- ⭐ Stars: 1
- 📝 简介: ZenCoder Account Manager - Tauri 版本

</td>
</tr>
</table>
```

**Step 2: 目视检查 README 结构完整**

检查 `## 🎨 Skills & Expertise` 仍紧随该区块之后，没有残留旧的学习项目折叠块。

**Step 3: 记录变更**

说明 README 已按 Stars 排序展示 Top 6 项目。

**Step 4: Commit**

```bash
git add README.md

git commit -m "docs: refresh featured projects by stars"
```

---

### Task 2: 新增个人站点项目展示区

**Files:**
- Modify: `personal-website/index.html`

**Step 1: 更新头图文案**

把头图描述中的项目作者文本更新为：

```html
<strong>kiro-account-manager</strong> 项目作者，Top 6 项目按 Stars 排序展示
```

**Step 2: 增加项目区块样式**

在 CSS（`/* Sections */` 之后）补充以下样式：

```css
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 2rem;
            margin-top: 4rem;
        }

        .project-card {
            background: var(--bg-color);
            border-radius: var(--border-radius-lg);
            padding: 2rem;
            box-shadow: var(--shadow);
            border: 1px solid var(--border-color);
            text-decoration: none;
            color: var(--text-color);
            position: relative;
            overflow: hidden;
            transition: var(--transition);
        }

        .project-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: var(--gradient-primary);
        }

        .project-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-xl);
        }

        .project-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .project-title {
            font-size: 1.2rem;
            font-weight: 700;
        }

        .project-stars {
            background: var(--bg-tertiary);
            color: var(--text-color);
            padding: 0.3rem 0.75rem;
            border-radius: 999px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .project-desc {
            color: var(--text-light);
            line-height: 1.7;
            margin-bottom: 1rem;
        }

        .project-link {
            color: var(--primary-color);
            font-weight: 600;
            font-size: 0.95rem;
        }
```

**Step 3: 新增 `#projects` 区块**

在 `</section>`（技术栈区块结束后）与 `<script>` 之间插入：

```html
    <section id="projects" style="background: var(--bg-secondary);">
        <div class="container">
            <h2 class="section-title">🚀 项目展示</h2>
            <p class="section-subtitle">按 GitHub Stars 排序的热门项目</p>

            <div class="projects-grid">
                <a class="project-card" href="https://github.com/hj01857655/kiro-account-manager" target="_blank" rel="noopener">
                    <div class="project-header">
                        <div class="project-title">kiro-account-manager</div>
                        <div class="project-stars">⭐ 1106</div>
                    </div>
                    <div class="project-desc">智能管理 Kiro IDE 账号，一键切换，配额监控</div>
                    <div class="project-link">查看项目 →</div>
                </a>

                <a class="project-card" href="https://github.com/hj01857655/Kiro-GateWay-Go" target="_blank" rel="noopener">
                    <div class="project-header">
                        <div class="project-title">Kiro-GateWay-Go</div>
                        <div class="project-stars">⭐ 5</div>
                    </div>
                    <div class="project-desc">Go + Gin implementation of Kiro API proxy gateway. Provides OpenAI and Anthropic API compatibility for Kiro accounts.</div>
                    <div class="project-link">查看项目 →</div>
                </a>

                <a class="project-card" href="https://github.com/hj01857655/orchids-account-manager" target="_blank" rel="noopener">
                    <div class="project-header">
                        <div class="project-title">orchids-account-manager</div>
                        <div class="project-stars">⭐ 3</div>
                    </div>
                    <div class="project-desc">Orchids Manager - 账号管理工具</div>
                    <div class="project-link">查看项目 →</div>
                </a>

                <a class="project-card" href="https://github.com/hj01857655/warpdev-account-manager" target="_blank" rel="noopener">
                    <div class="project-header">
                        <div class="project-title">warpdev-account-manager</div>
                        <div class="project-stars">⭐ 3</div>
                    </div>
                    <div class="project-desc">WarpDev Account Tool - 账户管理工具</div>
                    <div class="project-link">查看项目 →</div>
                </a>

                <a class="project-card" href="https://github.com/hj01857655/maintainer-firewall" target="_blank" rel="noopener">
                    <div class="project-header">
                        <div class="project-title">maintainer-firewall</div>
                        <div class="project-stars">⭐ 1</div>
                    </div>
                    <div class="project-desc">暂无公开描述</div>
                    <div class="project-link">查看项目 →</div>
                </a>

                <a class="project-card" href="https://github.com/hj01857655/zencoder-account-manager" target="_blank" rel="noopener">
                    <div class="project-header">
                        <div class="project-title">zencoder-account-manager</div>
                        <div class="project-stars">⭐ 1</div>
                    </div>
                    <div class="project-desc">ZenCoder Account Manager - Tauri 版本</div>
                    <div class="project-link">查看项目 →</div>
                </a>
            </div>
        </div>
    </section>
```

**Step 4: 让动画生效**

在 JS 中把 `.project-card` 加入 hover 与 IntersectionObserver 目标：

```javascript
const cards = document.querySelectorAll('.about-card, .tech-category, .project-card');
```

```javascript
// Observe all animatable elements
document.querySelectorAll('.about-card, .tech-category, .project-card').forEach(el => {
    observer.observe(el);
});
```

**Step 5: Commit**

```bash
git add personal-website/index.html

git commit -m "feat: add top projects section to website"
```

---

### Task 3: 最终检查

**Files:**
- Modify: `README.md`
- Modify: `personal-website/index.html`

**Step 1: 快速复核变更**

```bash
git status --short
```

**Step 2: 汇总说明**

确认 README 与网站均展示 Top 6 项目，且 Stars 与描述一致。

**Step 3: Commit（如前两步已提交则跳过）**

如果前面已分别提交，则本步无需执行。
