import { create } from 'zustand'
import { LearningPhase, Project, Achievement, UserStats } from '../types'

/**
 * 学习状态接口
 */
interface LearningState {
  phases: LearningPhase[]
  projects: Project[]
  achievements: Achievement[]
  userStats: UserStats
  currentPage: string
}

/**
 * 学习操作接口
 */
interface LearningActions {
  setCurrentPage: (page: string) => void
}

/**
 * 学习数据 Bloc
 * 管理学习路径、项目、成就等数据
 * 注意：图标使用 Lucide 图标名称，不使用 Emoji
 */
export const useLearningBloc = create<LearningState & LearningActions>((set) => ({
  // 当前页面
  currentPage: 'home',

  // 学习阶段数据 - 使用 Lucide 图标
  phases: [
    new LearningPhase(
      'phase-1',
      '基础入门',
      'Kotlin 语法、开发环境、第一个 App',
      'Smartphone', // Lucide 图标名
      100,
      'completed',
      'green'
    ),
    new LearningPhase(
      'phase-2',
      '核心组件',
      'Activity、Fragment、UI 开发',
      'Puzzle', // Lucide 图标名
      45,
      'current',
      'blue'
    ),
    new LearningPhase(
      'phase-3',
      '数据与网络',
      '本地存储、网络请求、图片加载',
      'Globe', // Lucide 图标名
      0,
      'locked',
      'orange'
    ),
    new LearningPhase(
      'phase-4',
      '架构进阶',
      'MVVM、依赖注入、Navigation',
      'Building2', // Lucide 图标名
      0,
      'locked',
      'purple'
    ),
    new LearningPhase(
      'phase-5',
      '实战项目',
      '完整项目开发、发布上架',
      'Rocket', // Lucide 图标名
      0,
      'locked',
      'green'
    ),
  ],

  // 项目数据 - 使用 Lucide 图标
  projects: [
    new Project('todo', '待办清单', '学习本地数据存储和基础架构模式', 'CheckSquare', 1, ['Room', 'MVVM']),
    new Project('weather', '天气应用', '掌握网络请求和位置服务', 'CloudSun', 2, ['Retrofit', '定位']),
    new Project('news', '新闻阅读', '实现数据分页和离线缓存', 'Newspaper', 3, ['分页', '缓存']),
    new Project('chat', '社交应用', '综合项目，涵盖完整功能', 'MessageCircle', 4, ['用户系统', '推送']),
  ],

  // 成就数据 - 使用 Lucide 图标
  achievements: [
    new Achievement('first-step', '第一步', '完成第一个课程', 'Target', true),
    new Achievement('streak-7', '坚持不懈', '连续学习 7 天', 'Flame', true),
    new Achievement('phase-complete', '阶段完成', '完成第一阶段学习', 'Trophy', true),
    new Achievement('project-5', '项目达人', '完成 5 个实战项目', 'Rocket', false),
    new Achievement('all-phases', '全能开发者', '完成所有阶段学习', 'Star', false),
    new Achievement('code-master', '代码大师', '完成所有实战项目', 'Gem', false),
    new Achievement('month-streak', '月度冠军', '连续学习 30 天', 'Medal', false),
    new Achievement('graduate', '荣耀毕业', '完成全部课程和项目', 'Crown', false),
  ],

  // 用户统计
  userStats: new UserStats(12, 3, 5),

  /**
   * 设置当前页面
   */
  setCurrentPage: (page: string) => set({ currentPage: page }),
}))
