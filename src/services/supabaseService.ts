/**
 * Supabase 服务层
 * 
 * 这个文件负责所有与 Supabase 的交互：
 * 1. 用户认证（注册、登录、登出）
 * 2. 学习进度同步
 * 3. 测验历史管理
 * 
 * 使用方式：从 blocs 中调用这些函数
 */

import { supabase } from '../lib/supabase'
import type { User } from '../types'
import { QuizHistory } from './aiService'

// ========================================
// 用户认证相关
// ========================================

/**
 * 注册新用户
 * @param username 用户名
 * @param email 邮箱
 * @param password 密码
 */
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // 1. 调用 Supabase 注册 API
    // Supabase 会自动：
    // - 哈希密码（比 SHA-256 更安全的 bcrypt）
    // - 创建 auth.users 记录
    // - 触发器会自动创建 profiles 和 progress 记录
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,  // 存储到用户元数据
          avatar: generateAvatar(username)  // 根据用户名生成头像颜色
        }
      }
    })

    if (error) {
      console.error('注册失败:', error)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: '注册失败，请重试' }
    }

    // 2. 转换为前端的 User 类型
    const user: User = {
      id: data.user.id,
      username: data.user.user_metadata.username || username,
      email: data.user.email || email,
      avatar: data.user.user_metadata.avatar || 'green',
      createdAt: data.user.created_at
    }

    return { success: true, user }
  } catch (error: any) {
    console.error('注册异常:', error)
    return { success: false, error: error.message || '注册失败' }
  }
}

/**
 * 用户登录
 * @param email 邮箱
 * @param password 密码
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // 调用 Supabase 登录 API
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('登录失败:', error)
      // 翻译错误信息
      let errorMsg = error.message
      if (error.message.includes('Invalid login credentials')) {
        errorMsg = '邮箱或密码错误'
      }
      return { success: false, error: errorMsg }
    }

    if (!data.user) {
      return { success: false, error: '登录失败，请重试' }
    }

    // 转换为前端的 User 类型
    const user: User = {
      id: data.user.id,
      username: data.user.user_metadata.username || data.user.email?.split('@')[0] || 'User',
      email: data.user.email || '',
      avatar: data.user.user_metadata.avatar || 'green',
      createdAt: data.user.created_at
    }

    return { success: true, user }
  } catch (error: any) {
    console.error('登录异常:', error)
    return { success: false, error: error.message || '登录失败' }
  }
}

/**
 * 用户登出
 */
export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('登出失败:', error)
      return { success: false }
    }
    return { success: true }
  } catch (error) {
    console.error('登出异常:', error)
    return { success: false }
  }
}

/**
 * 获取当前登录的用户
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    return {
      id: user.id,
      username: user.user_metadata.username || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatar: user.user_metadata.avatar || 'green',
      createdAt: user.created_at
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 生成头像颜色（与原 authBloc 逻辑一致）
 */
function generateAvatar(username: string): string {
  const colors = ['green', 'blue', 'orange', 'purple']
  const colorIndex = username.charCodeAt(0) % colors.length
  return colors[colorIndex]
}

// ========================================
// 学习进度相关
// ========================================

/**
 * 保存学习进度到云端
 * @param userId 用户 ID
 * @param progressData 进度数据
 */
export async function saveProgress(
  userId: string,
  progressData: {
    completedLessons?: string[]
    currentLesson?: { phaseId: string; lessonId: string } | null
    streakDays?: number
    lastStudyDate?: string | null
    startDate?: string | null
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // 使用 upsert 更新或插入
    // 如果记录存在则更新，不存在则创建
    const { error } = await supabase
      .from('progress')
      .upsert({
        user_id: userId,
        completed_lessons: progressData.completedLessons,
        current_lesson: progressData.currentLesson,
        streak_days: progressData.streakDays,
        last_study_date: progressData.lastStudyDate,
        start_date: progressData.startDate,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'  // 按 user_id 冲突时更新
      })

    if (error) {
      console.error('保存进度失败:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('保存进度异常:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 从云端加载学习进度
 * @param userId 用户 ID
 */
export async function loadProgress(userId: string): Promise<{
  completedLessons: string[]
  currentLesson: { phaseId: string; lessonId: string } | null
  streakDays: number
  lastStudyDate: string | null
  startDate: string | null
} | null> {
  try {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // PGRST116 表示未找到记录，这是正常的（新用户）
      if (error.code === 'PGRST116') {
        return {
          completedLessons: [],
          currentLesson: null,
          streakDays: 0,
          lastStudyDate: null,
          startDate: null
        }
      }
      console.error('加载进度失败:', error)
      return null
    }

    return {
      completedLessons: data.completed_lessons || [],
      currentLesson: data.current_lesson,
      streakDays: data.streak_days || 0,
      lastStudyDate: data.last_study_date,
      startDate: data.start_date
    }
  } catch (error) {
    console.error('加载进度异常:', error)
    return null
  }
}

// ========================================
// 测验历史相关
// ========================================

/**
 * 保存测验历史
 * @param userId 用户 ID
 * @param lessonId 课程 ID
 * @param history 测验历史数据
 */
export async function saveQuizHistory(
  userId: string,
  lessonId: string,
  history: QuizHistory
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('quiz_history')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        questions: history.questions,
        wrong_questions: history.wrongQuestions,
        attempt_count: history.attemptCount,
        last_attempt_date: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id'
      })

    if (error) {
      console.error('保存测验历史失败:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('保存测验历史异常:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 加载测验历史
 * @param userId 用户 ID
 * @param lessonId 课程 ID
 */
export async function loadQuizHistory(
  userId: string,
  lessonId: string
): Promise<QuizHistory | null> {
  try {
    const { data, error } = await supabase
      .from('quiz_history')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single()

    if (error) {
      // PGRST116 表示未找到记录（第一次测验）
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('加载测验历史失败:', error)
      return null
    }

    // 转换为 QuizHistory 类型
    return new QuizHistory(
      data.lesson_id,
      data.questions || [],
      data.wrong_questions || [],
      data.attempt_count || 0
    )
  } catch (error) {
    console.error('加载测验历史异常:', error)
    return null
  }
}
