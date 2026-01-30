/**
 * Vercel Serverless Function - AI Chat API 代理
 * 
 * 功能：代理前端到 AI API 的请求，隐藏 API key
 * 路由：POST /api/ai-chat
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

// AI API 配置（从环境变量读取，不暴露到前端）
const API_BASE = process.env.AI_API_BASE
const API_KEY = process.env.AI_API_KEY
const MODEL = process.env.AI_MODEL || 'qwen-3-32b'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 验证环境变量
  if (!API_BASE || !API_KEY) {
    console.error('Missing AI API configuration')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const { messages, systemPrompt, maxTokens = 1500, temperature = 0.7, stream = true } = req.body

    // 验证请求参数
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    // 构建请求消息
    const requestMessages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages

    // 调用真实的 AI API
    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: requestMessages,
        max_tokens: maxTokens,
        temperature: temperature,
        stream: stream
      })
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    // 根据 stream 参数决定返回格式
    if (stream) {
      // 流式响应
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      // 转发流式响应
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        res.write(chunk)
      }

      res.end()
    } else {
      // 非流式响应（直接返回 JSON）
      const data = await response.json()
      res.status(200).json(data)
    }

  } catch (error) {
    console.error('AI API error:', error)
    
    // 如果还没有发送响应，返回错误
    if (!res.headersSent) {
      res.status(500).json({
        error: 'AI service unavailable',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}
