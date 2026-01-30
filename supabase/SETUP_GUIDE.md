# 🚀 Supabase 后端集成 - 快速指南

## 当前状态

✅ **已完成**
- Supabase 项目已创建
- 数据表已初始化（profiles, progress, quiz_history）
- 前端已连接 Supabase
- 纯云端存储（无 localStorage）

---

## 📝 待执行的修复

### 问题：测验保存失败（缺少唯一约束）

**执行步骤：**

1. **打开 Supabase 控制台**
   ```
   https://supabase.com → 你的项目 → SQL Editor
   ```

2. **执行修复 SQL**
   
   复制文件 `/supabase/fix-quiz-history-constraint.sql` 的内容，粘贴到 SQL Editor 并运行：

   ```sql
   -- 删除可能的重复数据
   DELETE FROM quiz_history a
   USING quiz_history b
   WHERE a.id < b.id 
     AND a.user_id = b.user_id 
     AND a.lesson_id = b.lesson_id;

   -- 添加唯一约束
   ALTER TABLE quiz_history
   ADD CONSTRAINT quiz_history_user_lesson_unique 
   UNIQUE (user_id, lesson_id);
   ```

3. **验证修复**
   
   运行验证查询：
   ```sql
   SELECT constraint_name, constraint_type
   FROM information_schema.table_constraints
   WHERE table_name = 'quiz_history';
   ```
   
   应该看到 `quiz_history_user_lesson_unique | UNIQUE`

4. **刷新应用页面**，重新测试测验功能

---

## 🎯 测试清单

- [ ] 用户注册登录正常
- [ ] 学习进度保存到云端（查看 Supabase `progress` 表）
- [ ] 完成课程后数据同步
- [ ] 做测验能正常保存（查看 `quiz_history` 表）
- [ ] 错题重测功能正常
- [ ] 登出再登录，数据恢复

---

## 📂 项目文件说明

```
supabase/
├── init.sql                           # 完整的数据库初始化脚本
├── fix-quiz-history-constraint.sql    # 修复测验表约束（执行一次后可删除）
└── SETUP_GUIDE.md                     # 本文件
```

---

## 🔧 常见问题

**Q: 为什么测验保存失败？**
A: 缺少 `(user_id, lesson_id)` 唯一约束，执行修复 SQL 即可。

**Q: 如何查看保存的数据？**
A: Supabase 控制台 → Table Editor → 选择对应的表。

**Q: 未登录能使用吗？**
A: 不能。现在是纯云端模式，必须登录才能保存进度和测验。

**Q: 如何清除测试数据？**
A: Supabase Table Editor → 右键表格 → Delete rows。

---

## 📞 需要帮助？

如果遇到问题：
1. 打开浏览器控制台 (F12) 查看错误
2. 检查 Supabase 表结构是否正确
3. 验证 `.env.local` 配置是否正确
