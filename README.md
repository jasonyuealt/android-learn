# Android Learn - 安卓学习网站

> 一个面向 AI 时代的安卓开发学习平台，边做边学，循序渐进。

## 🚀 快速开始

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 构建生产版本
yarn build
```

## 📚 项目概述

这是一个帮助零基础学习者掌握安卓开发的学习网站。在 AI 辅助编程的时代，我们更注重**理解核心概念**和**实战能力**，而非死记硬背语法。

---

## 🎯 AI 时代的学习策略

### 需要深入理解的（AI 帮不了你）
- **架构思维** - 为什么这样设计，而不是怎么写代码
- **调试能力** - 看懂报错，定位问题
- **代码阅读** - 理解别人/AI生成的代码
- **需求分析** - 把想法转化为技术方案
- **性能优化** - 知道什么是好的实现

### 可以借助 AI 的（但要理解原理）
- 具体语法细节
- 样板代码生成
- API 使用方式
- Bug 修复建议
- 代码重构

---

## 🖥️ 功能模块

### 已实现功能

| 功能 | 页面/组件 | 说明 |
|------|-----------|------|
| 主题切换 | `ThemeToggle.tsx` | 支持深色/浅色模式切换，状态持久化 |
| **后端集成** | `supabaseService.ts` / Supabase | **使用 Supabase 云端存储，用户认证、进度同步、测验历史** |
| 用户认证 | `LoginPage.tsx` / `RegisterPage.tsx` / `authBloc.ts` | 独立登录注册页面，Supabase JWT 认证 |
| **AI 小测验** | `QuizSection.tsx` / `aiService.ts` | **多题型（单选/多选/判断/填空）、错题重测、云端存储** |
| **Kotlin 在线测试** | `KotlinPlayground.tsx` / `Navbar.tsx` | **课程页面导航栏"在线测验"按钮，弹窗代码编辑器** |
| **AI 文本分析** | `AiTextAssistant.tsx` | **选中文本后显示 AI 分析按钮，支持解释代码含义和多轮追问** |
| **AI 页面助手** | `AiPageAssistant.tsx` | **基于当前页面上下文的智能对话助手** |
| 首页 | `HomePage.tsx` | 学习路径总览、当前进度、实战项目推荐 |
| 学习列表 | `LearnPage.tsx` | 分阶段展示所有课程，显示完成状态 |
| 课程详情 | `LessonPage.tsx` | 课程内容渲染，支持代码高亮、提示框、表格、AI 测验入口 |
| 项目列表 | `ProjectsPage.tsx` | 8 个难度递增的实战项目展示 |
| 项目详情 | `ProjectDetailPage.tsx` | 项目介绍、功能列表、开发步骤 |
| 资源中心 | `ResourcesPage.tsx` | 精选官方文档、开源项目、视频教程 |
| 个人中心 | `ProfilePage.tsx` | 用户信息、学习统计、成就徽章、账户管理 |
| 进度追踪 | `progressBloc.ts` | 学习进度云端同步，连续天数统计 |
| 导航系统 | `Navbar.tsx` / `BottomNav.tsx` | React Router 路由导航，用户菜单 |
| 背景装饰 | `BackgroundDecoration.tsx` | 渐变光效和网格背景 |

---

## 📖 学习路径规划

> **设计理念**：AI 时代重点是"理解"而非"记忆语法"。用 Cursor 写代码，用 Android Studio 测试。

### 第一阶段：基础入门

| 模块 | 内容 | 学习目标 |
|------|------|----------|
| Kotlin 语言基础 | 变量类型、函数Lambda、空安全、类与对象、集合操作、协程入门 | **能看懂 AI 生成的代码** |
| 开发与测试环境 | AI 辅助开发流程、Android Studio 必备操作、项目结构解读 | 知道如何运行和测试 |

### 第二阶段：核心组件（3-4周）

| 模块 | 内容 | 学习目标 |
|------|------|----------|
| Activity | 生命周期、Intent、数据传递 | 掌握页面管理 |
| Fragment | 生命周期、通信、导航 | 理解模块化UI |
| UI开发 | Jetpack Compose / XML布局 | 能构建复杂界面 |
| 列表展示 | RecyclerView / LazyColumn | 高效展示数据列表 |

### 第三阶段：数据与网络（2-3周）

| 模块 | 内容 | 学习目标 |
|------|------|----------|
| 本地存储 | SharedPreferences、Room数据库 | 实现数据持久化 |
| 网络请求 | Retrofit、OkHttp、协程 | 获取网络数据 |
| 图片加载 | Coil / Glide | 高效加载图片 |

### 第四阶段：架构进阶（2-3周）

| 模块 | 内容 | 学习目标 |
|------|------|----------|
| MVVM架构 | ViewModel、LiveData/Flow | 写出可维护的代码 |
| 依赖注入 | Hilt / Koin | 管理依赖关系 |
| Navigation | Jetpack Navigation | 实现页面导航 |

### 第五阶段：实战项目（持续）

| 项目 | 难度 | 涵盖知识点 |
|------|------|------------|
| 待办清单 | ⭐ | Room、MVVM、列表 |
| 天气应用 | ⭐⭐ | 网络请求、定位、UI |
| 新闻阅读 | ⭐⭐⭐ | 分页、缓存、WebView |
| 音乐播放器 | ⭐⭐⭐ | Service、MediaPlayer、通知 |
| 相册应用 | ⭐⭐⭐ | Camera、相册、权限 |
| 即时通讯 | ⭐⭐⭐⭐ | Firebase、推送、实时通信 |
| 电商应用 | ⭐⭐⭐⭐ | 支付、购物车、订单 |
| 小游戏 | ⭐⭐⭐⭐⭐ | Canvas、动画、传感器 |

---

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **UI**: Tailwind CSS
- **状态管理**: Zustand
- **路由**: React Router DOM v6
- **图标**: Lucide React
- **构建**: Vite 6

### 后端
- **BaaS**: Supabase（PostgreSQL + Auth + Realtime）
- **认证**: JWT（Supabase Auth）
- **存储**: 云端数据库（RLS 行级安全）

### AI 服务
- **测验生成**: Cerebras API (qwen-3-32b)
- **代码运行**: Kotlin Playground API

---

## 📁 项目结构

```
android-learn/
├── src/
│   ├── components/          # 通用组件
│   │   ├── AiPageAssistant.tsx       # AI 页面助手
│   │   ├── AiTextAssistant.tsx       # AI 文本分析（选中触发）
│   │   ├── BackgroundDecoration.tsx  # 背景装饰
│   │   ├── BottomNav.tsx             # 底部导航
│   │   ├── CodeBlock.tsx             # 代码块显示
│   │   ├── Icon.tsx                  # Lucide 图标映射组件
│   │   ├── KotlinPlayground.tsx      # Kotlin 在线测试（导航栏按钮）
│   │   ├── Logo.tsx                  # Logo 组件
│   │   ├── Navbar.tsx                # 顶部导航栏
│   │   ├── PathCard.tsx              # 学习路径卡片
│   │   ├── ProjectCard.tsx           # 项目卡片
│   │   ├── QuizSection.tsx           # AI 小测验（云端存储）
│   │   └── ThemeToggle.tsx           # 主题切换按钮
│   ├── pages/               # 页面组件
│   │   ├── HomePage.tsx              # 首页
│   │   ├── LearnPage.tsx             # 学习列表页
│   │   ├── LessonPage.tsx            # 课程详情页
│   │   ├── ProjectsPage.tsx          # 项目列表页
│   │   ├── ProjectDetailPage.tsx     # 项目详情页
│   │   ├── ResourcesPage.tsx         # 资源中心页
│   │   └── ProfilePage.tsx           # 个人中心
│   ├── data/                # 数据文件
│   │   ├── courses.ts                # 课程内容数据
│   │   └── projects.ts               # 项目数据
│   ├── blocs/               # 状态管理
│   │   ├── authBloc.ts               # 用户认证管理
│   │   ├── themeBloc.ts              # 主题状态管理
│   │   ├── learningBloc.ts           # 学习数据管理
│   │   └── progressBloc.ts           # 进度追踪管理
│   ├── services/            # 服务层
│   │   ├── aiService.ts              # AI API 调用服务（Cerebras）
│   │   └── supabaseService.ts        # Supabase 数据库服务
│   ├── types/               # 类型定义
│   │   └── index.ts                  # 类型/类定义
│   ├── App.tsx              # 主应用组件
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── public/
│   └── vite.svg             # 网站图标
├── prototype.html           # 原型设计文件
├── index.html               # HTML 入口
├── package.json             # 依赖配置
├── tailwind.config.js       # Tailwind 配置
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 配置
└── README.md                # 项目文档
```

---

## 🎨 设计特点

- **深色/浅色主题** - 支持一键切换，状态本地持久化
- **现代简约风格** - 清晰的层次和信息架构
- **响应式设计** - 适配不同屏幕尺寸
- **流畅动画** - 页面切换和交互动画 (200ms 过渡)
- **渐变装饰** - 绿色/蓝色渐变点缀，科技感十足
- **Lucide 图标** - 使用专业 SVG 图标，不使用 Emoji
- **无障碍支持** - 键盘导航、ARIA 标签、focus 状态

---

## 📝 更新日志

### v0.9.1 (2026-01-29)
- ✅ **移动端适配优化（登录注册页面）**
  - 响应式标题字体（移动端 `text-2xl`，桌面端 `text-3xl`）
  - 调整移动端内边距和间距（更紧凑舒适的布局）
  - 优化表单输入框字体大小（移动端 `text-base`，桌面端 `text-sm`）
  - 改进按钮高度和分隔线样式的响应式设计
  - 优化容器布局，移除 `items-center` 避免内容多时的布局问题
  - 修复横向滚动条问题（添加 `overflow-x-hidden`）
- ✅ **品牌统一优化**
  - 统一全站 Logo 为 Lucide Bot 图标（导航栏、浮动按钮、favicon）
  - 统一 Logo 配色方案为绿色渐变主题（品牌一致性）
  - 更新浏览器标签页图标为 Bot 样式
  - 修复 Logo 图标颜色不一致问题（绿色背景统一使用白色图标）

### v0.9.0 (2026-01-29)
- ✅ **AI 页面助手（全新功能）**
  - 右下角浮动按钮（Logo 图标），点击打开智能对话界面
  - 基于当前页面上下文的 AI 助手（课程、项目、列表页等）
  - 绿色主题，贴合项目风格
  - 支持多轮对话，智能理解页面内容
  - 默认提示："当前页面想了解什么？"
- ✅ **功能优化**
  - Kotlin 在线测试移至课程页面导航栏"在线测验"按钮
  - AI 文本分析和 AI 页面助手共存，分工明确
  - 安装 UI UX Pro Max 和 OpenSkills 技能系统

### v0.8.0 (2026-01-29)
- ✅ **Kotlin 在线测试功能**
  - 全局浮动按钮（右下角绿色终端图标，贴合项目主色调）
  - 点击打开代码编辑面板，弹窗内直接运行代码（调用 Kotlin 官方 API）
  - 弹窗出现/消失有平滑动画过渡
  - 支持代码复制、重置、实时显示输出结果和错误信息
- ✅ **AI 文本分析助手**
  - 选中任意文本后显示「AI 分析」浮动按钮
  - 点击后自动分析选中内容在 Android/Kotlin 中的含义和用法
  - 支持多轮追问，可以继续提问深入了解
  - 紫色主题风格，与 Kotlin 测试区分
- ✅ **变量与数据类型课程全面升级**
  - 每种数据类型说明"用在哪里"
  - 优化使用场景表格（去掉 emoji，三列布局更清晰）
  - 所有代码示例都带运行结果
  - 添加注意事项和常见陷阱提醒

### v0.7.0 (2026-01-29)
- ✅ **全部五个阶段课程内容完善**
  - 第二阶段：新增 Fragment（3节）、Compose 状态管理、列表展示
  - 第三阶段：新增 Room 数据库（2节）、Retrofit 网络请求（2节）、Coil 图片加载
  - 第四阶段：完善 MVVM 架构、新增分层架构、Hilt 依赖注入、Navigation
  - 第五阶段：待办清单项目拆分为详细步骤（项目规划、数据层、UI 层、开发技巧）
- ✅ 课程内容 Markdown 表格正确渲染
- ✅ 修复代码块显示问题（text 类型不再包含代码块）

### v0.6.0 (2026-01-29)
- ✅ **课程内容全面重构** - 围绕 AI 辅助开发时代重新设计
  - 第一阶段"基础入门"完全重写
  - 新增：类与对象、集合操作、协程入门
  - 重写：开发环境课程改为"AI 辅助开发流程"
  - 重点从"如何写代码"转向"如何理解和审查代码"
- ✅ **项目卡片样式统一** - 与学习路径卡片风格保持一致
- ✅ 移除项目卡片的大预览区域，改为简洁图标风格

### v0.5.0 (2026-01-29)
- ✅ **AI 小测验全面升级**
  - 多题型支持：单选题、多选题、判断题、填空题
  - 智能错题重测：未满分时再测会针对错题知识点重新出题
  - 动态题目数量：根据课程内容长度自动调整（3-8 道）
  - 避免重复：记录已出过的题目，新题尽量覆盖不同知识点
  - 历史记录持久化：本地存储测验历史
- ✅ **UI 圆角统一优化**
  - 按钮统一使用 `rounded-full`（胶囊形）
  - 卡片统一使用 `rounded-3xl`（大圆角）
  - 输入框统一使用 `rounded-full`
- ✅ 底部导航改为仅移动端显示（`md:hidden`）
- ✅ 添加 `.gitignore` 文件
- ✅ 更新网站 favicon 与 Logo 一致

### v0.4.0 (2026-01-29)
- ✅ 添加 React Router 实现真正的页面路由
- ✅ 创建完整的课程数据（5 阶段、多模块、详细内容）
- ✅ 实现课程详情页面，支持 Markdown 渲染
- ✅ 实现学习进度追踪，数据本地持久化
- ✅ 实现项目详情页面，展示开发步骤
- ✅ 添加资源中心页面，精选学习资源
- ✅ 完善个人中心，展示真实进度和成就

### v0.3.0 (2026-01-29)
- ✅ 安装 UI UX Pro Max 技能优化界面
- ✅ 将所有 Emoji 图标替换为 Lucide SVG 图标
- ✅ 添加所有可点击元素的 cursor-pointer 样式
- ✅ 优化 hover/focus 状态过渡动画 (200ms)
- ✅ 添加键盘导航的 focus ring 样式
- ✅ 添加 ARIA 无障碍标签

### v0.4.1 (2026-01-29)
- ✅ **优化 AI 小测验布局** - 从弹窗模式改为页面内嵌显示
- ✅ 测验组件直接显示在课程内容下方，体验更流畅
- ✅ 项目上传至 GitHub: https://github.com/jasonyuealt/android-learn

### v0.4.0 (2026-01-29)
- ✅ **新功能：AI 小测验** - 每课学完后可进行 AI 实时生成的测验
- ✅ 使用 Cerebras API (qwen-3-32b 模型) 智能出题
- ✅ 支持选择题、答案解析、即时反馈
- ✅ 测验结果展示（分数、正确率、个性化反馈）
- ✅ 内嵌式 UI 设计，支持暗黑/浅色主题

### v0.3.5 (2026-01-29)
- ✅ 学习页面顶部添加上一课/下一课快捷导航按钮
- ✅ 全面修复暗黑模式下所有边框样式（使用微妙阴影代替白色边框）
- ✅ 优化组件：LessonPage、HomePage、ProfilePage、ResourcesPage、ProjectDetailPage
- ✅ 优化组件：BottomNav、ThemeToggle、代码块、导航卡片
- ✅ 统一暗黑模式配色：卡片 `#141417`，边框 `shadow-[0_0_0_1px_rgba(255,255,255,0.04)]`

### v0.3.4 (2026-01-29)
- ✅ 完全移除卡片顶部高亮边（浅色/暗黑主题均移除）
- ✅ 修复学习页面课程列表分隔线在暗黑模式下太亮的问题
- ✅ 优化暗黑模式下分隔线颜色 `divide-zinc-800/30`

### v0.3.3 (2026-01-29)
- ✅ 优化卡片高亮效果（移除明显边框，使用微妙阴影）
- ✅ 添加页面切换自动滚动到顶部功能
- ✅ 统一所有卡片组件的暗黑模式样式

### v0.3.2 (2026-01-29)
- ✅ 优化暗黑主题配色（参考 UX 指南 Dark Mode OLED）
- ✅ 使用微妙阴影代替明显边框，减少视觉干扰
- ✅ 添加页面过渡动画（slide-in-left/right）
- ✅ 优化输入框在暗黑主题下的样式
- ✅ 调整背景色层次更加舒适（#09090b → #141417）

### v0.3.1 (2026-01-29)
- ✅ 重构登录注册为独立页面（路由跳转）
- ✅ 精美的分屏布局设计
- ✅ 登录页左侧展示产品特性
- ✅ 注册页展示学习路径预览
- ✅ 密码强度指示器
- ✅ 移除弹窗式登录模态框

### v0.3.0 (2026-01-29)
- ✅ 实现用户认证系统（登录/注册）
- ✅ 用户数据本地存储（localStorage）
- ✅ 密码 SHA-256 哈希加密
- ✅ 支持邮箱或用户名登录
- ✅ 导航栏用户菜单和下拉操作
- ✅ 个人中心页面集成用户信息显示

### v0.2.1 (2026-01-29)
- ✅ 修复页面切换时卡片闪烁问题（遵循 UX 指南第7条：减少过多动画）
- ✅ 优化动画时长从 600ms 缩短到 300ms（遵循 UX 指南第8条）
- ✅ 添加 prefers-reduced-motion 媒体查询支持（遵循 UX 指南第9条）
- ✅ 移除卡片逐个入场动画，只保留页面容器动画

### v0.2.0 (2026-01-29)
- ✅ 完成项目框架搭建
- ✅ 实现深色/浅色主题切换
- ✅ 完成首页、学习、项目、个人中心四个页面
- ✅ 实现学习路径卡片和项目卡片组件
- ✅ 添加成就徽章系统

### v0.1.0 (2026-01-29)
- 初始化项目
- 完成学习路径规划
- 设计网站原型

---

## 🚧 待开发功能

- [ ] 代码沙盒/在线练习
- [x] ~~用户认证系统（登录注册）~~ ✅ 已完成
- [ ] 云端数据同步
- [ ] 搜索功能
- [ ] 笔记功能

---

## 🚀 部署指南

### 一、环境变量配置

#### 本地开发 (`.env.local`)

```env
# Supabase 配置（前端使用）
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API 配置（开发环境 - 带 VITE_ 前缀）
VITE_AI_API_BASE=https://your-ai-api.com/v1
VITE_AI_API_KEY=your_dev_key
VITE_AI_MODEL=qwen-3-32b

# AI API 配置（生产环境 - 无 VITE_ 前缀，后端使用）
AI_API_BASE=https://your-ai-api.com/v1
AI_API_KEY=your_prod_key
AI_MODEL=qwen-3-32b
```

**重要说明**：
- **VITE_** 前缀的变量会暴露到前端（Supabase anon key 是公开的，安全）
- **无前缀**的 AI 变量只在后端使用（通过 Vercel Serverless Functions 代理）
- 开发环境使用带 VITE_ 前缀的 AI 变量直接调用 API
- 生产环境使用无前缀的 AI 变量，通过 `/api/ai-chat` 后端代理

#### 环境自动切换

代码会根据 `import.meta.env.DEV` 自动判断：
- **开发环境** (`npm run dev`)：直接调用 AI API
- **生产环境** (Vercel)：通过后端代理调用（key 完全隐藏）

### 二、Vercel 部署

#### 1. 连接 Git 仓库

访问 [Vercel Dashboard](https://vercel.com/new)，导入 GitHub 仓库：
```
jasonyuealt/android-learn
```

#### 2. 配置项目

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### 3. 配置环境变量

在 Vercel Dashboard → Settings → Environment Variables 添加：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `your_anon_key` | Production, Preview, Development |
| `AI_API_BASE` | `https://your-ai-api.com/v1` | Production, Preview, Development |
| `AI_API_KEY` | `your_key` | Production, Preview, Development |
| `AI_MODEL` | `qwen-3-32b` | Production, Preview, Development |

⚠️ **关键**：AI 相关变量**不要**加 `VITE_` 前缀！

#### 4. 配置自动部署

**方式一：通过 Vercel Dashboard**

1. 进入项目 → Settings → Git
2. **Production Branch**：设置为 `main`（推送到 main 自动部署生产环境）
3. **Deploy Hooks**（可选）：可以设置其他分支的自动部署

**方式二：多分支部署策略**

- **main 分支** → 自动部署到生产环境（`your-app.vercel.app`）
- **develop 分支** → 自动部署到预览环境（`your-app-git-develop.vercel.app`）
- **其他分支** → 每次推送自动创建预览部署

**推荐配置**：
```bash
# 本地开发
git checkout develop
# ... 开发完成后

# 推送到 develop 分支（自动生成预览部署）
git push origin develop

# 测试通过后合并到 main（自动部署到生产）
git checkout main
git merge develop
git push origin main
```

#### 5. 部署完成

- **生产环境**：`https://your-project.vercel.app`
- **预览环境**：每次推送自动生成唯一 URL

### 三、Supabase 数据库配置

#### 1. 创建项目并初始化

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard) 创建新项目
2. 记录 `URL` 和 `anon key`（Settings → API）
3. 进入 SQL Editor，复制 `supabase/init.sql` 的内容并执行

#### 2. 修复已有项目（如果重置进度失败）

如果你的数据库是旧版本创建的，用户无法重置进度，执行以下 SQL 添加 DELETE 权限：

```sql
CREATE POLICY "Users can delete own progress" ON progress FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quiz history" ON quiz_history FOR DELETE USING (auth.uid() = user_id);
```

或者直接执行 `supabase/add-delete-policies.sql` 文件。

### 四、验证部署

部署成功后检查：
- ✅ 访问首页正常
- ✅ Supabase 认证功能正常
- ✅ AI 功能正常（测验生成、页面助手、文本分析）
- ✅ 浏览器开发者工具搜索 AI API key 无结果
- ✅ Network 面板显示调用 `/api/ai-chat` 而非直接调用 AI API

### 五、常见问题

**Q: 本地开发 AI 功能 404？**

A: 确保 `.env.local` 中有 **VITE_** 前缀的 AI 变量。

**Q: 生产环境 AI 功能不工作？**

A: 检查 Vercel 环境变量配置，确保 AI 变量**没有** VITE_ 前缀。

**Q: 用户无法重置进度（刷新后数据还在）？**

A: Supabase 缺少 DELETE 权限，执行 `supabase/add-delete-policies.sql` 修复。

**Q: 如何回滚部署？**

A: Vercel Dashboard → Deployments → 选择之前的版本 → Promote to Production

---

## 📚 相关文件

- `supabase/init.sql` - 数据库初始化脚本（新项目使用）
- `supabase/add-delete-policies.sql` - DELETE 权限修复（旧项目补充）
- `api/ai-chat.ts` - AI API 代理（Vercel Serverless Function）
