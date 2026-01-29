/**
 * AI 服务 - 调用 Cerebras API 生成小测验
 */

// API 配置
const API_BASE = 'https://cerebras-proxy.brain.loocaa.com:1443/v1'
const API_KEY = 'DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK'
const MODEL = 'qwen-3-32b'  // 选用速度快且质量好的模型

// 测验题目类型定义
export class QuizQuestion {
  constructor(
    public id: string,
    public question: string,
    public options: string[],
    public correctIndex: number,
    public explanation: string
  ) {}
}

// 测验结果类型
export class QuizResult {
  constructor(
    public totalQuestions: number,
    public correctCount: number,
    public score: number,
    public feedback: string
  ) {}
}

/**
 * 生成课程小测验
 * @param lessonTitle 课程标题
 * @param lessonContent 课程内容摘要
 * @param questionCount 题目数量
 */
export async function generateQuiz(
  lessonTitle: string,
  lessonContent: string,
  questionCount: number = 3
): Promise<QuizQuestion[]> {
  const prompt = `你是一位 Android 开发教学专家。请根据以下课程内容生成 ${questionCount} 道选择题来测试学习者的理解程度。

课程标题：${lessonTitle}
课程内容摘要：${lessonContent}

请严格按照以下 JSON 格式返回（不要添加任何其他文字）：
{
  "questions": [
    {
      "id": "q1",
      "question": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctIndex": 0,
      "explanation": "答案解析"
    }
  ]
}

要求：
1. 题目要紧扣课程内容，难度适中
2. 每题必须有4个选项
3. correctIndex 是正确答案的索引（0-3）
4. 解析要简洁明了
5. 只返回 JSON，不要有其他内容`

  try {
    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    
    // 解析 JSON 响应
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('无法解析 AI 响应')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    // 转换为 QuizQuestion 对象数组
    return parsed.questions.map((q: {
      id: string
      question: string
      options: string[]
      correctIndex: number
      explanation: string
    }) => new QuizQuestion(
      q.id,
      q.question,
      q.options,
      q.correctIndex,
      q.explanation
    ))
  } catch (error) {
    console.error('生成测验失败:', error)
    throw error
  }
}

/**
 * 计算测验结果
 */
export function calculateQuizResult(
  questions: QuizQuestion[],
  userAnswers: number[]
): QuizResult {
  let correctCount = 0
  
  questions.forEach((q, index) => {
    if (userAnswers[index] === q.correctIndex) {
      correctCount++
    }
  })

  const score = Math.round((correctCount / questions.length) * 100)
  
  let feedback = ''
  if (score === 100) {
    feedback = '太棒了！全部正确，你已经完全掌握了这节课的内容！'
  } else if (score >= 80) {
    feedback = '做得很好！你对这节课的内容理解得相当不错。'
  } else if (score >= 60) {
    feedback = '及格了，但建议回顾一下错题涉及的知识点。'
  } else {
    feedback = '需要加强学习，建议重新阅读课程内容后再试一次。'
  }

  return new QuizResult(questions.length, correctCount, score, feedback)
}
