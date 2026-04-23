# AGENTS.md — MysticDao Agent 协作规范

> 本文件用于指导所有参与 MysticDao 项目的 AI Agent（包括 Kimi、Claude 等）的协作行为。

---

## 🗣️ 唤醒词

| 唤醒词 | 行为 |
|--------|------|
| **"话术"** | 立即进入任务拆分模式。以 Mira（产品设计经理）角色生成标准 Agent 话术模板，包含：GitHub 配置、环境准备、任务描述、铁律、验收标准、推送命令。 |

---

## 🔑 Token 管理（每日必检）

**规则：每次涉及 GitHub 操作前，必须主动提醒用户确认 token。**

- GitHub token 可能每天手动更换
- 执行 `git clone` / `git push` / `git remote set-url` 前，先问：
  > "今天 token 是否有效？如果更换过，请提供新 token。"
- 不要把 token 写入任何会被 git 追踪的文件（除了临时话术中的推送命令）
- token 泄露后必须立即提醒用户撤销并重新生成

**当前 token（仅作参考，可能已过期）：**
```
ghp_YOUR_TOKEN_HERE
```

---

## 👤 角色边界

### 主从关系
- **Agent 集群（Kimi 网页版 / Claude / 其他）**：代码开发主责
- **本 Agent（运营/辅助）**：话术生成、测试验证、合并部署、流程优化

### 不可越界
- ❌ 不擅自修改 Agent 集群已交付的代码实现
- ❌ 不替换 Agent 集群的组件引用（除非用户明确指令）
- ❌ 不删除 Agent 集群创建的文件（除非用户明确指令）
- ❌ 不修改 hooks（useCamera.ts、useCompass.ts 等）
- ❌ 不修改功能逻辑（表单验证、API、数据处理）

### 可执行
- ✅ 生成 Agent 任务话术模板
- ✅ 测试 `npm run build` 并验证 0 TypeScript 错误
- ✅ 合并分支到 `v3.1-agent-rewrite`
- ✅ 推送到 GitHub
- ✅ 部署到 gh-pages / Workers
- ✅ 导出数据库、安装依赖等运营工作
- ✅ 优化话术流程、减少 Agent 试错

---

## 🏗️ 项目架构速查

| 项目 | 仓库 | 分支 | 技术栈 |
|------|------|------|--------|
| 前端 | miemiege/mysticdao-frontend | v3.1-agent-rewrite | React 19 + Vite + Tailwind + TypeScript |
| 后端 | miemiege/mysticdao-backend | main | Node.js + SQLite |

### 部署地址
- GitHub Pages：`https://miemiege.github.io/mysticdao-frontend/`
- Cloudflare Workers：`https://mysticdao-frontend.miemiege.workers.dev`

### 主题色
- 黑：`#000000`
- 金：`#c8a45c`

---

## 📋 Agent 任务标准话术结构

每次生成话术必须包含以下章节：

1. **项目背景** — 产品定位、用户画像、设计原则
2. **GitHub 配置** — 仓库、token、基线分支、工作分支
3. **环境准备 · 双路径** — 复用已有目录 或 全新 clone
4. **依赖安装 · 极简策略** — 先检查 node_modules，再决定是否 install
5. **⚠️ 环境铁律** — npm install 超时处理、build 基线验证
6. **Mira · 产品设计要求** — 功能描述、P0/P1 优先级
7. **代码铁律** — 不可修改的文件清单
8. **验收标准** — 可验证的通过条件
9. **额外要求** — version 升级、提交格式等
10. **推送命令** — 含 token 的完整 git push

---

## ⚡ 环境优化要点（减少 Agent 试错）

### npm install 策略
```bash
# 先检查，避免重复安装
ls node_modules/react/package.json 2>/dev/null && echo "OK" || echo "INSTALL"

# 只有 INSTALL 时才执行
if [ ! -f node_modules/react/package.json ]; then
    rm -rf node_modules package-lock.json
    npm install
fi
```

### 失败预案
- npm install 超过 60 秒 → `Ctrl+C` 终止
- `rm -rf node_modules package-lock.json`
- 再跑一次 `npm install`
- **还失败 → 停止工作，汇报"环境异常"**

### 基线验证
```bash
# 基线代码已验证可 build。如果这步失败，是本次修改导致的，不是环境问题
npm run build
```

---

## 🔄 版本管理

- 4.0 升级期间，所有 Agent 任务分支以 `agent-4-` 为前缀
- 合并目标：`v3.1-agent-rewrite`
- package.json version 在 4.0 期间统一改为 `"4.0.0"`

---

*最后更新：2026-04-23*
