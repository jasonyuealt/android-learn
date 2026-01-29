import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeType } from '../types'

/**
 * 主题状态接口
 */
interface ThemeState {
  theme: ThemeType
}

/**
 * 主题操作接口
 */
interface ThemeActions {
  toggleTheme: () => void
  setTheme: (theme: ThemeType) => void
}

/**
 * 主题管理 Bloc
 * 负责管理应用的主题状态（深色/浅色模式）
 */
export const useThemeBloc = create<ThemeState & ThemeActions>()(
  persist(
    (set, get) => ({
      // 默认深色主题
      theme: 'dark',

      /**
       * 切换主题
       */
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme: ThemeType = currentTheme === 'dark' ? 'light' : 'dark'
        set({ theme: newTheme })
        // 同步更新 body class
        updateBodyTheme(newTheme)
      },

      /**
       * 设置指定主题
       */
      setTheme: (theme: ThemeType) => {
        set({ theme })
        updateBodyTheme(theme)
      },
    }),
    {
      name: 'android-learn-theme',
      // 初始化时同步 body class
      onRehydrateStorage: () => (state) => {
        if (state) {
          updateBodyTheme(state.theme)
        }
      },
    }
  )
)

/**
 * 更新 body 元素的主题 class
 */
function updateBodyTheme(theme: ThemeType) {
  document.body.classList.remove('dark', 'light')
  document.body.classList.add(theme)
}
