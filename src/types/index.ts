import type { LucideIcon } from 'lucide-react'

/**
 * 主题类型
 */
export type ThemeType = 'dark' | 'light'

/**
 * 学习阶段类
 * 使用 Lucide 图标替代 Emoji
 */
export class LearningPhase {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public iconName: string, // Lucide 图标名称
    public progress: number,
    public status: 'completed' | 'current' | 'locked',
    public colorType: 'green' | 'blue' | 'orange' | 'purple'
  ) {}
}

/**
 * 项目类
 */
export class Project {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public iconName: string, // Lucide 图标名称
    public difficulty: number,
    public tags: string[]
  ) {}
}

/**
 * 学习模块类
 */
export class LearningModule {
  constructor(
    public id: string,
    public name: string,
    public status: 'completed' | 'active' | 'locked',
    public order: number
  ) {}
}

/**
 * 成就类
 */
export class Achievement {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public iconName: string, // Lucide 图标名称
    public unlocked: boolean
  ) {}
}

/**
 * 用户统计类
 */
export class UserStats {
  constructor(
    public completedCourses: number,
    public completedProjects: number,
    public streakDays: number
  ) {}
}

/**
 * 用户信息类
 */
export class User {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public avatar: string,
    public createdAt: string
  ) {}
}

/**
 * 用户账户类（包含密码哈希，用于本地存储）
 */
export class UserAccount {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public passwordHash: string,
    public avatar: string,
    public createdAt: string
  ) {}
}
