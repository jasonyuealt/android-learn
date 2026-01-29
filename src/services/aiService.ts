/**
 * AI 服务 - 调用 Cerebras API 生成小测验
 * 支持多种题型、错题重测、动态题目数量
 */

// API 配置
const API_BASE = 'https://cerebras-proxy.brain.loocaa.com:1443/v1'
const API_KEY = 'DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK'
const MODEL = 'qwen-3-32b'

// 题目类型枚举
export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'fill_blank'

// 基础题目类型
export class QuizQuestion {
  constructor(
    public id: string,
    public type: QuestionType,
    public question: string,
    public options: string[],           // 选择题选项 / 判断题为 ['正确', '错误']
    public correctIndex: number | number[], // 单选为数字，多选为数组，填空为 -1
    public correctAnswer?: string,       // 填空题答案
    public explanation: string = ''
  ) {}
}

// 错题记录类型
export class WrongQuestion {
  constructor(
    public question: QuizQuestion,
    public userAnswer: number | number[] | string,
    public timestamp: number = Date.now()
  ) {}
}

// 测验历史记录类型
export class QuizHistory {
  constructor(
    public lessonId: string,
    public questions: QuizQuestion[],     // 已出过的题目
    public wrongQuestions: WrongQuestion[], // 错题记录
    public attemptCount: number = 0        // 测验次数
  ) {}
}

// 测验结果类型
export class QuizResult {
  constructor(
    public totalQuestions: number,
    public correctCount: number,
    public score: number,
    public feedback: string,
    public wrongQuestions: WrongQuestion[] // 本次错题
  ) {}
}

/**
 * 根据课程内容长度估算题目数量
 * @param contentLength 内容字符数
 */
function estimateQuestionCount(contentLength: number): number {
  // 每 200-300 字一道题，最少 3 道，最多 8 道
  const estimated = Math.ceil(contentLength / 250)
  return Math.max(3, Math.min(8, estimated))
}

/**
 * 生成课程小测验（支持错题重测和多种题型）
 * @param lessonTitle 课程标题
 * @param lessonContent 课程内容摘要
 * @param history 历史测验记录（可选）
 */
export async function generateQuiz(
  lessonTitle: string,
  lessonContent: string,
  history?: QuizHistory
): Promise<QuizQuestion[]> {
  // 动态计算题目数量
  const baseCount = estimateQuestionCount(lessonContent.length)
  
  // 准备错题信息（如果有历史记录且未满分）
  const wrongQuestions = history?.wrongQuestions || []
  const previousQuestions = history?.questions || []
  const attemptCount = history?.attemptCount || 0
  
  // 计算新题数量：错题数 + 补充的新题
  const wrongCount = wrongQuestions.length
  const newQuestionCount = Math.max(baseCount - wrongCount, 2) // 至少出 2 道新题
  const totalCount = wrongCount + newQuestionCount
  
  // 构建 prompt
  let prompt = `你是一位 Android 开发教学专家。请根据以下课程内容生成测验题目。

课程标题：${lessonTitle}
课程内容摘要：${lessonContent}

`

  // 如果有错题，需要加入错题（换个问法或换选项顺序）
  if (wrongCount > 0) {
    prompt += `【重要】学习者上次测验有 ${wrongCount} 道题答错了，请先针对这些错题的知识点重新出题（可以换个角度或问法）：
${wrongQuestions.map((wq, i) => `${i + 1}. 原题：${wq.question.question}
   正确答案：${wq.question.type === 'fill_blank' ? wq.question.correctAnswer : wq.question.options[wq.question.correctIndex as number]}
   学习者答错了这个知识点，请针对同一知识点换个方式出题。`).join('\n')}

`
  }

  // 如果之前出过题，提示避免重复
  if (previousQuestions.length > 0 && attemptCount > 0) {
    prompt += `【注意】以下是之前已出过的题目，请尽量避免出相同或过于相似的题目，以扩大知识点覆盖面：
${previousQuestions.slice(-10).map(q => `- ${q.question}`).join('\n')}

`
  }

  prompt += `请生成 ${totalCount} 道题目，要求：
1. 题型多样化，包括：
   - single_choice（单选题）：4个选项
   - multiple_choice（多选题）：4个选项，2-3个正确答案
   - true_false（判断题）：判断陈述是否正确
   - fill_blank（填空题）：填写关键词或代码片段
2. 各种题型尽量均衡分布
3. 难度适中，紧扣课程内容
4. 尽量覆盖课程的不同知识点

请严格按照以下 JSON 格式返回（不要添加任何其他文字）：
{
  "questions": [
    {
      "id": "q1",
      "type": "single_choice",
      "question": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctIndex": 0,
      "explanation": "答案解析"
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "question": "以下哪些说法是正确的？",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctIndex": [0, 2],
      "explanation": "答案解析"
    },
    {
      "id": "q3",
      "type": "true_false",
      "question": "某个陈述句",
      "options": ["正确", "错误"],
      "correctIndex": 0,
      "explanation": "答案解析"
    },
    {
      "id": "q4",
      "type": "fill_blank",
      "question": "在 Kotlin 中，使用 _____ 关键字声明不可变变量",
      "options": [],
      "correctIndex": -1,
      "correctAnswer": "val",
      "explanation": "答案解析"
    }
  ]
}

注意事项：
- single_choice: correctIndex 是正确答案的索引（0-3）
- multiple_choice: correctIndex 是正确答案索引的数组，如 [0, 2]
- true_false: options 固定为 ["正确", "错误"]，correctIndex 为 0 或 1
- fill_blank: correctIndex 为 -1，答案放在 correctAnswer 字段
- 只返回 JSON，不要有其他内容`

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
        max_tokens: 4000  // 增加 token 限制以支持更多题目
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
      type: QuestionType
      question: string
      options: string[]
      correctIndex: number | number[]
      correctAnswer?: string
      explanation: string
    }) => new QuizQuestion(
      q.id,
      q.type || 'single_choice',
      q.question,
      q.options || [],
      q.correctIndex,
      q.correctAnswer,
      q.explanation
    ))
  } catch (error) {
    console.error('生成测验失败:', error)
    throw error
  }
}

/**
 * 检查答案是否正确
 */
export function checkAnswer(
  question: QuizQuestion,
  userAnswer: number | number[] | string
): boolean {
  switch (question.type) {
    case 'single_choice':
    case 'true_false':
      return userAnswer === question.correctIndex
    
    case 'multiple_choice':
      // 多选题：用户答案和正确答案数组完全匹配
      const correctArr = question.correctIndex as number[]
      const userArr = userAnswer as number[]
      if (correctArr.length !== userArr.length) return false
      return correctArr.every(idx => userArr.includes(idx))
    
    case 'fill_blank':
      // 填空题：忽略大小写和首尾空格
      const userStr = (userAnswer as string).trim().toLowerCase()
      const correctStr = (question.correctAnswer || '').trim().toLowerCase()
      return userStr === correctStr
    
    default:
      return false
  }
}

/**
 * 计算测验结果
 */
export function calculateQuizResult(
  questions: QuizQuestion[],
  userAnswers: (number | number[] | string)[]
): QuizResult {
  let correctCount = 0
  const wrongQuestions: WrongQuestion[] = []
  
  questions.forEach((q, index) => {
    const userAnswer = userAnswers[index]
    const isCorrect = checkAnswer(q, userAnswer)
    
    if (isCorrect) {
      correctCount++
    } else {
      wrongQuestions.push(new WrongQuestion(q, userAnswer))
    }
  })

  const score = Math.round((correctCount / questions.length) * 100)
  
  let feedback = ''
  if (score === 100) {
    feedback = '太棒了！全部正确，你已经完全掌握了这节课的内容！'
  } else if (score >= 80) {
    feedback = '做得很好！你对这节课的内容理解得相当不错。'
  } else if (score >= 60) {
    feedback = '及格了，建议针对错题涉及的知识点再复习一下。'
  } else {
    feedback = '需要加强学习，建议重新阅读课程内容后再试一次。'
  }

  return new QuizResult(questions.length, correctCount, score, feedback, wrongQuestions)
}

/**
 * 获取题型显示名称
 */
export function getQuestionTypeName(type: QuestionType): string {
  const names: Record<QuestionType, string> = {
    single_choice: '单选题',
    multiple_choice: '多选题',
    true_false: '判断题',
    fill_blank: '填空题'
  }
  return names[type] || '选择题'
}
