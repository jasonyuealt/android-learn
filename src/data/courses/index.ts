/**
 * 课程数据统一导出
 */

export * from './types'
export { phase1 } from './phase1-basics'
export { phase2 } from './phase2-components'
export { phase3 } from './phase3-data'
export { phase4 } from './phase4-architecture'
export { phase5 } from './phase5-projects'

import { phase1 } from './phase1-basics'
import { phase2 } from './phase2-components'
import { phase3 } from './phase3-data'
import { phase4 } from './phase4-architecture'
import { phase5 } from './phase5-projects'
import type { Phase, Lesson } from './types'

/**
 * 完整课程数据
 * 
 * 设计理念：AI 辅助开发时代的学习路径
 * - 重点是"理解"而非"记忆语法"
 * - AI 会帮你写代码，但你需要能看懂、能审查、能调试
 * - 知道"为什么"比知道"怎么写"更重要
 */
export const courseData: Phase[] = [
  phase1,
  phase2,
  phase3,
  phase4,
  phase5
]

/**
 * 获取所有课程的扁平列表
 */
export function getAllLessons(): Array<{ phaseId: string; moduleId: string; lesson: Lesson }> {
  const lessons: Array<{ phaseId: string; moduleId: string; lesson: Lesson }> = []
  
  courseData.forEach(phase => {
    phase.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        lessons.push({
          phaseId: phase.id,
          moduleId: module.id,
          lesson
        })
      })
    })
  })
  
  return lessons
}

/**
 * 根据 ID 获取课程
 */
export function getLessonById(phaseId: string, lessonId: string): Lesson | null {
  const phase = courseData.find(p => p.id === phaseId)
  if (!phase) return null
  
  for (const module of phase.modules) {
    const lesson = module.lessons.find(l => l.id === lessonId)
    if (lesson) return lesson
  }
  
  return null
}

/**
 * 获取课程的上一课和下一课
 */
export function getAdjacentLessons(phaseId: string, lessonId: string): {
  prev: { phaseId: string; lessonId: string } | null
  next: { phaseId: string; lessonId: string } | null
} {
  const allLessons = getAllLessons()
  const currentIndex = allLessons.findIndex(
    l => l.phaseId === phaseId && l.lesson.id === lessonId
  )
  
  if (currentIndex === -1) {
    return { prev: null, next: null }
  }
  
  const prev = currentIndex > 0
    ? { phaseId: allLessons[currentIndex - 1].phaseId, lessonId: allLessons[currentIndex - 1].lesson.id }
    : null
    
  const next = currentIndex < allLessons.length - 1
    ? { phaseId: allLessons[currentIndex + 1].phaseId, lessonId: allLessons[currentIndex + 1].lesson.id }
    : null
    
  return { prev, next }
}
