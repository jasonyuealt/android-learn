import { Link } from 'react-router-dom'
import { Check, Lock, ChevronRight } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { useProgressBloc } from '../blocs/progressBloc'
import { courseData } from '../data/courses'
import { Icon } from '../components/Icon'

/**
 * 学习页面组件
 * 展示所有阶段和课程列表
 */
export function LearnPage() {
  const theme = useThemeBloc((state) => state.theme)
  const { isLessonCompleted, getPhaseProgress, getTotalProgress } = useProgressBloc()
  const isDark = theme === 'dark'

  return (
    <div className="pt-20 md:pt-28 pb-32 px-4 md:px-12 lg:px-16 max-w-7xl mx-auto animate-fade-in-up">
      {/* 页面头部 */}
      <header className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-3">学习路径</h1>
        <p className={`text-lg ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          系统化学习 Android 开发，从入门到进阶
        </p>
        {/* 总体进度 */}
        <div className="mt-6 flex items-center gap-4">
          <div className={`flex-1 max-w-xs h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800/50' : 'bg-light-bg-secondary'}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-blue transition-all duration-500"
              style={{ width: `${getTotalProgress()}%` }}
            />
          </div>
          <span className={`text-sm font-medium ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            总进度 {getTotalProgress()}%
          </span>
        </div>
      </header>

      {/* 阶段列表 - 移除逐个动画，只保留页面容器动画 (UX 指南第7条) */}
      <div className="space-y-8">
        {courseData.map((phase, phaseIndex) => {
          const phaseProgress = getPhaseProgress(phase.id)
          const isPhaseCompleted = phaseProgress === 100
          const isPhaseStarted = phaseProgress > 0

          return (
            <div key={phase.id}>
              {/* 阶段标题 */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-accent-${phase.colorType}/15`}>
                  <Icon name={phase.iconName} size={24} className={`text-accent-${phase.colorType}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="font-display text-xl font-semibold">
                      阶段 {phaseIndex + 1}：{phase.name}
                    </h2>
                    {isPhaseCompleted && (
                      <span className="px-2 py-1 rounded-full text-xs bg-accent-green/15 text-accent-green font-medium">
                        已完成
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                    {phase.description}
                  </p>
                </div>
                <div className={`text-sm font-mono ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                  {phaseProgress}%
                </div>
              </div>

              {/* 模块列表 */}
              <div className="space-y-4 ml-14">
                {phase.modules.map((module) => (
                  <div
                    key={module.id}
                    className={`
                      rounded-3xl overflow-hidden
                      ${isDark ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_8px_rgba(0,0,0,0.3)]' : 'bg-light-bg-card border border-light-border-DEFAULT shadow-sm'}
                    `}
                  >
                    {/* 模块标题 */}
                    <div className={`px-6 py-4 border-b ${isDark ? 'border-zinc-800/50' : 'border-light-border-subtle'}`}>
                      <h3 className="font-semibold">{module.title}</h3>
                    </div>

                    {/* 课程列表 */}
                    <div className={isDark ? 'divide-y divide-zinc-800/30' : 'divide-y divide-light-border-subtle'}>
                      {module.lessons.map((lesson, lessonIndex) => {
                        const isCompleted = isLessonCompleted(phase.id, lesson.id)
                        // 判断是否锁定：前面所有阶段和模块的课程都要完成
                        const previousLessonsCompleted = courseData
                          .slice(0, phaseIndex)
                          .every(p => getPhaseProgress(p.id) === 100) &&
                          (lessonIndex === 0 || isLessonCompleted(phase.id, module.lessons[lessonIndex - 1].id))
                        const isLocked = phaseIndex > 0 && !previousLessonsCompleted && !isPhaseStarted && lessonIndex > 0

                        return (
                          <Link
                            key={lesson.id}
                            to={isLocked ? '#' : `/learn/${phase.id}/${lesson.id}`}
                            className={`
                              flex items-center gap-4 px-6 py-4 transition-all duration-200
                              ${isLocked 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'cursor-pointer hover:bg-opacity-50'
                              }
                              ${isDark ? 'hover:bg-dark-bg-hover' : 'hover:bg-light-bg-hover'}
                            `}
                            onClick={(e) => isLocked && e.preventDefault()}
                          >
                            {/* 状态图标 */}
                            <div
                              className={`
                                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                ${isCompleted 
                                  ? 'bg-accent-green text-white' 
                                  : isLocked
                                    ? isDark ? 'bg-zinc-800/50 text-zinc-600' : 'bg-light-bg-secondary text-light-text-muted'
                                    : isDark ? 'bg-zinc-800/50 text-zinc-400' : 'bg-light-bg-secondary text-light-text-secondary'
                                }
                              `}
                            >
                              {isCompleted ? (
                                <Check size={16} />
                              ) : isLocked ? (
                                <Lock size={14} />
                              ) : (
                                <span className="text-sm">{lessonIndex + 1}</span>
                              )}
                            </div>

                            {/* 课程信息 */}
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium ${isLocked ? '' : ''}`}>{lesson.title}</h4>
                              <p className={`text-sm truncate ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                                {lesson.description}
                              </p>
                            </div>

                            {/* 时长 */}
                            <span className={`text-sm flex-shrink-0 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                              {lesson.duration} 分钟
                            </span>

                            {/* 箭头 */}
                            {!isLocked && (
                              <ChevronRight size={18} className={isDark ? 'text-dark-text-muted' : 'text-light-text-muted'} />
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
