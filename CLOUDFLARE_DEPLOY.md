# Cloudflare Pages + Access 一键部署指南

> 目标：源码留在 Private GitHub 仓库，部署到受密码保护的公开站点，免费支持 50 个测试用户。

---

## 前置条件

- [ ] Cloudflare 账号（免费注册：https://dash.cloudflare.com/sign-up）
- [ ] GitHub 账号（已有）
- [ ] 本项目已 push 到 GitHub（已完成本地 commit）

---

## Phase 1：仓库改为 Private（5分钟）

### 1.1 GitHub 网页操作

1. 打开 https://github.com/miemiege/mysticdao-frontend
2. 点击 **Settings** → 左侧 **General**
3. 页面底部 **Danger Zone** → **Change visibility**
4. 选择 **Change to private** → 输入仓库名确认 → **I understand, change repository visibility**

### 1.2 验证

刷新页面，如果看到 404 或未登录提示，说明已成功改为 Private。

> ⚠️ 注意：改为 Private 后，GitHub Pages 会要求登录才能访问。这是正常的——我们接下来用 Cloudflare Pages 替代 Pages 托管。

---

## Phase 2：连接 Cloudflare Pages（10分钟）

### 2.1 创建 Pages 项目

1. 登录 https://dash.cloudflare.com
2. 左侧菜单 → **Pages**
3. 点击 **Create a project**
4. 选择 **Connect to Git**
5. 授权 Cloudflare 访问你的 GitHub 账号
6. 选择 **`mysticdao-frontend`** 仓库（Private 仓库也会显示）
7. 点击 **Begin setup**

### 2.2 构建设置

| 设置项 | 值 |
|--------|-----|
| Project name | `mysticdao`（或你喜欢的名字） |
| Production branch | `v3.1-agent-rewrite` |
| Framework preset | `None` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

点击 **Save and Deploy**

### 2.3 等待首次部署

- Cloudflare 会自动拉取代码、安装依赖、构建、部署
- 约 2-5 分钟完成
- 完成后会得到一个域名：`https://mysticdao.pages.dev`

> ✅ 此时站点已上线，但**任何人都能访问**。接下来加锁。

---

## Phase 3：加锁 — Cloudflare Access（10分钟）

### 3.1 进入 Zero Trust

1. Cloudflare Dashboard 左侧 → **Zero Trust**
2. 如果是首次使用，按引导完成初始化（选择 Free plan，$0/月）
3. 左侧菜单 → **Access** → **Applications**
4. 点击 **Add an application**
5. 选择 **Self-hosted**

### 3.2 配置 Application

| 设置项 | 值 |
|--------|-----|
| Application name | `MysticDao Test` |
| Session duration | `24 hours` |
| Application domain | 选择你的 Pages 项目域名，如 `mysticdao.pages.dev` |

点击 **Next**

### 3.3 配置访问策略（最关键）

点击 **Add a policy**

| 设置项 | 值 |
|--------|-----|
| Policy name | `Allow Testers` |
| Action | **Allow** |

**Configure rules** 部分选择以下任一方式：

#### 方式 A：邮件白名单（推荐，最精确）

- Selector: `Emails`
- Value: 输入你和测试人员的邮箱，如：
  ```
  your-email@gmail.com
  tester1@qq.com
  tester2@163.com
  ```

#### 方式 B：一次性 PIN（最方便，不用记密码）

- Selector: `Authentication method`
- Value: `One-time PIN`

> 选择方式 B 后，任何人访问站点时输入自己的邮箱，Cloudflare 会发一个 6 位 PIN 码到邮箱，输入后即可访问。不需要你提前维护白名单。

点击 **Next** → **Add application**

### 3.4 验证加锁

1. 打开无痕浏览器窗口
2. 访问 `https://mysticdao.pages.dev`
3. 应该看到 Cloudflare Access 登录页面，要求输入邮箱

---

## Phase 4：手机测试（5分钟）

### 4.1 分享给测试人员

把链接发给他们：

```
https://mysticdao.pages.dev

使用方法：
1. 打开链接
2. 输入你的邮箱
3. 查收邮件，复制 6 位 PIN 码
4. 输入 PIN 码，即可访问
```

### 4.2 你自己访问

因为你已经在 Cloudflare 登录了，通常可以直接访问。如果看到登录页，用你自己的邮箱收 PIN 即可。

---

## 费用说明

| 服务 | 免费额度 | 本项目用量 |
|------|---------|-----------|
| Cloudflare Pages | 无限请求、无限带宽、500 builds/月 | 足够 |
| Cloudflare Access | 50 个用户 | 足够 |
| 总计 | **$0/月** | — |

---

## 常见问题

### Q1: 改为 Private 后，原来的 GitHub Pages 还能用吗？

Private 仓库的 GitHub Pages 需要登录 GitHub 才能访问，对手机测试不友好。**废弃它，用 Cloudflare Pages 替代。**

### Q2: 如何更新站点？

推送到 `v3.1-agent-rewrite` 分支：

```bash
git push origin v3.1-agent-rewrite
```

Cloudflare 会自动检测并重新部署（约 2 分钟）。

### Q3: 如何添加更多测试人员？

进入 Cloudflare Dashboard → Zero Trust → Access → Applications → `MysticDao Test` → Policies → 编辑 `Allow Testers` → 添加更多邮箱。

### Q4: 50 个用户满了怎么办？

- 删除不再测试的用户
- 或升级到 Pro（$7/用户/月，通常不需要）
- 或改用"一次性 PIN"策略，不限制具体邮箱（推荐）

### Q5: 数据安全吗？

- 源码在 Private GitHub 仓库 ✅
- Cloudflare 有权限读取构建，但源码不会公开 ✅
- 部署后的站点受 Access 保护，非授权用户无法访问 ✅
- 但请注意：**授权用户访问站点后，数据仍会在浏览器中加载**。这是前端应用的固有特性，无法避免。

---

## 紧急回滚

如果出了问题，随时可以在 Cloudflare Dashboard → Pages → `mysticdao` → **Deployments** 中点击之前的版本进行回滚。

---

## 一键检查清单

```
□ GitHub 仓库改为 Private
□ Cloudflare 账号注册完成
□ Pages 项目创建并连接 GitHub
□ 首次部署成功，获得 pages.dev 域名
□ Access Application 创建并配置策略
□ 无痕浏览器验证登录页出现
□ 手机测试成功
```

全部完成预计 **30 分钟**。
