import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, BookOpen, Clock, Zap } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { useProgressBloc } from '../blocs/progressBloc'
import { courseData, getAllLessons, getLessonById } from '../data/courses'
import { projectsData } from '../data/projects'
import { Icon } from '../components/Icon'

/**
 * 首页组件
 * 展示学习路径、当前进度、推荐项目
 */
export function HomePage() {
  const theme = useThemeBloc((state) => state.theme)
  const { getPhaseProgress, currentLesson, streakDays, getCompletedCount } = useProgressBloc()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  // 获取当前学习的课程信息
  const currentLessonData = currentLesson 
    ? getLessonById(currentLesson.phaseId, currentLesson.lessonId)
    : null
  
  // 获取第一个未完成的课程作为推荐
  const allLessons = getAllLessons()
  const firstUncompletedLesson = allLessons.find(l => 
    !useProgressBloc.getState().isLessonCompleted(l.phaseId, l.lesson.id)
  )

  // 获取推荐课程
  const recommendedLesson = currentLessonData || (firstUncompletedLesson ? firstUncompletedLesson.lesson : allLessons[0]?.lesson)
  const recommendedPhaseId = currentLesson?.phaseId || firstUncompletedLesson?.phaseId || 'phase-1'

  return (
    <div className="pt-24 pb-32">
      {/* Hero 区域 */}
      <section className="px-6 md:px-12 lg:px-16 py-16 max-w-7xl mx-auto animate-fade-in-up">
        {/* 徽章 */}
        <div
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6
            ${isDark 
              ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] text-zinc-400' 
              : 'bg-light-bg-card border border-light-border-DEFAULT text-light-text-secondary shadow-sm'
            }
          `}
        >
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow" />
          AI 时代的学习方式
        </div>

        {/* 标题 */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 max-w-3xl">
          系统化学习
          <br />
          <span className="text-gradient">Android 开发</span>
        </h1>

        {/* 副标题 */}
        <p className={`text-lg md:text-xl max-w-2xl mb-10 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          在 AI 辅助的时代，专注于理解核心概念和架构思维。边做边学，从零到独立开发完整应用。
        </p>

        {/* 按钮组 */}
        <div className="flex flex-wrap gap-4">
          <Link
            to="/learn"
            className="px-8 py-4 rounded-xl text-base font-semibold bg-accent-green text-dark-bg-primary cursor-pointer hover:shadow-lg hover:shadow-accent-green/20 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-green/50"
          >
            开始学习之旅
          </Link>
          <Link
            to="/learn"
            className={`
              px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-accent-green/50
              ${isDark
                ? 'bg-transparent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] text-white hover:bg-zinc-800/50'
                : 'bg-transparent border border-light-border-DEFAULT text-light-text-primary hover:bg-light-bg-card'
              }
            `}
          >
            查看学习路径
          </Link>
        </div>

        {/* 统计数据 */}
        <div className={`flex gap-12 md:gap-16 mt-16 pt-10 border-t ${isDark ? 'border-zinc-800/50' : 'border-light-border-subtle'}`}>
          <div className="flex flex-col gap-1">
            <span className="font-display text-3xl md:text-4xl font-bold">{courseData.length}</span>
            <span className={`text-sm ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
              学习阶段
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-3xl md:text-4xl font-bold">{allLessons.length}</span>
            <span className={`text-sm ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
              知识模块
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-3xl md:text-4xl font-bold">{projectsData.length}</span>
            <span className={`text-sm ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
              实战项目
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-3xl md:text-4xl font-bold text-accent-green">{getCompletedCount()}</span>
            <span className={`text-sm ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
              已完成
            </span>
          </div>
        </div>
      </section>

      {/* 学习路径区域 */}
      <section className="px-6 md:px-12 lg:px-16 py-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">学习路径</h2>
            <p className={`text-base mt-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              循序渐进，从基础到进阶
            </p>
          </div>
          <Link
            to="/learn"
            className="hidden md:flex items-center gap-2 text-accent-green text-sm font-medium cursor-pointer hover:gap-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-green/50 rounded"
          >
            查看全部 <ChevronRight size={16} />
          </Link>
        </div>

        {/* 路径卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {courseData.map((phase, index) => {
            const progress = getPhaseProgress(phase.id)
            const status = progress === 100 ? 'completed' : progress > 0 ? 'current' : 'locked'
            
            return (
              <Link
                key={phase.id}
                to="/learn"
                className={`
                  relative rounded-2xl p-6 cursor-pointer transition-all duration-200
                  ${isDark 
                    ? 'bg-[#141417] hover:bg-[#1c1c21] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.4)]' 
                    : 'bg-light-bg-card hover:bg-light-bg-hover shadow-sm hover:shadow-lg'
                  }
                  hover:-translate-y-1
                  group
                  focus:outline-none focus:ring-2 focus:ring-accent-green/50
                `}
              >

                {/* 图标 */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-accent-${phase.colorType}/15`}>
                  <Icon name={phase.iconName} size={24} className={`text-accent-${phase.colorType}`} />
                </div>

                {/* 阶段标签 */}
                <div className={`text-xs uppercase tracking-widest mb-2 ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                  阶段 {index + 1}
                </div>

                {/* 标题 */}
                <h3 className="text-lg font-semibold mb-2">{phase.name}</h3>

                {/* 描述 */}
                <p className={`text-sm mb-5 leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                  {phase.description}
                </p>

                {/* 进度条 */}
                <div className="flex items-center gap-3">
                  <div className={`flex-1 h-1 rounded-full overflow-hidden ${isDark ? 'bg-dark-bg-primary' : 'bg-light-bg-secondary'}`}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-blue transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                    {progress}%
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 当前学习区域 */}
      {recommendedLesson && (
        <section className="px-6 md:px-12 lg:px-16 py-8 max-w-7xl mx-auto">
          <div
            className={`
              rounded-3xl p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center
              ${isDark
                ? 'bg-gradient-to-br from-dark-bg-card to-accent-blue/5 border border-accent-blue/20'
                : 'bg-gradient-to-br from-light-bg-card to-accent-blue/10 border border-accent-blue/30 shadow-lg'
              }
            `}
          >
            <div>
              <h3 className="text-sm font-medium text-accent-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                <Zap size={14} />
                {currentLessonData ? '继续学习' : '推荐开始'}
              </h3>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
                {recommendedLesson.title}
              </h2>
              <p className={`leading-relaxed mb-6 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                {recommendedLesson.description}
              </p>
              {/* 元信息 */}
              <div className={`flex gap-6 mb-8 text-sm ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  预计 {recommendedLesson.duration} 分钟
                </span>
                {streakDays > 0 && (
                  <span className="flex items-center gap-2 text-accent-orange">
                    <BookOpen size={16} />
                    连续学习 {streakDays} 天
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate(`/learn/${recommendedPhaseId}/${recommendedLesson.id}`)}
                className="px-6 py-3 rounded-xl text-sm font-semibold bg-accent-green text-dark-bg-primary cursor-pointer hover:shadow-lg hover:shadow-accent-green/20 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-green/50"
              >
                {currentLessonData ? '继续学习' : '开始学习'}
              </button>
            </div>

            {/* 代码预览 */}
            <div
              className={`
                rounded-2xl p-6 font-mono text-sm leading-loose overflow-hidden
                ${isDark ? 'bg-dark-bg-secondary' : 'bg-light-bg-secondary'}
              `}
            >
              <div className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}>
                <div><span className="text-accent-purple">class</span> <span className="text-accent-blue">MainActivity</span> : <span className="text-accent-blue">AppCompatActivity</span>() {'{'}</div>
                <div className="pl-4"><span className="text-accent-purple">override fun</span> <span className="text-accent-blue">onCreate</span>(savedInstanceState: Bundle?) {'{'}</div>
                <div className="pl-8"><span className="text-accent-purple">super</span>.onCreate(savedInstanceState)</div>
                <div className="pl-8">setContentView(R.layout.<span className="text-accent-green">activity_main</span>)</div>
                <div className="pl-8"><span className={isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}>// 开启 Android 学习之旅 ✨</span></div>
                <div className="pl-4">{'}'}</div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 实战项目区域 */}
      <section className="px-6 md:px-12 lg:px-16 py-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">实战项目</h2>
            <p className={`text-base mt-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              学以致用，从简单到复杂
            </p>
          </div>
          <Link
            to="/projects"
            className="hidden md:flex items-center gap-2 text-accent-green text-sm font-medium cursor-pointer hover:gap-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-green/50 rounded"
          >
            查看全部 <ChevronRight size={16} />
          </Link>
        </div>

        {/* 项目卡片网格 - 移除逐个卡片动画 (UX 指南第7条) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectsData.slice(0, 4).map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className={`
                rounded-2xl overflow-hidden cursor-pointer transition-all duration-200
                ${isDark 
                  ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.4)]' 
                  : 'bg-light-bg-card border border-light-border-DEFAULT hover:border-light-text-muted shadow-sm hover:shadow-xl'
                }
                hover:-translate-y-1.5
                group
                focus:outline-none focus:ring-2 focus:ring-accent-green/50
              `}
            >
              {/* 预览区域 */}
              <div
                className={`
                  h-40 flex items-center justify-center relative overflow-hidden
                  ${isDark ? 'bg-[#0f0f12]' : 'bg-light-bg-secondary'}
                `}
              >
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <Icon 
                    name={project.iconName} 
                    size={48} 
                    className={isDark ? 'text-zinc-600' : 'text-light-text-secondary'} 
                  />
                </div>
                {/* 底部渐变遮罩 */}
                <div
                  className={`
                    absolute bottom-0 left-0 right-0 h-16
                    ${isDark 
                      ? 'bg-gradient-to-t from-[#141417] to-transparent' 
                      : 'bg-gradient-to-t from-light-bg-card to-transparent'
                    }
                  `}
                />
              </div>

              {/* 内容区域 */}
              <div className="p-6">
                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs bg-accent-orange/15 text-accent-orange font-medium">
                    Lv.{project.difficulty}
                  </span>
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`
                        px-2.5 py-1 rounded-full text-xs
                        ${isDark ? 'bg-dark-bg-secondary text-dark-text-secondary' : 'bg-light-bg-secondary text-light-text-secondary'}
                      `}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 标题 */}
                <h3 className="text-lg font-semibold mb-2">{project.name}</h3>

                {/* 描述 */}
                <p className={`text-sm leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                  {project.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
