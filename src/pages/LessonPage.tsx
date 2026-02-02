import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Clock, AlertTriangle, Lightbulb, BookOpen, Sparkles } from 'lucide-react'
import { useThemeBloc } from '../blocs/themeBloc'
import { useProgressBloc } from '../blocs/progressBloc'
import { getLessonById, getAdjacentLessons, courseData } from '../data/courses'
import { QuizSection } from '../components/Quiz'
import { CodeBlock } from '../components/CodeBlock'
import { ContentAssistant } from '../components/AI/ContentAssistant'
import type { LessonContent } from '../data/courses'
import mermaid from 'mermaid'

/**
 * Mermaid图表组件
 */
function MermaidDiagram({ code, isDark, index }: { code: string, isDark: boolean, index: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [showAssistant, setShowAssistant] = useState(false)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return
      
      try {
        setError(null)
        const id = `mermaid-${Date.now()}-${index}`
        
        // 初始化Mermaid配置 - 贴合项目深色主题 + 绿色accent
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: isDark ? {
            // 暗黑模式 - 深色背景 + 绿色主题
            primaryColor: '#10b981',           // 绿色节点背景
            primaryTextColor: '#ffffff',       // 节点文字白色
            primaryBorderColor: '#10b981',     // 绿色边框
            
            secondaryColor: '#1e40af',         // 深蓝色（菱形等）
            secondaryTextColor: '#ffffff',
            secondaryBorderColor: '#3b82f6',
            
            tertiaryColor: '#ea580c',          // 深橙色（强调）
            tertiaryTextColor: '#ffffff',
            tertiaryBorderColor: '#f59e0b',
            
            // 背景和线条
            background: '#09090b',             // 极深背景
            mainBkg: '#18181b',                // 主背景
            secondBkg: '#27272a',              // 次要背景
            
            lineColor: '#52525b',              // 线条颜色
            border1: '#3f3f46',                // 边框
            border2: '#52525b',
            
            // 文字
            textColor: '#e4e4e7',              // 主文字
            nodeBorder: '#10b981',             // 节点边框
            clusterBkg: '#18181b',             // 集群背景
            clusterBorder: '#3f3f46',
            
            // 流程图特定
            edgeLabelBackground: '#18181b',
            
            // 序列图特定
            actorBorder: '#10b981',
            actorBkg: '#18181b',
            actorTextColor: '#e4e4e7',
            actorLineColor: '#52525b',
            signalColor: '#e4e4e7',
            signalTextColor: '#e4e4e7',
            labelBoxBkgColor: '#27272a',
            labelBoxBorderColor: '#3f3f46',
            labelTextColor: '#e4e4e7',
            loopTextColor: '#e4e4e7',
            noteBorderColor: '#f59e0b',
            noteBkgColor: '#422006',
            noteTextColor: '#fef3c7',
            activationBorderColor: '#10b981',
            activationBkgColor: '#064e3b',
            sequenceNumberColor: '#ffffff',
            
            // 字体
            fontFamily: 'Noto Sans SC, Sora, system-ui, sans-serif',
            fontSize: '14px'
          } : {
            // 浅色模式 - 白色背景 + 绿色主题
            primaryColor: '#dcfce7',           // 浅绿背景
            primaryTextColor: '#14532d',       // 深绿文字
            primaryBorderColor: '#10b981',     // 绿色边框
            
            secondaryColor: '#dbeafe',         // 浅蓝背景
            secondaryTextColor: '#1e3a8a',
            secondaryBorderColor: '#3b82f6',
            
            tertiaryColor: '#fed7aa',          // 浅橙背景
            tertiaryTextColor: '#7c2d12',
            tertiaryBorderColor: '#f59e0b',
            
            // 背景和线条
            background: '#ffffff',
            mainBkg: '#f9fafb',
            secondBkg: '#f3f4f6',
            
            lineColor: '#9ca3af',
            border1: '#d1d5db',
            border2: '#e5e7eb',
            
            // 文字
            textColor: '#1f2937',
            nodeBorder: '#10b981',
            clusterBkg: '#f9fafb',
            clusterBorder: '#d1d5db',
            
            edgeLabelBackground: '#ffffff',
            
            // 序列图特定
            actorBorder: '#10b981',
            actorBkg: '#f9fafb',
            actorTextColor: '#1f2937',
            actorLineColor: '#d1d5db',
            signalColor: '#1f2937',
            signalTextColor: '#1f2937',
            labelBoxBkgColor: '#f3f4f6',
            labelBoxBorderColor: '#d1d5db',
            labelTextColor: '#1f2937',
            loopTextColor: '#1f2937',
            noteBorderColor: '#f59e0b',
            noteBkgColor: '#fffbeb',
            noteTextColor: '#78350f',
            activationBorderColor: '#10b981',
            activationBkgColor: '#d1fae5',
            sequenceNumberColor: '#1f2937',
            
            fontFamily: 'Noto Sans SC, Sora, system-ui, sans-serif',
            fontSize: '14px'
          }
        })
        
        // 渲染图表
        const { svg } = await mermaid.render(id, code)
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (err) {
        console.error('Mermaid渲染失败:', err)
        setError(err instanceof Error ? err.message : '渲染失败')
      }
    }

    renderDiagram()
  }, [code, isDark, index])

  if (error) {
    return (
      <div className="my-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
        Mermaid渲染错误: {error}
      </div>
    )
  }

  return (
    <div className="relative my-6">
      {/* Mermaid图表 */}
      <div 
        ref={containerRef}
        className={`mermaid-container ${isDark ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]' : 'bg-white border border-light-border-subtle shadow-sm'}`}
      />
      
      {/* PC端：右上角AI解析按钮 */}
      <button 
        onClick={() => setShowAssistant(true)}
        className="hidden md:flex absolute top-3 right-3 items-center gap-1.5 px-3 py-1.5 rounded-lg
                   bg-accent-green/10 hover:bg-accent-green/20 text-accent-green
                   text-sm font-medium transition-all duration-200 cursor-pointer"
        title="AI解析流程图"
      >
        <Sparkles size={14} /> AI解析
      </button>
      
      {/* 移动端：下方AI解析按钮 */}
      <button 
        onClick={() => setShowAssistant(true)}
        className="flex md:hidden w-full mt-3 py-3 items-center justify-center gap-2 rounded-xl
                   bg-accent-green/10 hover:bg-accent-green/15 active:bg-accent-green/20 text-accent-green 
                   font-medium transition-all duration-200 cursor-pointer"
      >
        <Sparkles size={16} /> AI解析这个流程图
      </button>
      
      {/* AI助手组件 */}
      <ContentAssistant
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
        contentType="mermaid"
        content={code}
        isDark={isDark}
      />
    </div>
  )
}

/**
 * 解析行内 Markdown（加粗、代码等）
 * 需要在 parseMarkdownContent 之前定义，因为后者会调用此函数
 */
function parseInlineMarkdown(text: string, isDark: boolean): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, `<code class="${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-light-bg-secondary text-light-text-primary'} px-1.5 py-0.5 rounded text-sm font-mono">$1</code>`)
}

/**
 * 解析提示框内容（支持加粗、代码、换行）
 */
function parseAlertContent(text: string, isDark: boolean): string {
  let result = parseInlineMarkdown(text, isDark)
  // 处理列表项
  result = result.replace(/\n- /g, '<br/>• ')
  // 处理换行
  result = result.replace(/\n\n/g, '<br/><br/>')
  result = result.replace(/\n/g, '<br/>')
  return result
}

/**
 * 提取并分离Mermaid代码块
 * 返回：{ parts: 混合内容数组, mermaidBlocks: Mermaid代码数组 }
 */
function extractMermaidBlocks(content: string): { 
  parts: Array<{ type: 'text' | 'mermaid', content: string, index?: number }> 
} {
  const parts: Array<{ type: 'text' | 'mermaid', content: string, index?: number }> = []
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g
  
  let lastIndex = 0
  let match
  let mermaidIndex = 0
  
  while ((match = mermaidRegex.exec(content)) !== null) {
    // 添加Mermaid之前的文本
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index)
      })
    }
    
    // 添加Mermaid代码块
    parts.push({
      type: 'mermaid',
      content: match[1].trim(),
      index: mermaidIndex++
    })
    
    lastIndex = match.index + match[0].length
  }
  
  // 添加剩余文本
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex)
    })
  }
  
  // 如果没有Mermaid代码块，返回整个内容作为文本
  if (parts.length === 0) {
    parts.push({
      type: 'text',
      content: content
    })
  }
  
  return { parts }
}

/**
 * 解析 Markdown 内容，支持表格、标题、列表等（不处理Mermaid）
 */
function parseMarkdownContent(content: string, isDark: boolean): string {
  let result = content
  
  // 处理表格
  const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g
  result = result.replace(tableRegex, (_match, headerRow, bodyRows) => {
    const headers = headerRow.split('|').map((h: string) => h.trim()).filter(Boolean)
    const rows = bodyRows.trim().split('\n').map((row: string) => 
      row.split('|').map((cell: string) => cell.trim()).filter(Boolean)
    )
    
    const tableClass = isDark 
      ? 'w-full my-6 text-sm border-collapse'
      : 'w-full my-6 text-sm border-collapse'
    const thClass = isDark
      ? 'text-left px-4 py-3 font-medium text-zinc-300 border-b-2 border-accent-green/30'
      : 'text-left px-4 py-3 font-medium text-light-text-primary border-b-2 border-accent-green/40'
    const tdClass = isDark
      ? 'px-4 py-3 border-b border-zinc-800/30 text-zinc-400'
      : 'px-4 py-3 border-b border-light-border-subtle text-light-text-secondary'
    
    const headerHtml = headers.map((h: string) => 
      `<th class="${thClass}">${parseInlineMarkdown(h, isDark)}</th>`
    ).join('')
    
    const bodyHtml = rows.map((row: string[]) => 
      `<tr>${row.map((cell: string) => 
        `<td class="${tdClass}">${parseInlineMarkdown(cell, isDark)}</td>`
      ).join('')}</tr>`
    ).join('')
    
    return `<div class="overflow-x-auto my-6 rounded-2xl ${isDark ? 'bg-[#141417] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]' : 'bg-light-bg-card border border-light-border-subtle shadow-sm'}"><table class="${tableClass}"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`
  })
  
  // 处理标题
  result = result.replace(/^## (.*$)/gm, '<h2 class="font-display text-xl font-semibold mt-8 mb-4">$1</h2>')
  result = result.replace(/^### (.*$)/gm, '<h3 class="font-display text-lg font-semibold mt-6 mb-3">$1</h3>')
  
  // 处理行内样式
  result = parseInlineMarkdown(result, isDark)
  
  // 处理列表
  result = result.replace(/\n- /g, '<br/>• ')
  
  // 处理段落
  result = result.replace(/\n\n/g, '</p><p class="mb-4">')
  result = result.replace(/\n/g, '<br/>')
  
  return result
}

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
      <div className="pt-20 md:pt-28 pb-32 px-4 md:px-12 lg:px-16 max-w-4xl mx-auto text-center">
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
      case 'text': {
        // 提取Mermaid代码块
        const { parts } = extractMermaidBlocks(content.content)
        
        return (
          <div key={index}>
            {parts.map((part, partIndex) => {
              if (part.type === 'mermaid') {
                return (
                  <MermaidDiagram 
                    key={`mermaid-${index}-${partIndex}`}
                    code={part.content}
                    isDark={isDark}
                    index={part.index || 0}
                  />
                )
              } else {
                return (
                  <div
                    key={`text-${index}-${partIndex}`}
                    className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}
                    dangerouslySetInnerHTML={{ 
                      __html: parseMarkdownContent(part.content, isDark)
                    }}
                  />
                )
              }
            })}
          </div>
        )
      }
      
      case 'code':
        return (
          <CodeBlock 
            key={index} 
            code={content.content} 
            language={content.language} 
          />
        )
      
      case 'tip':
        return (
          <div
            key={index}
            className={`
              flex gap-4 p-4 rounded-3xl my-6
              ${isDark ? 'bg-accent-green/10 border border-accent-green/20' : 'bg-accent-green/10 border border-accent-green/30'}
            `}
          >
            <Lightbulb size={20} className="text-accent-green flex-shrink-0 mt-0.5" />
            <div 
              className={`text-sm leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}
              dangerouslySetInnerHTML={{ __html: parseAlertContent(content.content, isDark) }}
            />
          </div>
        )
      
      case 'warning':
        return (
          <div
            key={index}
            className={`
              flex gap-4 p-4 rounded-3xl my-6
              ${isDark ? 'bg-accent-orange/10 border border-accent-orange/20' : 'bg-accent-orange/10 border border-accent-orange/30'}
            `}
          >
            <AlertTriangle size={20} className="text-accent-orange flex-shrink-0 mt-0.5" />
            <div 
              className={`text-sm leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}
              dangerouslySetInnerHTML={{ __html: parseAlertContent(content.content, isDark) }}
            />
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
    <div className="pt-20 md:pt-28 pb-32 px-4 md:px-12 lg:px-16 max-w-4xl mx-auto animate-fade-in-up">
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
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200 cursor-pointer
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
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200 cursor-pointer
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

      {/* AI 小测验区域 - 支持多题型、错题重测 */}
      <QuizSection
        lessonId={`${phaseId}-${lessonId}`}
        lessonTitle={lesson.title}
        lessonContent={lesson.contents
          .filter(c => c.type === 'text')
          .map(c => c.content)
          .join('\n\n')
          .slice(0, 12000)}  // 只传主要描述，减少token消耗
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
              className="w-full py-4 rounded-full text-base font-semibold bg-accent-green text-dark-bg-primary cursor-pointer hover:shadow-lg hover:shadow-accent-green/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-green/50 flex items-center justify-center gap-2"
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
                flex-1 flex items-center gap-3 px-6 py-4 rounded-3xl transition-all duration-200 cursor-pointer
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
                flex-1 flex items-center justify-end gap-3 px-6 py-4 rounded-3xl transition-all duration-200 cursor-pointer
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
                flex-1 flex items-center justify-end gap-3 px-6 py-4 rounded-3xl transition-all duration-200 cursor-pointer
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
