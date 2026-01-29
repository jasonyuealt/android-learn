import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Clock, AlertTriangle, Lightbulb, BookOpen } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { useProgressBloc } from '../blocs/progressBloc'
import { getLessonById, getAdjacentLessons, courseData } from '../data/courses'
import { QuizSection } from '../components/QuizSection'
import type { LessonContent } from '../data/courses'

/**
 * 课程详情页面
 * 展示课程内容，支持完成标记和导航
 */
export function LessonPage() {
  const { phaseId, lessonId } = useParams<{ phaseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const theme = useThemeBloc((state) => state.theme)
  const { isLessonCompleted, completeLesson, setCurrentLesson } = useProgressBloc()
  const isDark = theme === 'dark'

  // 获取课程数据
  const lesson = phaseId && lessonId ? getLessonById(phaseId, lessonId) : null
  const phase = courseData.find(p => p.id === phaseId)
  const { prev, next } = phaseId && lessonId ? getAdjacentLessons(phaseId, lessonId) : { prev: null, next: null }
  const isCompleted = phaseId && lessonId ? isLessonCompleted(phaseId, lessonId) : false

  // 设置当前学习的课程（使用 useEffect 避免渲染时修改状态导致无限循环）
  useEffect(() => {
    if (phaseId && lessonId) {
      setCurrentLesson(phaseId, lessonId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseId, lessonId]) // setCurrentLesson 是稳定的，不需要作为依赖

  if (!lesson || !phase) {
    return (
      <div className="pt-24 pb-32 px-6 md:px-12 lg:px-16 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-semibold mb-4">课程未找到</h1>
        <Link to="/learn" className="text-accent-green hover:underline">
          返回学习页面
        </Link>
      </div>
    )
  }

  // 渲染内容块
  const renderContent = (content: LessonContent, index: number) => {
    switch (content.type) {
      case 'text':
        return (
          <div 
            key={index} 
            className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}
            dangerouslySetInnerHTML={{ 
              __html: content.content
                .replace(/^## (.*$)/gm, '<h2 class="font-display text-xl font-semibold mt-8 mb-4">$1</h2>')
                .replace(/^### (.*$)/gm, '<h3 class="font-display text-lg font-semibold mt-6 mb-3">$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/`([^`]+)`/g, `<code class="${isDark ? 'bg-dark-bg-secondary' : 'bg-light-bg-secondary'} px-1.5 py-0.5 rounded text-sm">$1</code>`)
                .replace(/\n- /g, '<br/>• ')
                .replace(/\n\n/g, '</p><p class="mb-4">')
                .replace(/\n/g, '<br/>')
            }}
          />
        )
      
      case 'code':
        return (
          <div
            key={index}
            className={`
              rounded-2xl overflow-hidden my-6
              ${isDark ? 'bg-[#0c0c0f] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]' : 'bg-light-bg-secondary border border-light-border-DEFAULT'}
            `}
          >
            <div className={`flex justify-between items-center px-4 py-2 border-b ${isDark ? 'border-zinc-800/50' : 'border-light-border-subtle'}`}>
              <span className={`text-xs uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
                {content.language || 'code'}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(content.content)}
                className={`
                  px-3 py-1 rounded-lg text-xs transition-all duration-200 cursor-pointer
                  ${isDark
                    ? 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    : 'bg-light-bg-card border border-light-border-DEFAULT text-light-text-secondary hover:text-light-text-primary'
                  }
                `}
              >
                复制
              </button>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className={`font-mono text-sm leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                {content.content}
              </code>
            </pre>
          </div>
        )
      
      case 'tip':
        return (
          <div
            key={index}
            className={`
              flex gap-4 p-4 rounded-xl my-6
              ${isDark ? 'bg-accent-green/10 border border-accent-green/20' : 'bg-accent-green/10 border border-accent-green/30'}
            `}
          >
            <Lightbulb size={20} className="text-accent-green flex-shrink-0 mt-0.5" />
            <p className={`text-sm leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              {content.content}
            </p>
          </div>
        )
      
      case 'warning':
        return (
          <div
            key={index}
            className={`
              flex gap-4 p-4 rounded-xl my-6
              ${isDark ? 'bg-accent-orange/10 border border-accent-orange/20' : 'bg-accent-orange/10 border border-accent-orange/30'}
            `}
          >
            <AlertTriangle size={20} className="text-accent-orange flex-shrink-0 mt-0.5" />
            <p className={`text-sm leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
              {content.content}
            </p>
          </div>
        )
      
      default:
        return null
    }
  }

  // 标记完成并跳转下一课
  const handleComplete = () => {
    if (phaseId && lessonId) {
      completeLesson(phaseId, lessonId)
      if (next) {
        navigate(`/learn/${next.phaseId}/${next.lessonId}`)
      } else {
        navigate('/learn')
      }
    }
  }

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 lg:px-16 max-w-4xl mx-auto animate-fade-in-up">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between gap-4 mb-8">
        {/* 面包屑导航 */}
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/learn" className={`hover:text-accent-green transition-colors ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
            学习
          </Link>
          <span className={isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}>/</span>
          <span className={isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}>{phase.name}</span>
          <span className={isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}>/</span>
          <span className={isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} title={lesson.title}>
            {lesson.title.length > 15 ? lesson.title.slice(0, 15) + '...' : lesson.title}
          </span>
        </nav>

        {/* 快捷导航按钮 */}
        <div className="flex items-center gap-2">
          {prev && (
            <Link
              to={`/learn/${prev.phaseId}/${prev.lessonId}`}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 cursor-pointer
                ${isDark 
                  ? 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800' 
                  : 'bg-light-bg-secondary text-light-text-secondary hover:text-light-text-primary hover:bg-light-bg-hover'
                }
              `}
              title="上一课"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">上一课</span>
            </Link>
          )}
          {next && (
            <Link
              to={`/learn/${next.phaseId}/${next.lessonId}`}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 cursor-pointer
                ${isDark 
                  ? 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800' 
                  : 'bg-light-bg-secondary text-light-text-secondary hover:text-light-text-primary hover:bg-light-bg-hover'
                }
              `}
              title="下一课"
            >
              <span className="hidden sm:inline">下一课</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* 课程头部 */}
      <header className={`mb-10 pb-8 border-b ${isDark ? 'border-zinc-800/50' : 'border-light-border-subtle'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-accent-green/15 text-accent-green">
            <BookOpen size={14} />
            {phase.name}
          </div>
          {isCompleted && (
            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-accent-blue/15 text-accent-blue">
              <Check size={14} />
              已完成
            </div>
          )}
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">{lesson.title}</h1>
        <p className={`text-lg ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          {lesson.description}
        </p>
        <div className={`flex items-center gap-2 mt-4 text-sm ${isDark ? 'text-dark-text-muted' : 'text-light-text-muted'}`}>
          <Clock size={16} />
          预计学习时间 {lesson.duration} 分钟
        </div>
      </header>

      {/* 课程内容 */}
      <article className={`mb-12 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
        {lesson.contents.map((content, index) => renderContent(content, index))}
      </article>

      {/* AI 小测验区域 - 直接内嵌在页面中 */}
      <QuizSection
        lessonTitle={lesson.title}
        lessonContent={lesson.contents
          .filter(c => c.type === 'text')
          .map(c => c.content)
          .join('\n')
          .slice(0, 1000)}
        onComplete={(score) => {
          console.log(`测验完成，得分: ${score}`)
        }}
      />

      {/* 底部操作 */}
      <footer className={`pt-8 mt-8 border-t ${isDark ? 'border-zinc-800/50' : 'border-light-border-subtle'}`}>
        {/* 完成按钮 */}
        {!isCompleted && (
          <div className="mb-8">
            <button
              onClick={handleComplete}
              className="w-full py-4 rounded-xl text-base font-semibold bg-accent-green text-dark-bg-primary cursor-pointer hover:shadow-lg hover:shadow-accent-green/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-green/50 flex items-center justify-center gap-2"
            >
              <Check size={20} />
              完成学习，继续下一课
            </button>
          </div>
        )}

        {/* 上一课/下一课导航 */}
        <div className="flex justify-between gap-4">
          {prev ? (
            <Link
              to={`/learn/${prev.phaseId}/${prev.lessonId}`}
              className={`
                flex-1 flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-200 cursor-pointer
                ${isDark 
                  ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-[#1c1c21]' 
                  : 'bg-light-bg-card border border-light-border-DEFAULT hover:border-light-text-muted shadow-sm'
                }
              `}
            >
              <ArrowLeft size={20} className={isDark ? 'text-zinc-500' : 'text-light-text-muted'} />
              <div>
                <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>上一课</div>
                <div className="font-medium">返回</div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {next ? (
            <Link
              to={`/learn/${next.phaseId}/${next.lessonId}`}
              className={`
                flex-1 flex items-center justify-end gap-3 px-6 py-4 rounded-xl transition-all duration-200 cursor-pointer
                ${isDark 
                  ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-[#1c1c21]' 
                  : 'bg-light-bg-card border border-light-border-DEFAULT hover:border-light-text-muted shadow-sm'
                }
              `}
            >
              <div className="text-right">
                <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>下一课</div>
                <div className="font-medium">继续</div>
              </div>
              <ArrowRight size={20} className={isDark ? 'text-zinc-500' : 'text-light-text-muted'} />
            </Link>
          ) : (
            <Link
              to="/learn"
              className={`
                flex-1 flex items-center justify-end gap-3 px-6 py-4 rounded-xl transition-all duration-200 cursor-pointer
                ${isDark 
                  ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-[#1c1c21]' 
                  : 'bg-light-bg-card border border-light-border-DEFAULT hover:border-light-text-muted shadow-sm'
                }
              `}
            >
              <div className="text-right">
                <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>完成</div>
                <div className="font-medium">返回课程列表</div>
              </div>
              <ArrowRight size={20} className={isDark ? 'text-zinc-500' : 'text-light-text-muted'} />
            </Link>
          )}
        </div>
      </footer>
    </div>
  )
}
