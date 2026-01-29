import { Link } from 'react-router-dom'
import { useThemeBloc } from '../blocs/themeBloc'
import { useProgressBloc } from '../blocs/progressBloc'
import { useAuthBloc } from '../blocs/authBloc'
import { Icon } from '../components/Icon'
import { getAllLessons } from '../data/courses'
import { RotateCcw, LogIn, UserPlus, LogOut, Calendar, Mail } from 'lucide-react'

/**
 * 成就数据
 */
const achievements = [
  { id: 'first-step', name: '第一步', description: '完成第一个课程', iconName: 'Target', threshold: 1 },
  { id: 'streak-3', name: '小试牛刀', description: '连续学习 3 天', iconName: 'Flame', streakRequired: 3 },
  { id: 'streak-7', name: '坚持不懈', description: '连续学习 7 天', iconName: 'Flame', streakRequired: 7 },
  { id: 'lessons-5', name: '学有所成', description: '完成 5 个课程', iconName: 'Trophy', threshold: 5 },
  { id: 'lessons-10', name: '进步神速', description: '完成 10 个课程', iconName: 'Rocket', threshold: 10 },
  { id: 'lessons-all', name: '学霸认证', description: '完成所有课程', iconName: 'Star', threshold: -1 }, // -1 表示全部
  { id: 'streak-30', name: '月度冠军', description: '连续学习 30 天', iconName: 'Medal', streakRequired: 30 },
  { id: 'master', name: '荣耀毕业', description: '完成全部学习', iconName: 'Crown', threshold: -1 },
]

/**
 * 个人中心页面组件
 */
export function ProfilePage() {
  const theme = useThemeBloc((state) => state.theme)
  const { getCompletedCount, streakDays, getTotalProgress } = useProgressBloc()
  const { currentUser, logout } = useAuthBloc()
  const isDark = theme === 'dark'

  const completedCount = getCompletedCount()
  const totalLessons = getAllLessons().length
  const totalProgress = getTotalProgress()

  // 检查成就是否解锁
  const isAchievementUnlocked = (achievement: typeof achievements[0]) => {
    if (achievement.streakRequired) {
      return streakDays >= achievement.streakRequired
    }
    if (achievement.threshold === -1) {
      return completedCount >= totalLessons
    }
    return completedCount >= (achievement.threshold || 0)
  }

  // 重置进度（危险操作）
  const handleReset = () => {
    if (window.confirm('确定要重置所有学习进度吗？此操作不可撤销！')) {
      localStorage.removeItem('android-learn-progress')
      window.location.reload()
    }
  }

  // 获取头像颜色
  const getAvatarColor = (color: string) => {
    const colors: Record<string, string> = {
      green: 'from-accent-green to-emerald-600',
      blue: 'from-accent-blue to-blue-600',
      orange: 'from-accent-orange to-orange-600',
      purple: 'from-accent-purple to-purple-600',
    }
    return colors[color] || colors.green
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="pt-20 md:pt-28 pb-32 px-4 md:px-12 lg:px-16 max-w-5xl mx-auto animate-fade-in-up">
      {/* 个人信息卡片 */}
      <div
        className={`
          rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 mb-12
          ${isDark 
            ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_8px_rgba(0,0,0,0.3)]' 
            : 'bg-light-bg-card border border-light-border-DEFAULT shadow-sm'
          }
        `}
      >
        {/* 头像 */}
        <div 
          className={`
            w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg
            ${currentUser 
              ? `bg-gradient-to-br ${getAvatarColor(currentUser.avatar)} shadow-accent-green/20` 
              : 'bg-gradient-to-br from-accent-green to-accent-blue shadow-accent-green/20'
            }
          `}
        >
          {currentUser 
            ? currentUser.username.charAt(0).toUpperCase()
            : `${totalProgress}%`
          }
        </div>

        {/* 用户信息 */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-display text-2xl font-semibold mb-2">
            {currentUser ? currentUser.username : 'Android 学习者'}
          </h2>
          
          {currentUser ? (
            // 已登录显示用户详情
            <div className={`mb-6 space-y-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              <p className="flex items-center gap-2 justify-center md:justify-start">
                <Mail size={16} />
                {currentUser.email}
              </p>
              <p className="flex items-center gap-2 justify-center md:justify-start">
                <Calendar size={16} />
                注册于 {formatDate(currentUser.createdAt)}
              </p>
            </div>
          ) : (
            // 未登录提示
            <p className={`mb-6 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              {completedCount > 0 
                ? `已完成 ${completedCount} 个课程，继续加油！` 
                : '开始你的 Android 学习之旅吧！'
              }
            </p>
          )}

          {/* 统计数据 */}
          <div className="flex gap-8 justify-center md:justify-start">
            <div className="text-center">
              <div className="font-display text-2xl font-semibold text-accent-green">
                {completedCount}
              </div>
              <div className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                已完成课程
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-semibold text-accent-blue">
                {totalLessons - completedCount}
              </div>
              <div className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                剩余课程
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-semibold text-accent-orange">
                {streakDays}
              </div>
              <div className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                连续学习天数
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 登录/注册提示卡片（未登录时显示） */}
      {!currentUser && (
        <div
          className={`
            rounded-3xl p-6 mb-12
            ${isDark 
              ? 'bg-gradient-to-r from-accent-green/10 to-accent-blue/10 border border-accent-green/20' 
              : 'bg-gradient-to-r from-accent-green/5 to-accent-blue/5 border border-accent-green/30'
            }
          `}
        >
          <h3 className="font-semibold mb-2">登录以保存你的学习进度</h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            登录后，你的学习进度将与账户关联，方便跨设备同步和数据备份。
          </p>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent-green text-dark-bg-primary hover:shadow-lg hover:shadow-accent-green/20 transition-all duration-200"
            >
              <LogIn size={16} />
              登录
            </Link>
            <Link
              to="/register"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isDark 
                  ? 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-white' 
                  : 'bg-light-bg-card border border-light-border-DEFAULT hover:bg-light-bg-hover'
                }
              `}
            >
              <UserPlus size={16} />
              注册
            </Link>
          </div>
        </div>
      )}

      {/* 学习进度 */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-semibold mb-6">学习进度</h2>
        <div
          className={`
            p-6 rounded-3xl
            ${isDark ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]' : 'bg-light-bg-card border border-light-border-DEFAULT shadow-sm'}
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <span className={isDark ? 'text-zinc-400' : 'text-light-text-secondary'}>
              总体进度
            </span>
            <span className="font-semibold">{totalProgress}%</span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800/50' : 'bg-light-bg-secondary'}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-blue transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
          <p className={`text-sm mt-4 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            已完成 {completedCount} / {totalLessons} 个课程
          </p>
        </div>
      </section>

      {/* 成就徽章区域 */}
      <section className="mb-12">
        <header className="mb-6">
          <h2 className="font-display text-xl font-semibold mb-2">成就徽章</h2>
          <p className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}>
            记录你的学习里程碑
          </p>
        </header>

        {/* 成就网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => {
            const unlocked = isAchievementUnlocked(achievement)
            
            return (
              <div
                key={achievement.id}
                className={`
                  rounded-3xl p-5 text-center transition-all duration-200
                  ${isDark 
                    ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]' 
                    : 'bg-light-bg-card border border-light-border-DEFAULT shadow-sm'
                  }
                  ${!unlocked && 'opacity-40'}
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* 图标 */}
                <div
                  className={`
                    w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center
                    ${unlocked
                      ? 'bg-gradient-to-br from-accent-green/20 to-accent-blue/20'
                      : isDark ? 'bg-zinc-800/50' : 'bg-light-bg-secondary'
                    }
                  `}
                >
                  <Icon 
                    name={achievement.iconName} 
                    size={24} 
                    className={unlocked ? 'text-accent-green' : isDark ? 'text-dark-text-muted' : 'text-light-text-muted'} 
                  />
                </div>

                {/* 名称 */}
                <h3 className="font-semibold text-sm mb-1">{achievement.name}</h3>

                {/* 描述 */}
                <p className={`text-xs ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                  {achievement.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 账户管理 */}
      <section>
        <div
          className={`
            p-6 rounded-3xl space-y-6
            ${isDark ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]' : 'bg-light-bg-card border border-light-border-DEFAULT shadow-sm'}
          `}
        >
          {/* 重置进度 */}
          <div>
            <h3 className="font-semibold mb-2">重置学习进度</h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
              如果你想重新开始学习，可以重置所有进度。此操作不可撤销！
            </p>
            <button
              onClick={handleReset}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer
                ${isDark 
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
                }
              `}
            >
              <RotateCcw size={16} />
              重置进度
            </button>
          </div>

          {/* 退出登录（仅已登录用户显示） */}
          {currentUser && (
            <div className={`pt-6 border-t ${isDark ? 'border-zinc-800/50' : 'border-light-border-subtle'}`}>
              <h3 className="font-semibold mb-2">退出登录</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
                退出当前账户，你的学习进度已保存在本地。
              </p>
              <button
                onClick={() => logout()}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer
                  ${isDark 
                    ? 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white' 
                    : 'bg-light-bg-secondary text-light-text-secondary hover:bg-light-bg-hover'
                  }
                `}
              >
                <LogOut size={16} />
                退出登录
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
