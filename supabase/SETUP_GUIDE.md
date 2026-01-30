# Supabase 配置操作指南

## 第一步：创建 Supabase 项目

1. **打开浏览器访问**: https://supabase.com

2. **登录账号**:
   - 点击右上角 "Sign In"
   - 推荐使用 GitHub 账号登录（更快）

3. **创建新项目**:
   - 点击 "New Project"
   - 填写项目信息：
     - **Organization**: 选择或创建一个组织
     - **Name**: `android-learn`
     - **Database Password**: 设置一个强密码（保存好这个密码！）
     - **Region**: 选择 `Singapore (Southeast Asia)` 或 `Tokyo (Northeast Asia)`（离中国最近）
     - **Pricing Plan**: 选择 `Free` 免费版（已足够使用）

4. **等待初始化**:
   - 等待 2-3 分钟，项目创建中...
   - 完成后会进入项目控制台

---

## 第二步：执行 SQL 脚本创建数据表

1. **进入 SQL Editor**:
   - 在左侧菜单找到 🔧 "SQL Editor"
   - 点击进入

2. **创建新查询**:
   - 点击 "+ New query" 按钮

3. **复制 SQL 脚本**:
   - 打开项目中的 `/supabase/init.sql` 文件
   - 复制全部内容（约 200 行）

4. **粘贴并执行**:
   - 粘贴到 SQL Editor 中
   - 点击右下角 "Run" 按钮（或按 Ctrl+Enter / Cmd+Enter）

5. **检查执行结果**:
   - 如果成功，会显示 "Success. No rows returned"
   - 如果报错，请查看错误信息（可能是重复执行，可以忽略）

---

## 第三步：获取 API 密钥

1. **进入项目设置**:
   - 点击左下角 ⚙️ "Project Settings"
   - 点击左侧 "API" 选项卡

2. **找到两个重要信息**:
   
   **① Project URL**（项目地址）
   ```
   https://abcdefghijklmn.supabase.co
   ```
   
   **② anon public**（公开密钥）
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...（很长的字符串）
   ```

3. **复制密钥**:
   - 点击每个密钥右侧的复制按钮 📋

---

## 第四步：配置项目环境变量

1. **打开项目中的 `.env.local` 文件**

2. **替换占位符**:
   ```bash
   # 将这两行的内容替换为你刚才复制的值
   VITE_SUPABASE_URL=https://你的项目ID.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.你的密钥...
   ```

3. **保存文件**

---

## 第五步：验证配置

1. **重启开发服务器**（重要！环境变量需要重启才能生效）:
   ```bash
   # 停止当前运行的服务器（Ctrl+C）
   # 然后重新启动
   yarn dev
   ```

2. **检查数据表**:
   - 在 Supabase 控制台，点击左侧 📊 "Table Editor"
   - 你应该能看到 3 个表：
     - `profiles`
     - `progress`
     - `quiz_history`

---

## ✅ 完成！

现在 Supabase 已经配置好了，接下来我会：
1. 修改现有的 `authBloc.ts`，连接到 Supabase
2. 修改 `progressBloc.ts`，同步数据到云端
3. 测试注册、登录、进度保存功能

---

## 💡 常见问题

**Q: 密钥会泄露吗？**
A: `anon public` 密钥是设计为可以暴露在前端的，Supabase 通过行级安全策略（RLS）保护数据。

**Q: 免费版有什么限制？**
A: 
- 数据库大小：500 MB
- 带宽：2 GB/月
- API 请求：无限制
- 完全够开发和小规模使用

**Q: 数据能导出吗？**
A: 可以，Supabase 使用标准 PostgreSQL，可以随时导出数据。
