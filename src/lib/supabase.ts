/**
 * Supabase 客户端配置
 * 
 * 这个文件负责：
 * 1. 创建 Supabase 客户端实例
 * 2. 定义数据库表的 TypeScript 类型
 * 3. 提供类型安全的数据库操作
 */

import { createClient } from '@supabase/supabase-js'

/**
 * Supabase 项目配置
 * 
 * 注意：这两个值需要从 Supabase 控制台获取：
 * 1. 打开 https://supabase.com
 * 2. 进入你的项目
 * 3. 点击左侧 "Project Settings" -> "API"
 * 4. 复制 "Project URL" 和 "anon public" key
 * 
 * 暂时使用占位符，稍后我们会配置真实的值
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// 创建 Supabase 客户端（单例模式）
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * 数据库表类型定义
 * 
 * 这些类型对应我们即将创建的数据库表结构
 */

// 用户资料表（扩展 Supabase 内置的 auth.users）
export interface Profile {
  id: string              // 用户 ID（关联 auth.users）
  username: string        // 用户名
  avatar: string          // 头像颜色或 URL
  created_at: string      // 创建时间
}

// 学习进度表
export interface Progress {
  id: string                                          // 记录 ID
  user_id: string                                     // 用户 ID
  completed_lessons: string[]                         // 已完成课程列表 ["phase-1:lesson-1"]
  current_lesson: { phaseId: string; lessonId: string } | null  // 当前学习的课程
  start_date: string | null                           // 开始学习日期
  streak_days: number                                 // 连续学习天数
  last_study_date: string | null                      // 最后学习日期
  created_at: string                                  // 创建时间
  updated_at: string                                  // 更新时间
}

// 测验历史表
export interface QuizHistory {
  id: string              // 记录 ID
  user_id: string         // 用户 ID
  lesson_id: string       // 课程 ID
  questions: any[]        // 题目列表（JSON）
  wrong_questions: any[]  // 错题列表（JSON）
  attempt_count: number   // 测验次数
  last_attempt_date: string  // 最后测验时间
  created_at: string      // 创建时间
}

/**
 * 数据库类型定义（用于 TypeScript 自动补全）
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      progress: {
        Row: Progress
        Insert: Omit<Progress, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Progress, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
      }
      quiz_history: {
        Row: QuizHistory
        Insert: Omit<QuizHistory, 'id' | 'created_at'>
        Update: Partial<Omit<QuizHistory, 'id' | 'user_id' | 'created_at'>>
      }
    }
  }
}
