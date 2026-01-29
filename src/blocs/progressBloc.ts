import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getAllLessons } from '../data/courses'

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
}

/**
 * 学习进度操作接口
 */
interface ProgressActions {
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
 * 进度管理 Bloc
 * 负责管理学习进度，支持本地持久化
 */
export const useProgressBloc = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      currentLesson: null,
      startDate: null,
      streakDays: 0,
      lastStudyDate: null,

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
    }),
    {
      name: 'android-learn-progress',
    }
  )
)
