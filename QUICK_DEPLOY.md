# 快速部署参考

## 🚀 自动部署配置（推荐）

### 方式一：单分支自动部署

**在 Vercel Dashboard 设置**：
1. 进入项目 → **Settings** → **Git**
2. **Production Branch**：选择 `main` 或 `develop`
3. 保存

**效果**：
- 推送到 main/develop → 自动部署到生产环境
- 其他分支推送 → 自动生成预览部署

### 方式二：多分支策略（推荐）

**配置**：
- **main** → 生产环境（`your-app.vercel.app`）
- **develop** → 预览环境（`your-app-git-develop.vercel.app`）
- **feature-xxx** → 临时预览（每次推送生成新 URL）

**工作流程**：
```bash
# 1. 在 develop 分支开发
git checkout develop
git add .
git commit -m "feat: 新功能"
git push origin develop  # ← 自动部署预览环境

# 2. 测试通过后合并到 main
git checkout main
git merge develop
git push origin main  # ← 自动部署生产环境
```

---

## 📋 Vercel 环境变量（必须配置）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase 地址 |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_xxx` | Supabase 公钥 |
| `AI_API_BASE` | `https://xxx.com/v1` | AI API 地址（⚠️ 无 VITE_） |
| `AI_API_KEY` | `your_key` | AI API 密钥（⚠️ 无 VITE_） |
| `AI_MODEL` | `qwen-3-32b` | AI 模型（⚠️ 无 VITE_） |

**配置位置**：Vercel Dashboard → Settings → Environment Variables

**重要**：AI 变量不要加 `VITE_` 前缀（会暴露到前端）！

---

## ✅ 部署检查清单

部署前确认：
- [ ] `.env.local` 已在 `.gitignore`（不提交敏感信息）
- [ ] Vercel 环境变量已配置
- [ ] AI 变量没有 VITE_ 前缀
- [ ] 本地构建成功（`npm run build`）
- [ ] Git 仓库已连接

部署后验证：
- [ ] 访问首页正常
- [ ] 登录注册功能正常
- [ ] AI 功能正常（测验、助手、文本分析）
- [ ] 浏览器搜索 API key 无结果

---

## 🔄 常用操作

### 立即部署（无需推送）
```bash
vercel --prod
```

### 查看部署日志
Vercel Dashboard → Deployments → 点击部署 → Logs

### 回滚到之前版本
Vercel Dashboard → Deployments → 选择版本 → Promote to Production

### 暂停自动部署
Settings → Git → Pause Deployments

---

## 📖 完整文档

详细说明见 `README.md` 的"部署指南"章节。
