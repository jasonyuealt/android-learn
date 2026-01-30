import { create } from 'zustand'
import { getAllLessons } from '../data/courses'
import { useAuthBloc } from './authBloc'
import { saveProgress, loadProgress } from '../services/supabaseService'

/**
 * 学习进度状态接口
 */
interface ProgressState {
  // 已完成的课程 ID 列表 (格式: "phaseId:lessonId")
  completedLessons: string[]
  // 当前学习的课程
  currentLesson: { phaseId: string; lessonId: string } | null
  // 学习开始日期
  startDate: string | null
  // 连续学习天数
  streakDays: number
  // 最后学习日期
  lastStudyDate: string | null
  // 是否正在同步
  isSyncing: boolean
  // 是否已加载云端数据
  isLoaded: boolean
}

/**
 * 学习进度操作接口
 */
interface ProgressActions {
  // 从云端加载进度
  loadFromCloud: (userId: string) => Promise<void>
  // 同步到云端
  syncToCloud: () => Promise<void>
  // 标记课程完成
  completeLesson: (phaseId: string, lessonId: string) => void
  // 取消完成标记
  uncompleteLesson: (phaseId: string, lessonId: string) => void
  // 设置当前学习的课程
  setCurrentLesson: (phaseId: string, lessonId: string) => void
  // 检查课程是否完成
  isLessonCompleted: (phaseId: string, lessonId: string) => boolean
  // 获取阶段进度百分比
  getPhaseProgress: (phaseId: string) => number
  // 获取总体进度
  getTotalProgress: () => number
  // 更新学习连续天数
  updateStreak: () => void
  // 获取已完成课程数
  getCompletedCount: () => number
  // 重置进度（用户登出时）
  resetProgress: () => void
}

/**
 * 生成课程唯一标识
 */
const makeLessonKey = (phaseId: string, lessonId: string) => `${phaseId}:${lessonId}`

/**
 * 获取今天的日期字符串 (YYYY-MM-DD)
 */
const getTodayString = () => new Date().toISOString().split('T')[0]

/**
 * 进度管理 Bloc（纯云端版本）
 * 
 * 特点：
 * 1. 完全使用 Supabase 云端存储
 * 2. 移除 localStorage 本地缓存
 * 3. 用户必须登录才能使用
 * 4. 自动实时同步到云端
 */
export const useProgressBloc = create<ProgressState & ProgressActions>((set, get) => ({
  completedLessons: [],
  currentLesson: null,
  startDate: null,
  streakDays: 0,
  lastStudyDate: null,
  isSyncing: false,
  isLoaded: false,

  /**
   * 从云端加载进度
   * 用户登录后调用，加载 Supabase 中的进度数据
   */
  loadFromCloud: async (userId: string) => {
    if (get().isLoaded) return // 避免重复加载
    
    try {
      const cloudProgress = await loadProgress(userId)
      
      if (cloudProgress) {
        set({
          completedLessons: cloudProgress.completedLessons,
          currentLesson: cloudProgress.currentLesson,
          startDate: cloudProgress.startDate,
          streakDays: cloudProgress.streakDays,
          lastStudyDate: cloudProgress.lastStudyDate,
          isLoaded: true
        })
      } else {
        // 云端没有数据，使用空数据
        set({ isLoaded: true })
      }
    } catch (error) {
      console.error('加载云端进度失败:', error)
      set({ isLoaded: true }) // 即使失败也标记为已加载
    }
  },

  /**
   * 同步到云端
   * 每次修改进度后自动调用
   */
  syncToCloud: async () => {
    const currentUser = useAuthBloc.getState().currentUser
    
    // 如果用户未登录，不同步（理论上不应该走到这里）
    if (!currentUser) {
      console.warn('用户未登录，无法同步进度')
      return
    }

    // 如果正在同步，跳过
    if (get().isSyncing) {
      return
    }

    set({ isSyncing: true })

    try {
      const state = get()
      await saveProgress(currentUser.id, {
        completedLessons: state.completedLessons,
        currentLesson: state.currentLesson,
        streakDays: state.streakDays,
        lastStudyDate: state.lastStudyDate,
        startDate: state.startDate
      })
    } catch (error) {
      console.error('同步进度失败:', error)
      // 可以在这里添加错误提示给用户
    } finally {
      set({ isSyncing: false })
    }
  },

  /**
   * 标记课程完成
   */
  completeLesson: (phaseId: string, lessonId: string) => {
    const key = makeLessonKey(phaseId, lessonId)
    const { completedLessons, startDate } = get()
    
    if (!completedLessons.includes(key)) {
      set({
        completedLessons: [...completedLessons, key],
        startDate: startDate || getTodayString(),
        lastStudyDate: getTodayString(),
      })
      // 更新连续天数
      get().updateStreak()
      // 同步到云端
      get().syncToCloud()
    }
  },

  /**
   * 取消完成标记
   */
  uncompleteLesson: (phaseId: string, lessonId: string) => {
    const key = makeLessonKey(phaseId, lessonId)
    const { completedLessons } = get()
    
    set({
      completedLessons: completedLessons.filter(k => k !== key)
    })
    // 同步到云端
    get().syncToCloud()
  },

  /**
   * 设置当前学习的课程
   * 只有当课程变化时才更新状态，避免无限循环
   */
  setCurrentLesson: (phaseId: string, lessonId: string) => {
    const { currentLesson } = get()
    // 如果当前课程相同，不更新状态
    if (currentLesson?.phaseId === phaseId && currentLesson?.lessonId === lessonId) {
      return
    }
    set({
      currentLesson: { phaseId, lessonId },
      lastStudyDate: getTodayString(),
    })
    get().updateStreak()
    // 同步到云端
    get().syncToCloud()
  },

  /**
   * 检查课程是否完成
   */
  isLessonCompleted: (phaseId: string, lessonId: string) => {
    const key = makeLessonKey(phaseId, lessonId)
    return get().completedLessons.includes(key)
  },

  /**
   * 获取阶段进度百分比
   */
  getPhaseProgress: (phaseId: string) => {
    const allLessons = getAllLessons()
    const phaseLessons = allLessons.filter(l => l.phaseId === phaseId)
    
    if (phaseLessons.length === 0) return 0
    
    const completedCount = phaseLessons.filter(l => 
      get().isLessonCompleted(l.phaseId, l.lesson.id)
    ).length
    
    return Math.round((completedCount / phaseLessons.length) * 100)
  },

  /**
   * 获取总体进度
   */
  getTotalProgress: () => {
    const allLessons = getAllLessons()
    if (allLessons.length === 0) return 0
    
    const { completedLessons } = get()
    return Math.round((completedLessons.length / allLessons.length) * 100)
  },

  /**
   * 更新学习连续天数
   */
  updateStreak: () => {
    const { lastStudyDate, streakDays } = get()
    const today = getTodayString()
    
    if (!lastStudyDate) {
      set({ streakDays: 1, lastStudyDate: today })
      return
    }
    
    const lastDate = new Date(lastStudyDate)
    const todayDate = new Date(today)
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      // 同一天，不变
      return
    } else if (diffDays === 1) {
      // 连续学习
      set({ streakDays: streakDays + 1, lastStudyDate: today })
    } else {
      // 中断，重新计算
      set({ streakDays: 1, lastStudyDate: today })
    }
  },

  /**
   * 获取已完成课程数
   */
  getCompletedCount: () => {
    return get().completedLessons.length
  },

  /**
   * 重置进度
   * 用户登出时调用
   */
  resetProgress: () => {
    set({
      completedLessons: [],
      currentLesson: null,
      startDate: null,
      streakDays: 0,
      lastStudyDate: null,
      isSyncing: false,
      isLoaded: false
    })
  }
}))
