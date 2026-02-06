/**
 * AI 服务 - 调用 Cerebras API 生成小测验
 * 支持多种题型、错题重测、动态题目数量
 */

// 开发环境判断
const isDev = import.meta.env.DEV

// AI API 配置（仅开发环境使用）
const DEV_API_BASE = import.meta.env.VITE_AI_API_BASE || 'https://cerebras-proxy.brain.loocaa.com:1443/v1'
const DEV_API_KEY = import.meta.env.VITE_AI_API_KEY || 'DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK'
const DEV_MODEL = import.meta.env.VITE_AI_MODEL || 'qwen-3-coder-480b'

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
    public explanation: string = '',
    public codeSnippet?: string,        // 代码片段（用于代码评估题）
    public scenario?: string             // 场景描述（用于场景应用题）
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
 * 验证题目的基本合理性
 * @param q 题目对象
 * @returns 验证结果
 */
function validateQuestion(q: QuizQuestion): { valid: boolean; issue?: string } {
  // 1. 选项数量检查
  if (q.type !== 'fill_blank' && q.options.length < 2) {
    return { valid: false, issue: '选项数量不足' }
  }
  
  // 2. 正确答案索引检查
  if (q.type === 'single_choice' || q.type === 'true_false') {
    if (typeof q.correctIndex !== 'number' || q.correctIndex >= q.options.length || q.correctIndex < 0) {
      return { valid: false, issue: '正确答案索引错误' }
    }
  }
  
  if (q.type === 'multiple_choice') {
    if (!Array.isArray(q.correctIndex) || q.correctIndex.length === 0) {
      return { valid: false, issue: '多选题缺少正确答案' }
    }
    if (q.correctIndex.some((idx: number) => idx >= q.options.length || idx < 0)) {
      return { valid: false, issue: '多选题答案索引超出范围' }
    }
  }
  
  // 3. 避免纯记忆题（关键词检测）
  const memoryKeywords = ['是什么', '叫什么', '定义是', '关键字是', '名称是']
  if (memoryKeywords.some(kw => q.question.includes(kw))) {
    return { valid: false, issue: '疑似纯记忆题，不符合学习目标' }
  }
  
  // 4. 填空题必须有答案
  if (q.type === 'fill_blank' && !q.correctAnswer) {
    return { valid: false, issue: '填空题缺少正确答案' }
  }
  
  return { valid: true }
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
  // 准备错题信息（如果有历史记录且未满分）
  const wrongQuestions = history?.wrongQuestions || []
  const previousQuestions = history?.questions || []
  const attemptCount = history?.attemptCount || 0
  
  // 计算题目数量
  const wrongCount = wrongQuestions.length
  let totalCount: number
  
  if (wrongCount > 0) {
    // 错题重测：基于错题数量出题（可以多出一些来多角度考察）
    // 至少出错题数量，最多出基础题目数
    const baseCount = estimateQuestionCount(lessonContent.length)
    totalCount = Math.min(Math.max(wrongCount, 5), baseCount)
  } else {
    // 首次测验：根据课程内容长度动态计算
    totalCount = estimateQuestionCount(lessonContent.length)
  }
  
  // 构建 prompt
  let prompt = `你是一位 Android 开发教学专家。请根据以下课程内容生成测验题目。

【重要】题目必须完全基于课程内容
- 所有题目必须直接来源于课程中讲解的知识点
- 不要出现课程中未提及的概念、API或技术
- 题目的难度和深度应与课程内容保持一致
- 每道题都应该能在课程内容中找到对应的知识点

课程标题：${lessonTitle}
课程内容摘要：${lessonContent}

`

  // 如果有错题，需要加入错题（换个问法或换选项顺序）
  if (wrongCount > 0) {
    prompt += `【重要】这是一次错题重测，学习者上次测验有 ${wrongCount} 道题答错了。
请**只针对**这些错题涉及的知识点出 ${totalCount} 道题，从多个角度巩固这些知识点：

${wrongQuestions.map((wq, i) => `${i + 1}. 原题：${wq.question.question}
   正确答案：${wq.question.type === 'fill_blank' ? wq.question.correctAnswer : wq.question.options[wq.question.correctIndex as number]}
   学习者答错了这个知识点，需要重点巩固。`).join('\n')}

【错题重测要求】
- 所有 ${totalCount} 道题都必须围绕上述错题涉及的知识点
- 可以从不同角度、场景、难度来考察同一知识点
- 如果错题较少，可以针对同一知识点出多道不同形式的题目
- 禁止引入错题以外的新知识点

`
  }

  // 如果之前出过题，提示避免重复（但错题重测时跳过此提示）
  if (previousQuestions.length > 0 && attemptCount > 0 && wrongCount === 0) {
    prompt += `【注意】以下是之前已出过的题目，请尽量避免出相同或过于相似的题目，以扩大知识点覆盖面：
${previousQuestions.slice(-10).map(q => `- ${q.question}`).join('\n')}

`
  }

  prompt += `请生成 ${totalCount} 道题目。

【严格约束】出题范围限制
- 只能基于"课程内容"中明确出现的代码示例、概念、API
- 如果课程内容中没有讲到某个知识点，绝对不能出现在题目中
- 选项中的所有代码写法、术语、API，必须在课程内容中出现过
- 题目难度不能高于课程内容的难度
- 禁止引入课程外的知识点（例如：课程讲val/var，不能问lateinit）

【自检清单】生成题目后，请自我检查：
1. 题目中的每个概念是否在课程内容中出现？
2. 选项中的代码是否基于课程内的示例？
3. 如果课程只讲了基础用法，是否避免了高级用法？
4. 题目是否可以通过课程内容直接回答，无需额外知识？

【核心原则】题目必须基于当前课程内容
- 仔细阅读上述课程内容
- 只出现课程中明确讲解过的知识点
- 题目难度与课程深度匹配
- 确保学员通过本课程学习后能够回答这些题目

【学习目标】本课程面向**具有AI辅助能力的初学者**，目标是培养"理解代码"和"评估代码质量"的能力，而非纯记忆。

【题目设计原则】
1. 70%场景应用题：基于课程中的实际案例，给定需求选择合适方案
2. 20%概念理解题：理解课程讲解的核心概念之间的区别
3. 10%代码评估题：评估课程中出现的代码模式是否存在问题

【题目难度分级】请严格按照以下比例生成：
- 简单（50%）：直接考察课程中明确讲解的概念，选项差异明显，一眼能看出答案区别
- 中等（40%）：需要理解课程内容后进行简单推理，结合课程中2个知识点
- 困难（10%）：场景应用，需要综合课程中3个知识点，但仍在课程范围内

禁止生成"困难+"级别题目（需要课程外知识或复杂推理）

【题型要求】
- single_choice（单选）：场景选择题，问"应该用哪个/怎么做"而非"是什么/叫什么"
- multiple_choice（多选）：代码问题识别，"以下哪些可能导致问题"
- true_false（判断）：判断实践性陈述的正确性
- fill_blank（填空）：填写课程中强调的关键API或语法关键字

【代码片段使用规则 - 重要】
codeSnippet 字段应该谨慎使用，仅在以下情况添加：

✓ 代码是评估对象（评估题）：
  示例：
  {
    "codeSnippet": "viewModelScope.launch {\n  val user = fetchUser()\n  updateUI(user.name)\n}",
    "question": "以上代码可能存在什么问题？",
    "options": ["主线程阻塞", "空指针异常", "内存泄漏", "没有问题"]
  }

✓ 代码提供必要的技术背景：
  示例：
  {
    "codeSnippet": "class UserRepository {\n  suspend fun fetchUser(): User\n}",
    "question": "在ViewModel中调用fetchUser()时，应该使用哪个作用域？",
    "options": ["GlobalScope", "viewModelScope", "lifecycleScope", "MainScope"]
  }

✗ 不要使用的情况：
- 代码片段的内容和选项重复（如codeSnippet显示"data class User(var name: String)"，选项A也是"data class User(var name: String)"）
- 代码片段只是装饰，与题目无实质关联
- 题目可以通过文字清晰表达，不需要代码示例
- 题目问"以下哪些写法"，但这些"写法"应该在选项里，而不是codeSnippet里

【场景描述使用规则 - 重要】
scenario 字段应该谨慎使用，仅在以下情况添加：
✓ 代码需要业务背景才能评估（如"这是实时聊天应用的消息处理代码"）
✓ 题目需要特定约束条件（如"需要在后台持续运行"）
✓ 提供题目中无法表达的上下文信息

✗ 不要使用的情况：
- 场景描述和题目重复表达相同信息
- 场景描述只是把题目换了种说法
- 题目本身已经清晰完整

【示例对比】

✗ 错误示例1（冗余 - scenario）：
{
  "scenario": "设计用户信息数据模型，要求属性不可变且需要支持快速复制",
  "question": "当需要设计一个不可变的数据模型（如表示网络请求返回的用户信息）时，应该优先选择哪种类类型？"
}
// ❌ 场景和题目重复了！

✗ 错误示例2（冗余 - codeSnippet）：
{
  "codeSnippet": "data class User(var name: String)\ndata class Settings(val theme: String = \"dark\")",
  "question": "以下哪些data class的写法可能导致潜在问题？",
  "options": [
    "data class User(var name: String)",  // ❌ 和codeSnippet重复！
    "data class Product(val id: Int, private val price: Double)",
    "data class Profile(val name: String, @Transient val sessionToken: String)",
    "data class Settings(val theme: String = \"dark\")"  // ❌ 和codeSnippet重复！
  ]
}
// ❌ codeSnippet的内容出现在选项里，造成混乱！

✓ 正确示例1（无需scenario和codeSnippet）：
{
  "question": "当需要设计一个不可变的数据模型（如用户信息、网络响应数据）且需要支持快速复制时，应该优先选择哪种类类型？"
}
// ✅ 题目已包含所有信息

✓ 正确示例2（codeSnippet作为评估对象）：
{
  "codeSnippet": "viewModelScope.launch {\n  val user = repository.fetchUser()\n  textView.text = user.name\n}",
  "question": "以上代码可能存在哪些问题？",
  "options": [
    "可能在后台线程更新UI",
    "没有处理网络异常",
    "可能导致内存泄漏",
    "缺少空安全检查"
  ],
  "correctIndex": [1, 3]
}
// ✅ codeSnippet是评估对象，选项不重复代码内容

✓ 正确示例3（scenario+codeSnippet组合使用）：
{
  "scenario": "你正在开发一个电商应用，购物车数据需要在用户切换到其他应用后仍能继续处理订单",
  "codeSnippet": "viewModelScope.launch { processCart() }",
  "question": "在上述场景中，这段代码可能会导致什么问题？",
  "options": [
    "用户切换应用后订单处理会中断",
    "可能阻塞主线程",
    "无法处理网络错误",
    "没有问题"
  ],
  "correctIndex": 0
}
// ✅ scenario提供业务背景，codeSnippet是评估对象，题目关联两者

✓ 正确示例4（多选题 - 选项本身是代码，无需codeSnippet）：
{
  "question": "以下哪些data class的写法可能导致潜在问题？",
  "options": [
    "data class User(var name: String)",
    "data class Product(val id: Int, private val price: Double)",
    "data class Profile(val name: String, @Transient val sessionToken: String)",
    "data class Settings(val theme: String = \"dark\")"
  ],
  "correctIndex": [0, 1, 2]
}
// ✅ 选项本身就是待评估的代码，不需要额外的codeSnippet

【示例好题】
✓ "你需要同时请求用户信息和订单列表（互不依赖），应该用："
✓ "以下代码可能导致哪些问题：viewModelScope.launch { val user = fetchUser(); updateUI(user.name) }"
✓ "在MVVM架构中，网络请求应该放在哪一层？"

【避免的题型】
✗ "Kotlin中声明不可变变量的关键字是什么？"（纯记忆）
✗ "data class的定义是什么？"（纯记忆）
✗ "协程的英文名称是？"（无意义记忆）

【题目表述完整性要求 - 重要】
1. 代码评估题必须提供足够的上下文信息
2. 如果代码的行为依赖于某些假设（如函数实现方式），必须在题目或 scenario 中明确说明
3. 避免因缺少上下文而导致多个答案都"可能正确"的情况

✗ 错误示例（缺少上下文）：
{
  "codeSnippet": "viewModelScope.launch { fetchUser() }",
  "question": "以上代码可能导致什么问题？"
}
// ❌ fetchUser() 的实现不明确，无法判断是否有问题

✓ 正确示例（提供完整上下文）：
{
  "scenario": "fetchUser() 是一个使用 Retrofit 实现的 suspend 网络请求函数",
  "codeSnippet": "viewModelScope.launch { fetchUser() }",
  "question": "在上述条件下，这段代码可能导致什么问题？"
}
// ✅ 明确了 fetchUser() 的实现方式，答案明确

4. explanation 必须说明题目的前提假设，帮助学员理解答案的依据

【严格限制课程范围 - 重要】
1. 题目中出现的所有概念、API、语法必须在当前课程内容中明确讲解过
2. 如果课程只讲了 viewModelScope，就不能出现 lifecycleScope、GlobalScope 等未讲的内容
3. 选项中的干扰项也必须是课程中提到过的内容，不能用课程外的知识作为干扰项
4. 如果课程只讲了基础用法，不能出现高级用法（如课程讲 launch，不能问 async/await）

✗ 错误示例（超出课程范围）：
课程只讲了 viewModelScope.launch，但题目出现：
- "应该用 GlobalScope 还是 viewModelScope？" // ❌ GlobalScope 未在课程中讲解
- "这段代码缺少 withContext(Dispatchers.IO)" // ❌ withContext 未在课程中讲解

✓ 正确做法：
- 只考察课程明确讲解的知识点
- 干扰选项使用课程中提到的其他概念

【字段说明】
- scenario: 场景描述（可选，仅在真正需要额外背景时使用，大部分题目不需要）
- codeSnippet: 代码片段（可选，用于代码评估题）

请严格按照以下 JSON 格式返回（不要添加任何其他文字）：
{
  "questions": [
    {
      "id": "q1",
      "type": "single_choice",
      "question": "题目内容（应该包含所有必要信息，使scenario字段通常不必要）",
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
      "explanation": "答案解析",
      "codeSnippet": "// 仅在需要时添加代码\nval user = User()",
      "scenario": "仅在代码需要特定业务背景时添加"
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
      "question": "在协程中，使用 _____ 可以并行执行多个请求",
      "options": [],
      "correctIndex": -1,
      "correctAnswer": "async",
      "explanation": "答案解析"
    }
  ]
}

注意事项：
- single_choice: correctIndex 是正确答案的索引（0-3）
- multiple_choice: correctIndex 是正确答案索引的数组，如 [0, 2]
- true_false: options 固定为 ["正确", "错误"]，correctIndex 为 0 或 1
- fill_blank: correctIndex 为 -1，答案放在 correctAnswer 字段
- 所有题目必须包含 explanation 解析
- 题目要准确无误，避免知识性错误（如data class的copy()方法是自动生成的）
- scenario 字段尽量不使用，只在题目无法完整表达需求时才添加
- 只返回 JSON，不要有其他内容`

  try {
    let response: Response
    
    if (isDev) {
      // 开发环境：直接调用 AI API
      response = await fetch(`${DEV_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEV_API_KEY}`
        },
        body: JSON.stringify({
          model: DEV_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4000
        })
      })
    } else {
      // 生产环境：调用后端 API（Vercel Serverless Function）
      response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          maxTokens: 4000,
          temperature: 0.7,
          stream: false
        })
      })
    }

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
    
    // 转换为 QuizQuestion 对象数组并验证
    const questions = parsed.questions.map((q: {
      id: string
      type: QuestionType
      question: string
      options: string[]
      correctIndex: number | number[]
      correctAnswer?: string
      explanation: string
      codeSnippet?: string
      scenario?: string
    }) => new QuizQuestion(
      q.id,
      q.type || 'single_choice',
      q.question,
      q.options || [],
      q.correctIndex,
      q.correctAnswer,
      q.explanation,
      q.codeSnippet,
      q.scenario
    ))
    
    // 验证题目质量
    const validatedQuestions = questions.filter((q: QuizQuestion) => {
      const validation = validateQuestion(q)
      if (!validation.valid) {
        console.warn(`题目验证失败: ${q.question} - ${validation.issue}`)
        return false
      }
      return true
    })
    
    // 如果验证后题目数量不足，返回所有题目（避免没有题目）
    if (validatedQuestions.length < Math.max(2, questions.length * 0.5)) {
      console.warn('验证后题目数量不足，使用原始题目')
      return questions
    }
    
    return validatedQuestions
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

// 题目验证结果类型
export interface QuestionValidation {
  hasIssue: boolean
  issueType?: 'unclear' | 'wrong_answer' | 'out_of_scope' | 'bad_options'
  description?: string
}

/**
 * AI 验证题目是否有问题
 */
export async function aiValidateQuestion(
  question: QuizQuestion,
  lessonContent: string
): Promise<QuestionValidation> {
  const prompt = `你是一位严格的 Android 开发教学题目审核专家。请检查以下测验题目是否存在问题。

【课程内容】
${lessonContent}

【待检查的题目】
题型：${getQuestionTypeName(question.type)}
题目：${question.question}
${question.scenario ? `场景：${question.scenario}` : ''}
${question.codeSnippet ? `代码：${question.codeSnippet}` : ''}
选项：${question.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}
标注的正确答案：${question.type === 'fill_blank' ? question.correctAnswer : (
    Array.isArray(question.correctIndex)
      ? question.correctIndex.map(i => question.options[i]).join(', ')
      : question.options[question.correctIndex as number]
  )}
答案解析：${question.explanation}

【检查维度】
1. 表述清晰度：题目是否表述清晰完整？是否缺少必要的上下文信息？是否存在歧义？
2. 答案正确性：标注的正确答案是否确实正确？是否存在多个答案都可能正确的情况？
3. 课程范围：题目涉及的概念、API、语法是否都在课程内容中讲解过？
4. 选项设计：干扰项是否合理？选项之间是否有重复或包含关系？

【输出格式】
请严格按照以下 JSON 格式返回（不要添加任何其他文字）：
{
  "hasIssue": true/false,
  "issueType": "unclear" | "wrong_answer" | "out_of_scope" | "bad_options" | null,
  "description": "问题描述（如果有问题的话）"
}

- unclear：表述不清晰、缺少上下文、有歧义
- wrong_answer：答案错误或多个答案都正确
- out_of_scope：超出课程范围
- bad_options：选项设计不合理

如果题目没有问题，返回 {"hasIssue": false}`

  try {
    let response: Response

    if (isDev) {
      response = await fetch(`${DEV_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEV_API_KEY}`
        },
        body: JSON.stringify({
          model: DEV_MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.3
        })
      })
    } else {
      response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          maxTokens: 500,
          temperature: 0.3
        })
      })
    }

    if (!response.ok) {
      throw new Error('AI 请求失败')
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    // 解析 JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0])
      return {
        hasIssue: result.hasIssue === true,
        issueType: result.issueType || undefined,
        description: result.description || undefined
      }
    }

    return { hasIssue: false }
  } catch (error) {
    console.error('验证题目失败:', error)
    throw new Error('验证题目失败，请稍后重试')
  }
}

/**
 * 重新生成单道题目
 */
export async function regenerateSingleQuestion(
  originalQuestion: QuizQuestion,
  lessonTitle: string,
  lessonContent: string,
  issueDescription: string
): Promise<QuizQuestion> {
  const prompt = `你是一位 Android 开发教学专家。原题目存在问题，请重新生成一道题目。

【原题目的问题】
${issueDescription}

【原题目】
题型：${getQuestionTypeName(originalQuestion.type)}
题目：${originalQuestion.question}

【课程信息】
课程标题：${lessonTitle}
课程内容：${lessonContent}

【要求】
1. 保持相同的题型（${getQuestionTypeName(originalQuestion.type)}）
2. 考察相同或相近的知识点
3. 修复原题目的问题
4. 确保题目表述清晰、答案正确、在课程范围内

【输出格式】
请严格按照以下 JSON 格式返回（不要添加任何其他文字）：
{
  "id": "${originalQuestion.id}_regen",
  "type": "${originalQuestion.type}",
  "question": "新题目内容",
  "options": ["选项A", "选项B", "选项C", "选项D"],
  "correctIndex": 0,
  "explanation": "答案解析",
  "scenario": "场景描述（可选）",
  "codeSnippet": "代码片段（可选）"
}

注意：
- single_choice/true_false: correctIndex 是数字
- multiple_choice: correctIndex 是数组，如 [0, 2]
- fill_blank: correctIndex 为 -1，添加 "correctAnswer": "答案"
- true_false: options 固定为 ["正确", "错误"]`

  try {
    let response: Response

    if (isDev) {
      response = await fetch(`${DEV_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEV_API_KEY}`
        },
        body: JSON.stringify({
          model: DEV_MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7
        })
      })
    } else {
      response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          maxTokens: 1000,
          temperature: 0.7
        })
      })
    }

    if (!response.ok) {
      throw new Error('AI 请求失败')
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    // 解析 JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const q = JSON.parse(jsonMatch[0])
      return new QuizQuestion(
        q.id || `${originalQuestion.id}_regen`,
        q.type,
        q.question,
        q.options || [],
        q.correctIndex,
        q.correctAnswer,
        q.explanation || '',
        q.codeSnippet,
        q.scenario
      )
    }

    throw new Error('无法解析生成的题目')
  } catch (error) {
    console.error('重新生成题目失败:', error)
    throw new Error('重新生成题目失败，请稍后重试')
  }
}
