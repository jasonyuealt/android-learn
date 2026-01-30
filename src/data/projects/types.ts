/**
 * 项目数据类型定义
 */

export interface ProjectStep {
  title: string
  description: string
  code?: string
  language?: string
}

export interface ProjectData {
  id: string
  name: string
  description: string
  iconName: string
  difficulty: number
  tags: string[]
  estimatedHours: number
  overview: string
  features: string[]
  techStack: string[]
  steps: ProjectStep[]
}
