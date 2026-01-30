-- ========================================
-- 添加 DELETE 策略（修复重置进度功能）
-- ========================================
-- 
-- 使用方法：
-- 1. 打开 Supabase 控制台 → SQL Editor
-- 2. 创建新查询
-- 3. 复制粘贴这个文件的内容
-- 4. 点击 "Run" 执行
-- 
-- 问题说明：
-- 之前的 RLS 策略只允许 SELECT/INSERT/UPDATE，
-- 没有 DELETE 权限，导致用户无法清空自己的数据
--

-- ========================================
-- 1. 为 progress 表添加 DELETE 策略
-- ========================================

CREATE POLICY "Users can delete own progress"
  ON progress FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- 2. 为 quiz_history 表添加 DELETE 策略
-- ========================================

CREATE POLICY "Users can delete own quiz history"
  ON quiz_history FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- 验证策略
-- ========================================
-- 执行后可以运行以下查询检查策略：
-- 
-- SELECT tablename, policyname, cmd 
-- FROM pg_policies 
-- WHERE tablename IN ('progress', 'quiz_history')
-- ORDER BY tablename, cmd;
-- 
-- 应该看到：
-- - progress 表有 SELECT, INSERT, UPDATE, DELETE 策略
-- - quiz_history 表有 SELECT, INSERT, UPDATE, DELETE 策略
