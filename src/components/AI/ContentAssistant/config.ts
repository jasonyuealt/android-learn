/**
 * ContentAssistant 配置
 */

import type { UIConfig } from './types'

// 开发环境判断
export const isDev = import.meta.env.DEV
export const DEV_API_BASE = import.meta.env.VITE_AI_API_BASE || 'https://cerebras-proxy.brain.loocaa.com:1443/v1'
export const DEV_API_KEY = import.meta.env.VITE_AI_API_KEY || 'DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK'
export const DEV_MODEL = import.meta.env.VITE_AI_MODEL || 'qwen-3-coder-480b'

/**
 * 根据内容类型生成System Prompt
 */
export function getSystemPrompt(type: 'mermaid' | 'code'): string {
  if (type === 'mermaid') {
    return `你是一个专业的 Android/Kotlin 开发助手。用户正在学习课程中的流程图，需要你用通俗易懂的语言解释。

请按以下格式回答：

1. **流程概述**（1-2句话）
总体说明这个流程图在做什么，解决什么问题。

2. **步骤详解**
按照流程图的执行顺序，逐步解释每个关键节点：
- 使用清晰的序号（①②③...）
- 每个步骤说明"做什么"和"为什么"
- 标注关键决策点和分支逻辑

3. **实际应用**（可选）
简单举例在Android开发中的实际使用场景。

要求：
- 语言通俗，避免过多专业术语
- 重点解释流程的逻辑关系和目的
- 代码示例用 \`\`\`kotlin 包裹
- 不要使用 <think> 标签`
  }
  
  return `你是一个专业的 Android/Kotlin 开发教学助手。用户正在学习代码示例，需要你逐步讲解。

请按以下格式回答：

1. **代码功能**（1-2句话）
整体说明这段代码在做什么，解决什么问题。

2. **逐步讲解**
按顺序解释关键代码行/段落：
- 标注关键语句（可以用序号或简短描述）
- 说明每部分的作用和为什么这样写
- 解释重要的语法特性或API调用

3. **重点提示**
- 标注初学者容易忽略的细节（如类型、null安全、作用域等）
- 说明体现的最佳实践或常见模式

4. **实际应用**（可选）
简单说明这段代码在实际项目中的应用场景。

要求：
- 语言通俗，逐步解释
- 重点标注初学者易错点
- 代码示例用 \`\`\`kotlin 包裹
- 不要使用 <think> 标签`
}

/**
 * 根据内容类型生成初始消息
 */
export function getInitialMessage(
  type: 'mermaid' | 'code',
  content: string,
  language: string
): string {
  if (type === 'mermaid') {
    return `请用通俗易懂的语言解释这个流程图：\n\n\`\`\`mermaid\n${content}\n\`\`\`\n\n帮我理解这个流程的执行步骤和逻辑。`
  }
  return `请逐步讲解这段${language}代码：\n\n\`\`\`${language}\n${content}\n\`\`\`\n\n帮我理解每部分的作用和逻辑。`
}

/**
 * 根据内容类型获取UI配置
 */
export function getUIConfig(type: 'mermaid' | 'code'): UIConfig {
  if (type === 'mermaid') {
    return {
      title: '流程图解析',
      subtitle: '智能解读流程逻辑',
      iconBg: 'bg-accent-green/15',
      iconColor: 'text-accent-green',
      ringColor: 'focus:ring-accent-green/50',
      buttonBg: 'bg-accent-green',
      buttonHover: 'hover:bg-accent-green/90',
      cursorColor: 'bg-accent-green'
    }
  }
  return {
    title: '代码解析',
    subtitle: '智能讲解代码逻辑',
    iconBg: 'bg-accent-blue/15',
    iconColor: 'text-accent-blue',
    ringColor: 'focus:ring-accent-blue/50',
    buttonBg: 'bg-accent-blue',
    buttonHover: 'hover:bg-accent-blue/90',
    cursorColor: 'bg-accent-blue'
  }
}
