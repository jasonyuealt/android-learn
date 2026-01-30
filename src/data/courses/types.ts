/**
 * 课程数据类型定义
 */

// 课程内容类型
export interface LessonContent {
  type: 'text' | 'code' | 'tip' | 'warning'
  content: string
  language?: string // 代码块的语言
}

// 课程类型
export interface Lesson {
  id: string
  title: string
  description: string
  duration: number // 预计分钟数
  contents: LessonContent[]
}

// 模块类型
export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

// 阶段类型
export interface Phase {
  id: string
  name: string
  description: string
  iconName: string
  colorType: 'green' | 'blue' | 'orange' | 'purple'
  modules: Module[]
}
