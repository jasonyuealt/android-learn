/**
 * 实战项目数据统一导出
 */

export * from './types'
export { basicProjects } from './basic-projects'
export { advancedProjects } from './advanced-projects'

import { basicProjects } from './basic-projects'
import { advancedProjects } from './advanced-projects'
import type { ProjectData } from './types'

export const projectsData: ProjectData[] = [
  ...basicProjects,
  ...advancedProjects
]

/**
 * 根据 ID 获取项目
 */
export function getProjectById(id: string): ProjectData | null {
  return projectsData.find(p => p.id === id) ?? null
}
