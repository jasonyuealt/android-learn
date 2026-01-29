import { Moon, Sun } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'

/**
 * 主题切换按钮组件
 * 支持深色/浅色模式切换
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeBloc()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => toggleTheme()}
      className={`
        relative w-14 h-8 rounded-full p-1 transition-all duration-300 ease-in-out cursor-pointer
        ${isDark 
          ? 'bg-zinc-800/50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]' 
          : 'bg-light-bg-secondary border border-light-border-DEFAULT'
        }
        hover:scale-105 active:scale-95
      `}
      aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      {/* 滑块 */}
      <div
        className={`
          absolute top-1 w-6 h-6 rounded-full flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${isDark 
            ? 'left-1 bg-accent-blue shadow-lg shadow-accent-blue/30' 
            : 'left-7 bg-accent-orange shadow-lg shadow-accent-orange/30'
          }
        `}
      >
        {isDark ? (
          <Moon size={14} className="text-white" />
        ) : (
          <Sun size={14} className="text-white" />
        )}
      </div>
    </button>
  )
}
