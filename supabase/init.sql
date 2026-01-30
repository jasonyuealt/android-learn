-- ========================================
-- Android Learn 数据库初始化脚本
-- ========================================
-- 
-- 使用方法：
-- 1. 打开 Supabase 控制台
-- 2. 进入 SQL Editor
-- 3. 创建新查询
-- 4. 复制粘贴这整个文件的内容
-- 5. 点击 "Run" 执行
-- 
-- 这个脚本会创建：
-- - 3 个数据表（profiles, progress, quiz_history）
-- - 行级安全策略（RLS）
-- - 自动触发器（注册时自动创建资料和进度）

-- ========================================
-- 1. 用户资料表（profiles）
-- ========================================
-- 用途：存储用户的公开信息（用户名、头像等）
-- 关联：扩展 Supabase 内置的 auth.users 表

CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL CHECK (char_length(username) >= 2 AND char_length(username) <= 20),
  avatar text NOT NULL DEFAULT 'green',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 创建索引，加速用户名查询
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- 启用行级安全（RLS）- 确保用户只能访问自己的数据
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 策略 1：所有人可以查看资料（用于显示用户名等）
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- 策略 2：用户只能更新自己的资料
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ========================================
-- 2. 学习进度表（progress）
-- ========================================
-- 用途：存储每个用户的学习进度

CREATE TABLE IF NOT EXISTS progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  completed_lessons text[] DEFAULT ARRAY[]::text[],
  current_lesson jsonb,
  start_date date,
  streak_days integer DEFAULT 0,
  last_study_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- 每个用户只有一条进度记录
  UNIQUE(user_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);

-- 启用行级安全
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- 策略 1：用户只能查看自己的进度
CREATE POLICY "Users can view own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

-- 策略 2：用户只能更新自己的进度
CREATE POLICY "Users can update own progress"
  ON progress FOR UPDATE
  USING (auth.uid() = user_id);

-- 策略 3：用户可以插入自己的进度记录
CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 3. 测验历史表（quiz_history）
-- ========================================
-- 用途：存储用户的测验记录（支持错题重测）

CREATE TABLE IF NOT EXISTS quiz_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  lesson_id text NOT NULL,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  wrong_questions jsonb DEFAULT '[]'::jsonb,
  attempt_count integer DEFAULT 0,
  last_attempt_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  
  -- 唯一约束：每个用户在每个课程只有一条测验记录
  CONSTRAINT quiz_history_user_lesson_unique UNIQUE (user_id, lesson_id)
);

-- 创建索引（加速查询）
CREATE INDEX IF NOT EXISTS idx_quiz_history_user_id ON quiz_history(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_history_lesson_id ON quiz_history(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_history_user_lesson ON quiz_history(user_id, lesson_id);

-- 启用行级安全
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;

-- 策略 1：用户只能查看自己的测验历史
CREATE POLICY "Users can view own quiz history"
  ON quiz_history FOR SELECT
  USING (auth.uid() = user_id);

-- 策略 2：用户可以插入自己的测验记录
CREATE POLICY "Users can insert own quiz history"
  ON quiz_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 策略 3：用户可以更新自己的测验记录
CREATE POLICY "Users can update own quiz history"
  ON quiz_history FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- 4. 自动触发器
-- ========================================
-- 用途：当新用户注册时，自动创建 profile 和 progress 记录

-- 创建触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 创建用户资料（从注册时的 metadata 获取用户名）
  INSERT INTO public.profiles (id, username, avatar)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)  -- 如果没有用户名，用邮箱前缀
    ),
    COALESCE(
      new.raw_user_meta_data->>'avatar',
      'green'  -- 默认绿色头像
    )
  );
  
  -- 创建空的进度记录
  INSERT INTO public.progress (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 绑定触发器到 auth.users 表
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 5. 更新时间戳触发器
-- ========================================
-- 用途：自动更新 progress 表的 updated_at 字段

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_progress_updated_at ON progress;
CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 完成！
-- ========================================
-- 执行成功后，你会看到：
-- - 3 个表已创建
-- - 所有安全策略已启用
-- - 触发器已设置
