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

  // 验证环境变量并记录详细日志
  console.log('Environment check:', {
    hasApiBase: !!API_BASE,
    hasApiKey: !!API_KEY,
    model: MODEL,
    apiBaseLength: API_BASE?.length || 0,
    apiKeyLength: API_KEY?.length || 0
  })

  if (!API_BASE || !API_KEY) {
    console.error('Missing AI API configuration:', {
      API_BASE: API_BASE ? 'present' : 'missing',
      API_KEY: API_KEY ? 'present' : 'missing'
    })
    return res.status(500).json({ 
      error: 'Server configuration error',
      details: {
        apiBase: API_BASE ? 'configured' : 'missing',
        apiKey: API_KEY ? 'configured' : 'missing'
      }
    })
  }

  try {
    const { messages, systemPrompt, maxTokens = 1500, temperature = 0.7, stream = true } = req.body

    console.log('Request received:', {
      messagesCount: messages?.length || 0,
      hasSystemPrompt: !!systemPrompt,
      maxTokens,
      temperature,
      stream
    })

    // 验证请求参数
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    // 构建请求消息
    const requestMessages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages

    // 调用真实的 AI API
    console.log('Calling AI API:', `${API_BASE}/chat/completions`)
    
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

    console.log('AI API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`AI API error: ${response.status} - ${errorText}`)
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
    console.error('Handler error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // 如果还没有发送响应，返回错误
    if (!res.headersSent) {
      res.status(500).json({
        error: 'AI service unavailable',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: '500'
      })
    }
  }
}
