/**
 * 页面上下文 Hook
 * 根据当前路由获取页面相关信息
 */

import { useLocation } from 'react-router-dom'
import { getLessonById, courseData } from '../../../../data/courses'
import { projectsData } from '../../../../data/projects'

interface PageContext {
  type: string
  title: string
  content: string
  prompt: string
}

export function usePageContext(): PageContext {
  const location = useLocation()
  
  // 课程详情页
  const lessonMatch = location.pathname.match(/^\/learn\/([^/]+)\/([^/]+)$/)
  if (lessonMatch) {
    const [, phaseId, lessonId] = lessonMatch
    const lesson = getLessonById(phaseId, lessonId)
    const phase = courseData.find(p => p.id === phaseId)
    
    if (lesson && phase) {
      const contentText = lesson.contents
        .filter(c => c.type === 'text' || c.type === 'code')
        .map(c => c.content)
        .join('\n')
        .slice(0, 3000) // 限制字符数
      
      return {
        type: 'lesson',
        title: `${phase.name} - ${lesson.title}`,
        content: `课程标题：${lesson.title}\n课程描述：${lesson.description}\n\n课程内容摘要：\n${contentText}`,
        prompt: '关于这节课的内容，有什么想了解的吗？'
      }
    }
  }
  
  // 项目详情页
  const projectMatch = location.pathname.match(/^\/projects\/([^/]+)$/)
  if (projectMatch) {
    const [, projectId] = projectMatch
    const project = projectsData.find(p => p.id === projectId)
    
    if (project) {
      const features = project.features?.join('\n- ') || ''
      const steps = project.steps?.map(s => s.title).join('\n- ') || ''
      
      return {
        type: 'project',
        title: project.name,
        content: `项目名称：${project.name}\n项目描述：${project.description}\n\n主要功能：\n- ${features}\n\n开发步骤：\n- ${steps}`,
        prompt: '关于这个项目，有什么想了解的吗？'
      }
    }
  }
  
  // 学习列表页
  if (location.pathname === '/learn') {
    return {
      type: 'learn',
      title: '学习路径',
      content: `这是 Android Learn 的学习路径页面。包含 5 个学习阶段：\n1. 基础入门 - Kotlin 语法、开发环境\n2. 核心组件 - Activity、Fragment、UI 开发\n3. 数据与网络 - 本地存储、网络请求\n4. 架构进阶 - MVVM、依赖注入\n5. 实战项目 - 完整项目开发`,
      prompt: '关于 Android 学习路径，有什么想了解的吗？'
    }
  }
  
  // 项目列表页
  if (location.pathname === '/projects') {
    return {
      type: 'projects',
      title: '实战项目',
      content: `这是实战项目列表页面。包含 8 个难度递增的项目：待办清单、天气应用、新闻阅读、音乐播放器、相册应用、即时通讯、电商应用、小游戏。`,
      prompt: '关于实战项目，有什么想了解的吗？'
    }
  }
  
  // 首页
  if (location.pathname === '/') {
    return {
      type: 'home',
      title: 'Android Learn',
      content: `这是 Android Learn 首页。一个面向 AI 时代的安卓开发学习平台，帮助零基础学习者掌握安卓开发。`,
      prompt: '关于 Android 开发学习，有什么想了解的吗？'
    }
  }
  
  // 默认通用助手
  return {
    type: 'general',
    title: 'Android 开发助手',
    content: '我是你的 Android 开发助手，可以回答关于 Android 开发、Kotlin 语言、架构模式等问题。',
    prompt: '有什么 Android 开发相关的问题吗？'
  }
}
