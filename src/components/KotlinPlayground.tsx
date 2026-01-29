import { useState, useRef, useEffect } from 'react'
import { Play, X, Copy, Check, Loader2 } from 'lucide-react'
import { Logo } from './Logo'
import { useThemeBloc } from '../blocs/themeBloc'

/**
 * Kotlin 编辑器核心组件（可复用）
 * 提供代码编辑、运行、输出等功能
 */
export function KotlinEditor({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [code, setCode] = useState(DEFAULT_CODE)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 监听 isOpen 变化，控制动画
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  // 处理关闭动画
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 200)
  }

  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`
    }
  }, [code])

  // 复制代码
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 运行代码
  const runCode = async () => {
    setIsRunning(true)
    setError('')
    setOutput('')

    try {
      const response = await fetch('https://api.kotlinlang.org/api/2.0.21/compiler/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          args: '',
          files: [{ name: 'File.kt', text: code }],
          confType: 'java',
        }),
      })

      if (!response.ok) {
        throw new Error(`运行失败 (${response.status})`)
      }

      const result = await response.json()
      
      // 处理编译错误（只处理 ERROR，忽略 WARNING）
      if (result.errors && typeof result.errors === 'object') {
        const allErrors = Object.values(result.errors)
          .flat()
          .filter((err): err is { message?: string; severity?: string } => {
            if (err == null) return false
            // 只有 severity 为 ERROR 的才算真正的错误
            const severity = (err as { severity?: string }).severity?.toUpperCase()
            return severity === 'ERROR'
          })
        
        if (allErrors.length > 0) {
          const errorMessages = allErrors
            .map((err) => err.message || '编译错误')
            .join('\n')
          setError(errorMessages)
          return
        }
      }
      
      // 处理运行时异常
      if (result.exception) {
        setError(result.exception)
        return
      }
      
      // 处理成功输出
      let outputText = result.text ?? result.output ?? result.stdout ?? ''
      
      const outStreamMatch = outputText.match(/<outStream>([\s\S]*?)<\/outStream>/)
      if (outStreamMatch) {
        outputText = outStreamMatch[1]
      }
      
      const errStreamMatch = outputText.match(/<errStream>([\s\S]*?)<\/errStream>/)
      if (errStreamMatch) {
        setError(errStreamMatch[1])
        return
      }
      
      if (outputText.trim()) {
        setOutput(outputText)
      } else {
        setOutput('(程序执行完成，无输出内容)')
      }
    } catch (err) {
      console.error('Kotlin run error:', err)
      setError(err instanceof Error ? err.message : '运行失败，请检查网络连接')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <>
      {/* 面板 */}
      {isOpen && (
        <div 
          data-modal="kotlin-playground"
          className={`
            fixed inset-0 z-50 flex items-end md:items-center justify-center
            transition-opacity duration-200 ease-out
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* 面板内容 - 移动端从底部弹出 */}
          <div 
            className={`
              relative w-full md:max-w-3xl 
              max-h-[85vh] md:max-h-[90vh] 
              overflow-hidden
              rounded-t-3xl md:rounded-3xl shadow-2xl
              transition-all duration-200 ease-out
              ${isVisible 
                ? 'opacity-100 translate-y-0 md:scale-100' 
                : 'opacity-0 translate-y-8 md:translate-y-4 md:scale-95'
              }
              ${isDark ? 'bg-[#1a1a1f]' : 'bg-white'}
            `}
          >
            {/* 移动端拖拽条 */}
            <div className="md:hidden flex justify-center py-2">
              <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
            </div>

            {/* 头部 */}
            <div className={`
              flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b
              ${isDark ? 'border-zinc-800' : 'border-light-border-DEFAULT'}
            `}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-accent-green/15 flex items-center justify-center">
                  <Logo size={18} className="text-accent-green" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm md:text-base">Kotlin 在线测试</h2>
                  <p className={`text-xs md:text-sm ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
                    编写代码，即时运行
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className={`
                  p-2 rounded-full transition-colors duration-150 cursor-pointer
                  ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-light-bg-secondary'}
                `}
              >
                <X size={20} />
              </button>
            </div>

            {/* 代码编辑区 */}
            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(85vh-180px)] md:max-h-[calc(90vh-180px)]">
              <div className={`
                rounded-2xl overflow-hidden
                ${isDark ? 'bg-[#0f0f12]' : 'bg-light-bg-secondary'}
              `}>
                {/* 工具栏 */}
                <div className={`
                  flex items-center justify-between px-3 md:px-4 py-2 border-b
                  ${isDark ? 'border-zinc-800/50' : 'border-light-border-subtle'}
                `}>
                  <span className={`text-xs uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
                    kotlin
                  </span>
                  <button
                    onClick={handleCopy}
                    className={`
                      flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors duration-150 cursor-pointer
                      ${isDark 
                        ? 'bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800' 
                        : 'bg-light-bg-card text-light-text-secondary hover:text-light-text-primary'
                      }
                    `}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span className="hidden sm:inline">{copied ? '已复制' : '复制'}</span>
                  </button>
                </div>
                
                {/* 代码输入 */}
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`
                    w-full p-3 md:p-4 font-mono text-xs md:text-sm leading-relaxed resize-none
                    focus:outline-none transition-colors duration-150
                    ${isDark 
                      ? 'bg-transparent text-zinc-300 placeholder-zinc-600' 
                      : 'bg-transparent text-light-text-primary placeholder-light-text-muted'
                    }
                  `}
                  placeholder="在这里输入 Kotlin 代码..."
                  spellCheck={false}
                  style={{ minHeight: '120px' }}
                />
              </div>

              {/* 输出区域 */}
              {(output || error) && (
                <div className={`
                  mt-4 rounded-2xl overflow-hidden
                  ${isDark ? 'bg-[#0f0f12]' : 'bg-light-bg-secondary'}
                `}>
                  <div className={`
                    px-3 md:px-4 py-2 border-b
                    ${isDark ? 'border-zinc-800/50' : 'border-light-border-subtle'}
                  `}>
                    <span className={`text-xs uppercase tracking-widest ${error ? 'text-red-400' : isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
                      {error ? '错误' : '输出'}
                    </span>
                  </div>
                  <pre className={`
                    p-3 md:p-4 font-mono text-xs md:text-sm whitespace-pre-wrap overflow-x-auto
                    ${error 
                      ? 'text-red-400' 
                      : isDark ? 'text-accent-green' : 'text-green-600'
                    }
                  `}>
                    {error || output}
                  </pre>
                </div>
              )}

              {/* 提示 */}
              <p className={`mt-4 text-xs md:text-sm ${isDark ? 'text-zinc-500' : 'text-light-text-muted'}`}>
                提示：确保代码有 <code className={`px-1 py-0.5 rounded text-xs ${isDark ? 'bg-zinc-800' : 'bg-light-bg-secondary'}`}>fun main()</code> 函数
              </p>
            </div>

            {/* 底部按钮 */}
            <div className={`
              flex items-center justify-end gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 border-t
              ${isDark ? 'border-zinc-800' : 'border-light-border-DEFAULT'}
            `}>
              <button
                onClick={() => {
                  setCode(DEFAULT_CODE)
                  setOutput('')
                  setError('')
                }}
                className={`
                  px-3 md:px-4 py-2 md:py-2.5 rounded-full text-xs md:text-sm transition-colors duration-150 cursor-pointer
                  ${isDark 
                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                    : 'bg-light-bg-secondary text-light-text-secondary hover:bg-light-bg-hover'
                  }
                `}
              >
                重置
              </button>
              <button
                onClick={runCode}
                disabled={isRunning || !code.trim()}
                className={`
                  flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm text-white
                  transition-all duration-150 cursor-pointer
                  ${isRunning || !code.trim()
                    ? 'bg-accent-green/50 cursor-not-allowed'
                    : 'bg-accent-green hover:bg-accent-green/90 hover:shadow-lg hover:shadow-accent-green/25'
                  }
                `}
              >
                {isRunning ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span className="hidden sm:inline">运行中...</span>
                    <span className="sm:hidden">运行</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    运行代码
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Kotlin 在线测试组件 - 右下角浮动按钮
 * 注意：此组件仅显示图标，功能已移至导航栏的"在线测验"按钮
 */
export function KotlinPlayground() {
  return (
    <>
      {/* 浮动按钮 - 仅显示，无功能 */}
      <button
        onClick={() => {
          // 功能已移至导航栏，此处不执行任何操作
        }}
        className={`
          fixed bottom-24 right-4 md:bottom-8 md:right-6 z-40
          w-12 h-12 md:w-14 md:h-14 rounded-2xl
          flex items-center justify-center
          shadow-lg cursor-pointer
          transition-all duration-300 ease-out
          hover:scale-105 hover:shadow-xl hover:rounded-3xl
          active:scale-95
          bg-gradient-to-br from-accent-green to-emerald-600
        `}
        title="在线测试（功能已移至导航栏）"
      >
        <Logo size={22} className="text-dark-bg-primary" />
      </button>
    </>
  )
}

// 默认代码示例
const DEFAULT_CODE = `fun main() {
    // 在这里编写 Kotlin 代码
    val name = "Kotlin"
    println("Hello, $name!")
    
    val numbers = listOf(1, 2, 3, 4, 5)
    val doubled = numbers.map { it * 2 }
    println("原列表: $numbers")
    println("翻倍后: $doubled")
}`
