/**
 * 课程数据
 * 包含完整的学习路径、阶段、课程内容
 */

// 课程内容类型
export interface LessonContent {
  type: 'text' | 'code' | 'tip' | 'warning'
  content: string
  language?: string // 代码块的语言
}

// 课程类型
export interface Lesson {
  id: string
  title: string
  description: string
  duration: number // 预计分钟数
  contents: LessonContent[]
}

// 模块类型
export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

// 阶段类型
export interface Phase {
  id: string
  name: string
  description: string
  iconName: string
  colorType: 'green' | 'blue' | 'orange' | 'purple'
  modules: Module[]
}

/**
 * 完整课程数据
 * 
 * 设计理念：AI 辅助开发时代的学习路径
 * - 重点是"理解"而非"记忆语法"
 * - AI 会帮你写代码，但你需要能看懂、能审查、能调试
 * - 知道"为什么"比知道"怎么写"更重要
 */
export const courseData: Phase[] = [
  {
    id: 'phase-1',
    name: '基础入门',
    description: 'Kotlin 核心概念、项目结构、运行调试',
    iconName: 'Smartphone',
    colorType: 'green',
    modules: [
      {
        id: 'kotlin-basics',
        title: 'Kotlin 语言基础',
        lessons: [
          {
            id: 'kotlin-variables',
            title: '变量与数据类型',
            description: 'val/var、基本类型、使用场景、注意事项',
            duration: 20,
            contents: [
              {
                type: 'text',
                content: '## val 和 var：核心区别\n\nKotlin 有两种变量声明方式：'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'fun main() {\n    val name = "Android"    // val = 不可变\n    var count = 0           // var = 可变\n    \n    count = count + 1\n    println("name = $name")   // 输出: name = Android\n    println("count = $count") // 输出: count = 1\n    \n    // name = "iOS"  // 编译错误！val 不能重新赋值\n}'
              },
              {
                type: 'text',
                content: '## val vs var 使用场景\n\n| 场景 | 推荐 | 原因 |\n|-----|------|------|\n| 用户 ID | val | 登录后不变 |\n| 计数器 | var | 需要递增 |\n| 配置参数 | val | 读取后不变 |\n| 表单输入 | var | 用户会修改 |\n| API 响应 | val | 一次性数据 |\n| 页码索引 | var | 翻页时改变 |'
              },
              {
                type: 'tip',
                content: '原则：优先用 val，只有确实需要修改时才用 var。代码审查时看到不必要的 var 可以建议改成 val。'
              },
              {
                type: 'text',
                content: '## Int：整数\n\n**用在哪里**：ID、数量、索引、年龄等不需要小数的数值。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'fun main() {\n    val userId = 12345\n    val itemCount = 3\n    val age = 25\n    \n    println("用户ID: $userId")     // 输出: 用户ID: 12345\n    println("商品数量: $itemCount") // 输出: 商品数量: 3\n    println("年龄: $age")          // 输出: 年龄: 25\n    \n    // Int 范围: -2147483648 到 2147483647\n    println("Int最大值: ${Int.MAX_VALUE}") // 输出: Int最大值: 2147483647\n}'
              },
              {
                type: 'warning',
                content: '注意：Int 最大约 21 亿。如果数值可能超过（如时间戳、大型 ID），要用 Long。'
              },
              {
                type: 'text',
                content: '## Long：长整数\n\n**用在哪里**：时间戳、大型 ID、文件大小（字节数）等可能超过 21 亿的数值。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'fun main() {\n    val timestamp = 1706500000000L  // 注意 L 后缀！\n    val fileSize = 5368709120L     // 5GB 的字节数\n    val bigId = 9223372036854775807L\n    \n    println("时间戳: $timestamp")   // 输出: 时间戳: 1706500000000\n    println("文件大小: ${fileSize / 1024 / 1024 / 1024}GB") // 输出: 文件大小: 5GB\n    \n    // 常见用法：获取当前时间戳\n    val now = System.currentTimeMillis()\n    println("当前时间戳: $now")\n}'
              },
              {
                type: 'tip',
                content: '时间戳一定要用 Long！System.currentTimeMillis() 返回的就是 Long 类型。'
              },
              {
                type: 'text',
                content: '## Double 和 Float：小数\n\n**用在哪里**：价格、评分、百分比、坐标等需要小数的数值。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'fun main() {\n    val price = 99.99          // 默认是 Double\n    val rating = 4.5           // 评分\n    val percent = 0.75         // 75%\n    val latitude = 39.9042f    // Float 需要 f 后缀\n    \n    println("价格: ¥$price")    // 输出: 价格: ¥99.99\n    println("评分: $rating 星") // 输出: 评分: 4.5 星\n    println("进度: ${percent * 100}%") // 输出: 进度: 75.0%\n    \n    // Double 精度更高，一般用 Double\n    // Float 占用内存小，大量数据时可以考虑\n}'
              },
              {
                type: 'warning',
                content: '金额计算不要用 Float/Double！浮点数有精度问题。金额建议用分（Int）或 BigDecimal。'
              },
              {
                type: 'text',
                content: '## Boolean：布尔值\n\n**用在哪里**：开关状态、是否选中、是否登录等二选一的状态。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'fun main() {\n    val isLoggedIn = true\n    val isDarkMode = false\n    val hasPermission = true\n    \n    println("已登录: $isLoggedIn")     // 输出: 已登录: true\n    println("深色模式: $isDarkMode")   // 输出: 深色模式: false\n    \n    // 常见用法：条件判断\n    if (isLoggedIn) {\n        println("欢迎回来！")  // 输出: 欢迎回来！\n    }\n    \n    // 布尔运算\n    val canEdit = isLoggedIn && hasPermission\n    println("可以编辑: $canEdit")      // 输出: 可以编辑: true\n}'
              },
              {
                type: 'text',
                content: '## String：字符串\n\n**用在哪里**：名称、描述、URL、JSON 等文本内容。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'fun main() {\n    val name = "张三"\n    val url = "https://api.example.com"\n    \n    // 字符串模板（非常常用！）\n    val greeting = "你好，$name"\n    println(greeting)  // 输出: 你好，张三\n    \n    // 表达式用 ${}\n    val age = 25\n    val info = "明年 ${age + 1} 岁"\n    println(info)      // 输出: 明年 26 岁\n    \n    // 常用方法\n    println(name.length)           // 输出: 2\n    println(name.isEmpty())        // 输出: false\n    println("  hello  ".trim())    // 输出: hello\n    println("hello".uppercase())   // 输出: HELLO\n}'
              },
              {
                type: 'text',
                content: '## 类型转换\n\nKotlin 不会自动转换类型，需要显式调用转换方法。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'fun main() {\n    // 数字之间转换\n    val intVal = 42\n    val longVal = intVal.toLong()\n    val doubleVal = intVal.toDouble()\n    println("Int: $intVal, Long: $longVal, Double: $doubleVal")\n    // 输出: Int: 42, Long: 42, Double: 42.0\n    \n    // 字符串转数字（安全方式）\n    val str1 = "123"\n    val str2 = "abc"\n    \n    val num1 = str1.toIntOrNull()  // 成功返回 123\n    val num2 = str2.toIntOrNull()  // 失败返回 null\n    \n    println("num1: $num1")  // 输出: num1: 123\n    println("num2: $num2")  // 输出: num2: null\n    \n    // 提供默认值\n    val safeNum = str2.toIntOrNull() ?: 0\n    println("safeNum: $safeNum")  // 输出: safeNum: 0\n}'
              },
              {
                type: 'warning',
                content: '永远不要用 toInt() 转换用户输入！用 toIntOrNull() 配合 ?: 提供默认值，避免崩溃。'
              },
              {
                type: 'tip',
                content: '想要运行代码验证结果？点击导航栏的「在线测验」按钮，可以在弹窗中测试 Kotlin 代码。'
              }
            ]
          },
          {
            id: 'kotlin-functions',
            title: '函数与 Lambda',
            description: '函数定义、默认参数、Lambda 表达式、高阶函数',
            duration: 18,
            contents: [
              {
                type: 'text',
                content: '## 函数定义\n\n使用 fun 关键字定义函数。看函数时关注三点：输入什么、输出什么、做了什么。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 基本语法\nfun add(a: Int, b: Int): Int {\n    return a + b\n}\n\n// 单表达式函数 - 更简洁\nfun add(a: Int, b: Int) = a + b\n\n// 无返回值用 Unit（可省略）\nfun printMessage(msg: String) {\n    println(msg)\n}'
              },
              {
                type: 'text',
                content: '## 默认参数和命名参数\n\n这是 Kotlin 很实用的特性，AI 生成的代码经常用到：'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 默认参数\nfun greet(name: String = "用户", greeting: String = "你好") = "$greeting, $name!"\n\ngreet()                    // "你好, 用户!"\ngreet("张三")              // "你好, 张三!"\ngreet("张三", "早上好")    // "早上好, 张三!"\n\n// 命名参数 - 可以跳过某些参数\ngreet(greeting = "晚安")   // "晚安, 用户!"'
              },
              {
                type: 'text',
                content: '## Lambda 表达式\n\nLambda 是可以传递的代码块，在 Android 中大量使用。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// Lambda 基本语法: { 参数 -> 函数体 }\nval double = { x: Int -> x * 2 }\nprintln(double(5))  // 10\n\n// 多个参数\nval sum = { a: Int, b: Int -> a + b }\nprintln(sum(3, 4))  // 7\n\n// 无参数\nval sayHello = { println("Hello!") }\nsayHello()  // Hello!'
              },
              {
                type: 'tip',
                content: '当 Lambda 只有一个参数时，可以省略参数名，用 it 代替：{ x -> x * 2 } 等价于 { it * 2 }'
              },
              {
                type: 'text',
                content: '## Lambda 在 Android 中的应用\n\n这些场景你会经常遇到：'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 1. 按钮点击事件\nbutton.setOnClickListener { \n    showMessage("按钮被点击了")\n}\n\n// 2. 列表操作\nval numbers = listOf(1, 2, 3, 4, 5)\nnumbers.filter { it > 2 }     // [3, 4, 5]\nnumbers.map { it * 2 }        // [2, 4, 6, 8, 10]\nnumbers.forEach { print(it) } // 12345\n\n// 3. 网络请求回调\napi.getUser { user ->\n    // 数据返回后执行\n    updateUI(user)\n}'
              },
              {
                type: 'text',
                content: '## 高阶函数\n\n接收函数作为参数或返回函数的函数：'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 函数作为参数\nfun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {\n    return operation(a, b)\n}\n\ncalculate(5, 3, { x, y -> x + y })  // 8\ncalculate(5, 3) { x, y -> x * y }   // 15 （尾随 Lambda 语法）\n\n// 常用高阶函数\nlistOf(1, 2, 3).let { println(it) }    // let: 对对象执行操作\nuser?.also { saveToCache(it) }         // also: 执行附加操作\nlist.takeIf { it.isNotEmpty() }        // takeIf: 条件过滤'
              },
              {
                type: 'warning',
                content: '审查要点：Lambda 中的代码在特定时机执行（点击时、数据返回时）。确保 AI 生成的 Lambda 在正确时机做正确的事。'
              }
            ]
          },
          {
            id: 'kotlin-null-safety',
            title: '空安全（重点）',
            description: 'Kotlin 核心特性，?. / ?: / !! 操作符',
            duration: 15,
            contents: [
              {
                type: 'text',
                content: '## 为什么空安全是最重要的？\n\n**NullPointerException（空指针异常）** 是 App 崩溃的头号原因。Kotlin 从语言层面解决这个问题。\n\n审查 AI 代码时，空安全是最需要关注的点之一。'
              },
              {
                type: 'text',
                content: '## 可空 vs 非空\n\n| 类型 | 含义 | 示例 |\n|-----|------|------|\n| `String` | 一定有值，不可能是 null | `val name: String = "张三"` |\n| `String?` | 可能有值，也可能是 null | `val name: String? = null` |'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'val name: String = "Kotlin"  // 非空，一定有值\nval nickname: String? = null  // 可空，可能是 null\n\n// 非空类型不能赋值 null\n// name = null  // 编译错误！\n\n// 可空类型不能直接调用方法\n// nickname.length  // 编译错误！因为可能是 null'
              },
              {
                type: 'text',
                content: '## 安全处理可空类型\n\n| 操作符 | 作用 | 示例 |\n|-------|------|------|\n| `?.` | 安全调用，null 时返回 null | `name?.length` |\n| `?:` | Elvis 操作符，null 时用默认值 | `name ?: "默认"` |\n| `!!` | 强制断言非空（危险！） | `name!!.length` |'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'val name: String? = getUserName()  // 可能返回 null\n\n// 方式1: 安全调用\nval length = name?.length  // null 时返回 null，不崩溃\n\n// 方式2: 提供默认值（最常用）\nval displayName = name ?: "游客"  // null 时显示"游客"\n\n// 方式3: let 块 - null 时不执行\nname?.let { n ->\n    println("用户名: $n")\n    println("长度: ${n.length}")\n}\n\n// 方式4: 强制断言（除非 100% 确定不为 null，否则不要用！）\n// val len = name!!.length  // 如果 name 是 null，会崩溃！'
              },
              {
                type: 'warning',
                content: '**审查重点**：看到 `!!` 要警惕！除非有充分理由，否则应该用 `?.` 或 `?:` 替代。AI 有时会生成 `!!`，这是需要你修正的地方。'
              },
              {
                type: 'tip',
                content: '**常见模式**：`data?.let { /* 处理非空数据 */ } ?: run { /* 处理空数据情况 */ }`'
              }
            ]
          },
          {
            id: 'kotlin-classes',
            title: '类与对象',
            description: 'class、data class、object、sealed class',
            duration: 18,
            contents: [
              {
                type: 'text',
                content: '## 为什么需要了解类？\n\n几乎所有 Android 代码都围绕"类"组织。Activity 是类，Fragment 是类，ViewModel 是类。你需要能看懂类的结构。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 基本的类\nclass User(val name: String, var age: Int) {\n    // 方法\n    fun introduce() = "我是 $name，$age 岁"\n}\n\n// 使用\nval user = User("张三", 25)\nprintln(user.name)        // "张三"\nprintln(user.introduce()) // "我是 张三，25 岁"'
              },
              {
                type: 'text',
                content: '## data class：数据类（非常常用）\n\n用于存储数据的类。AI 生成的数据模型几乎都是 data class。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 定义数据类\ndata class User(\n    val id: Int,\n    val name: String,\n    val email: String\n)\n\n// 自动获得这些功能：\nval user1 = User(1, "张三", "zhangsan@example.com")\nval user2 = User(1, "张三", "zhangsan@example.com")\n\nprintln(user1 == user2)  // true（自动比较所有属性）\nprintln(user1)           // User(id=1, name=张三, email=...)\n\n// copy - 复制并修改部分属性\nval user3 = user1.copy(name = "李四")  // 只改名字'
              },
              {
                type: 'text',
                content: '## object：单例对象\n\n整个应用只有一个实例的对象。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// object - 单例\nobject AppConfig {\n    val apiUrl = "https://api.example.com"\n    var isDebug = false\n}\n\n// 直接使用，不需要创建实例\nprintln(AppConfig.apiUrl)\nAppConfig.isDebug = true\n\n// companion object - 类的伴生对象（类似静态成员）\nclass User(val name: String) {\n    companion object {\n        fun create(name: String) = User(name)\n    }\n}\n\nval user = User.create("张三")  // 不需要先创建 User 实例'
              },
              {
                type: 'text',
                content: '## sealed class：密封类\n\n用于表示有限的可能性，常用于状态管理。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 表示网络请求的状态\nsealed class Result<out T> {\n    data class Success<T>(val data: T) : Result<T>()\n    data class Error(val message: String) : Result<Nothing>()\n    object Loading : Result<Nothing>()\n}\n\n// 使用时必须处理所有情况\nfun handleResult(result: Result<User>) {\n    when (result) {\n        is Result.Loading -> showLoading()\n        is Result.Success -> showUser(result.data)\n        is Result.Error -> showError(result.message)\n    }\n}'
              },
              {
                type: 'tip',
                content: '**when + sealed class**：编译器会检查你是否处理了所有情况。这是 Kotlin 的强大之处，可以避免遗漏分支。'
          }
        ]
      },
      {
            id: 'kotlin-collections',
            title: '集合操作',
            description: 'List、Map、filter、map、链式调用',
            duration: 15,
            contents: [
              {
                type: 'text',
                content: '## 为什么集合很重要？\n\n应用中的数据通常是列表形式：用户列表、消息列表、商品列表... 你需要能看懂各种集合操作。'
              },
              {
                type: 'text',
                content: '## 常见集合类型\n\n| 类型 | 说明 | 创建方式 |\n|-----|------|----------|\n| `List` | 有序列表 | `listOf("a", "b", "c")` |\n| `MutableList` | 可修改的列表 | `mutableListOf("a", "b")` |\n| `Set` | 不重复的集合 | `setOf(1, 2, 3)` |\n| `Map` | 键值对 | `mapOf("name" to "张三")` |'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 创建列表\nval fruits = listOf("苹果", "香蕉", "橙子")  // 不可变\nval numbers = mutableListOf(1, 2, 3)         // 可变\n\n// 访问元素\nprintln(fruits[0])          // "苹果"\nprintln(fruits.first())     // "苹果"\nprintln(fruits.last())      // "橙子"\n\n// 修改可变列表\nnumbers.add(4)              // [1, 2, 3, 4]\nnumbers.remove(2)           // [1, 3, 4]\n\n// Map\nval user = mapOf(\n    "name" to "张三",\n    "age" to 25\n)\nprintln(user["name"])       // "张三"'
              },
              {
                type: 'text',
                content: '## 常用操作（必须认识）\n\n| 操作 | 作用 | 示例 |\n|-----|------|------|\n| `filter` | 过滤 | `list.filter { it > 0 }` |\n| `map` | 转换 | `list.map { it * 2 }` |\n| `find` | 查找第一个 | `list.find { it > 5 }` |\n| `any` | 是否有满足条件的 | `list.any { it > 10 }` |\n| `all` | 是否全部满足 | `list.all { it > 0 }` |\n| `sortedBy` | 排序 | `list.sortedBy { it.name }` |'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'data class User(val name: String, val age: Int)\n\nval users = listOf(\n    User("张三", 25),\n    User("李四", 30),\n    User("王五", 20)\n)\n\n// 过滤：找出年龄大于 22 的用户\nval adults = users.filter { it.age > 22 }\n// [User(张三, 25), User(李四, 30)]\n\n// 转换：提取所有用户名\nval names = users.map { it.name }\n// ["张三", "李四", "王五"]\n\n// 查找：找第一个年龄大于 25 的\nval found = users.find { it.age > 25 }\n// User(李四, 30)\n\n// 排序：按年龄排序\nval sorted = users.sortedBy { it.age }\n// [王五(20), 张三(25), 李四(30)]\n\n// 链式调用 - 非常常见\nval result = users\n    .filter { it.age >= 20 }\n    .sortedBy { it.age }\n    .map { it.name }\n// ["王五", "张三", "李四"]'
              },
              {
                type: 'tip',
                content: '**链式调用**是 Kotlin 的特色。AI 经常生成这样的代码，你需要能一行行读懂每一步在做什么。'
              }
            ]
          },
          {
            id: 'kotlin-coroutines',
            title: '协程入门（重点）',
            description: 'suspend、launch、async、Flow、异步编程',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## 为什么需要协程？\n\n网络请求、数据库读写都是"耗时操作"。如果在主线程执行，应用会卡住甚至崩溃。协程让你能优雅地处理这些操作。'
              },
              {
                type: 'warning',
                content: 'Android 铁律：不能在主线程（UI 线程）执行耗时操作！否则应用会 ANR（无响应）。'
              },
              {
                type: 'text',
                content: '## 传统回调 vs 协程\n\n传统方式容易形成"回调地狱"，协程让异步代码像同步代码一样清晰：'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 传统方式：回调嵌套，越来越深\ngetUser { user ->\n    getOrders(user.id) { orders ->\n        getOrderDetails(orders[0].id) { details ->\n            // 嵌套地狱...\n        }\n    }\n}\n\n// 协程方式：像写同步代码一样清晰\nsuspend fun loadData() {\n    val user = getUser()                    // 等待\n    val orders = getOrders(user.id)         // 等待\n    val details = getOrderDetails(orders[0].id)\n    // 顺序执行，代码清晰\n}'
              },
              {
                type: 'text',
                content: '## 核心概念\n\n| 关键字 | 作用 |\n|-------|------|\n| `suspend` | 标记可挂起的函数，只能在协程中调用 |\n| `launch` | 启动协程，不返回结果 |\n| `async` | 启动协程，返回 Deferred（可获取结果） |\n| `await` | 等待 async 的结果 |\n| `viewModelScope` | ViewModel 的协程作用域，自动管理生命周期 |'
              },
              {
                type: 'text',
                content: '## suspend 函数\n\nsuspend 标记的函数可以"暂停"执行，等待耗时操作完成后继续：'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 定义 suspend 函数\nsuspend fun fetchUser(): User {\n    delay(1000)  // 模拟网络延迟，不会阻塞线程\n    return User("张三", 25)\n}\n\n// suspend 函数只能在协程中调用\n// fetchUser()  // 编译错误！不能在普通函数中调用'
              },
              {
                type: 'text',
                content: '## 启动协程：launch\n\nlaunch 用于启动一个不需要返回值的协程：'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'class UserViewModel : ViewModel() {\n    private val _user = MutableStateFlow<User?>(null)\n    val user: StateFlow<User?> = _user\n    \n    fun loadUser() {\n        // viewModelScope 在 ViewModel 销毁时自动取消\n        viewModelScope.launch {\n            try {\n                val result = fetchUser()  // 等待结果\n                _user.value = result\n            } catch (e: Exception) {\n                // 处理错误\n                Log.e("Error", e.message ?: "Unknown error")\n            }\n        }\n    }\n}'
              },
              {
                type: 'text',
                content: '## 并发请求：async/await\n\n需要同时发起多个请求并等待全部完成时使用：'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'viewModelScope.launch {\n    // 同时发起两个请求\n    val userDeferred = async { fetchUser() }\n    val ordersDeferred = async { fetchOrders() }\n    \n    // 等待两个请求都完成\n    val user = userDeferred.await()\n    val orders = ordersDeferred.await()\n    \n    // 并行执行，总时间 ≈ max(两个请求时间)\n    updateUI(user, orders)\n}'
              },
              {
                type: 'text',
                content: '## Flow：数据流\n\nFlow 用于持续观察数据变化（如实时消息、股票价格）：'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 创建 Flow\nfun getMessages(): Flow<Message> = flow {\n    while (true) {\n        val message = fetchLatestMessage()\n        emit(message)  // 发送数据\n        delay(1000)    // 每秒检查一次\n    }\n}\n\n// 收集 Flow 数据\nviewModelScope.launch {\n    getMessages().collect { message ->\n        // 每次有新消息时执行\n        _messages.value = _messages.value + message\n    }\n}'
              },
              {
                type: 'text',
                content: '## StateFlow：状态管理\n\n在 ViewModel 中管理 UI 状态的推荐方式：'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'class CounterViewModel : ViewModel() {\n    // 私有可变状态\n    private val _count = MutableStateFlow(0)\n    // 公开只读状态\n    val count: StateFlow<Int> = _count.asStateFlow()\n    \n    fun increment() {\n        _count.value++\n    }\n}\n\n// 在 Compose 中观察\n@Composable\nfun CounterScreen(viewModel: CounterViewModel) {\n    val count by viewModel.count.collectAsState()\n    Text("Count: $count")\n}'
              },
              {
                type: 'tip',
                content: '审查要点：1. 网络/数据库操作必须在协程中 2. 检查是否正确处理异常 3. 确保使用正确的 scope（如 viewModelScope）'
              }
            ]
              }
            ]
          },
          {
        id: 'android-env',
        title: '开发与测试环境',
        lessons: [
          {
            id: 'dev-workflow',
            title: 'AI 辅助开发流程',
            description: 'Cursor 写代码 + Android Studio 测试',
            duration: 10,
            contents: [
              {
                type: 'text',
                content: '## 现代 Android 开发工作流\n\n在 AI 时代，开发流程发生了变化：\n\n| 工具 | 用途 |\n|-----|------|\n| **Cursor** | 写代码、AI 对话、快速迭代 |\n| **Android Studio** | 运行测试、查看效果、调试问题 |'
              },
              {
                type: 'tip',
                content: '你不需要精通 Android Studio 的所有功能，只需要会：**运行应用、查看日志、连接设备**。'
              },
              {
                type: 'text',
                content: '## 基本工作流程\n\n1. 在 Cursor 中描述需求，让 AI 生成代码\n2. 审查 AI 生成的代码，确认逻辑正确\n3. 在 Android Studio 中运行，测试效果\n4. 发现问题后回到 Cursor，描述问题让 AI 修复\n5. 重复直到功能完成'
              },
              {
                type: 'text',
                content: '## 与 AI 协作的技巧\n\n**描述需求时要具体**：\n- ❌ "写一个登录页面"\n- ✅ "用 Jetpack Compose 写一个登录页面，包含邮箱输入框、密码输入框、登录按钮，使用 MVVM 架构"\n\n**发现问题时提供上下文**：\n- ❌ "代码不工作"\n- ✅ "点击登录按钮后没有反应，Logcat 显示 NetworkOnMainThreadException"'
              },
              {
                type: 'warning',
                content: '**AI 不是万能的**：它可能生成过时的 API、有安全隐患的代码、或者效率低下的实现。你的审查能力决定了最终代码质量。'
              }
            ]
          },
          {
            id: 'android-studio-basics',
            title: 'Android Studio 必备操作',
            description: '运行应用、Logcat 日志、设备连接',
            duration: 15,
            contents: [
              {
                type: 'text',
                content: '## 安装 Android Studio\n\n访问 [developer.android.com/studio](https://developer.android.com/studio) 下载。\n\n**系统要求**：8GB RAM（推荐 16GB），至少 8GB 硬盘空间。\n\n首次运行会下载 SDK，可能需要较长时间。'
              },
              {
                type: 'text',
                content: '## 必须会的 3 件事\n\n### 1. 运行应用\n点击工具栏的 **▶ 按钮**（或 `Shift + F10`）\n\n### 2. 查看日志（Logcat）\n`View > Tool Windows > Logcat`\n- 筛选你的应用：选择你的包名\n- 搜索关键词：如 "Error"、"Exception"\n\n### 3. 连接设备\n- **模拟器**：`Tools > Device Manager > Create Device`\n- **真机**：开启 USB 调试，连接电脑'
              },
              {
                type: 'tip',
                content: '**强烈推荐用真机测试**：比模拟器快、更真实。任何 Android 手机都可以，开启开发者选项即可。'
              },
              {
                type: 'text',
                content: '## 开启真机调试\n\n1. 进入**设置 > 关于手机**\n2. 连续点击**版本号** 7 次，开启开发者模式\n3. 返回设置，进入**开发者选项**\n4. 开启 **USB 调试**\n5. 用 USB 线连接电脑\n6. 手机上点击"允许调试"'
              },
              {
                type: 'text',
                content: '## 常见问题排查\n\n| 问题 | 解决方案 |\n|-----|----------|\n| 找不到设备 | 检查 USB 线、尝试换接口、重启 adb |\n| 编译失败 | 查看 Build 窗口的错误信息 |\n| 应用闪退 | 查看 Logcat 中的 Exception |'
              }
            ]
          },
          {
            id: 'project-structure',
            title: '项目结构解读',
            description: '目录结构、Manifest、build.gradle',
            duration: 12,
            contents: [
              {
                type: 'text',
                content: '## 为什么要了解项目结构？\n\n当 AI 生成代码时，你需要知道：\n- 这段代码应该放在哪个文件\n- 资源文件（图片、字符串）在哪里\n- 配置文件在哪里'
              },
              {
                type: 'code',
                language: 'text',
                content: 'app/\n├── src/main/\n│   ├── java/                    # Kotlin/Java 代码\n│   │   └── com/example/app/\n│   │       ├── ui/              # 界面相关\n│   │       ├── data/            # 数据层\n│   │       └── MainActivity.kt\n│   ├── res/                     # 资源文件\n│   │   ├── layout/              # XML 布局文件\n│   │   ├── values/              # 字符串、颜色、尺寸\n│   │   ├── drawable/            # 图片、图标\n│   │   └── mipmap/              # 应用图标\n│   └── AndroidManifest.xml      # 应用配置（权限、组件声明）\n├── build.gradle.kts             # 模块构建配置（依赖）\n└── ...'
              },
              {
                type: 'text',
                content: '## 关键文件说明\n\n| 文件 | 作用 | 你需要了解的 |\n|-----|------|------------|\n| `AndroidManifest.xml` | 应用配置 | 声明权限、Activity、Service |\n| `build.gradle.kts` | 构建配置 | 添加依赖库 |\n| `res/values/strings.xml` | 字符串资源 | 多语言支持 |\n| `res/values/colors.xml` | 颜色定义 | 主题颜色 |'
              },
              {
                type: 'code',
                language: 'xml',
                content: '<!-- AndroidManifest.xml 示例 -->\n<manifest xmlns:android="http://schemas.android.com/apk/res/android">\n    \n    <!-- 权限声明 -->\n    <uses-permission android:name="android.permission.INTERNET" />\n    \n    <application\n        android:name=".MyApplication"\n        android:label="@string/app_name"\n        android:icon="@mipmap/ic_launcher"\n        android:theme="@style/Theme.MyApp">\n        \n        <!-- Activity 声明 -->\n        <activity android:name=".MainActivity"\n            android:exported="true">\n            <intent-filter>\n                <action android:name="android.intent.action.MAIN" />\n                <category android:name="android.intent.category.LAUNCHER" />\n            </intent-filter>\n        </activity>\n        \n    </application>\n</manifest>'
              },
              {
                type: 'tip',
                content: '**让 AI 帮你配置**：当需要添加权限、依赖时，直接告诉 AI："我需要使用相机，帮我配置权限"。但你要能看懂它在 Manifest 和 build.gradle 中添加了什么。'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'phase-2',
    name: '核心组件',
    description: 'Activity、Fragment、UI 开发',
    iconName: 'Puzzle',
    colorType: 'blue',
    modules: [
      {
        id: 'activity',
        title: 'Activity',
        lessons: [
          {
            id: 'activity-intro',
            title: 'Activity 概述',
            description: '了解 Activity 是什么，它在 Android 中的作用',
            duration: 15,
            contents: [
              {
                type: 'text',
                content: '## 什么是 Activity？\n\nActivity 是 Android 应用的核心组件，代表一个"屏幕"或"页面"。用户与应用的交互基本上都发生在 Activity 中。'
              },
              {
                type: 'text',
                content: '## Activity 的职责\n\n1. **显示 UI** - 加载和显示布局\n2. **处理用户交互** - 响应点击、输入等事件\n3. **管理生命周期** - 处理创建、暂停、恢复、销毁\n4. **与其他组件通信** - 启动其他 Activity、接收结果'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 一个基本的 Activity\nclass MainActivity : AppCompatActivity() {\n    \n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        // 设置布局\n        setContentView(R.layout.activity_main)\n        \n        // 初始化视图和数据\n        setupUI()\n    }\n    \n    private fun setupUI() {\n        // 查找视图并设置事件\n        val button = findViewById<Button>(R.id.myButton)\n        button.setOnClickListener {\n            Toast.makeText(this, "点击了按钮", Toast.LENGTH_SHORT).show()\n        }\n    }\n}'
              }
            ]
          },
          {
            id: 'activity-lifecycle',
            title: '生命周期',
            description: '掌握 Activity 生命周期的各个阶段',
            duration: 30,
            contents: [
              {
                type: 'text',
                content: '## 为什么需要生命周期？\n\n用户可能随时切换应用、旋转屏幕、接电话。Android 系统会在这些情况下回调不同的生命周期方法，让你有机会保存数据、释放资源。'
              },
              {
                type: 'text',
                content: '## 生命周期方法\n\n按调用顺序：\n\n1. **onCreate()** - Activity 被创建，初始化 UI\n2. **onStart()** - Activity 即将可见\n3. **onResume()** - Activity 可交互，进入前台\n4. **onPause()** - 正在失去焦点（如弹出对话框）\n5. **onStop()** - 完全不可见\n6. **onDestroy()** - Activity 即将销毁'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'class MainActivity : AppCompatActivity() {\n    \n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        setContentView(R.layout.activity_main)\n        // 初始化：设置布局、绑定数据\n    }\n    \n    override fun onStart() {\n        super.onStart()\n        // 准备显示：注册广播接收器等\n    }\n    \n    override fun onResume() {\n        super.onResume()\n        // 开始交互：启动动画、开始播放视频\n    }\n    \n    override fun onPause() {\n        super.onPause()\n        // 暂停：保存草稿、暂停视频\n    }\n    \n    override fun onStop() {\n        super.onStop()\n        // 停止：释放资源、取消网络请求\n    }\n    \n    override fun onDestroy() {\n        super.onDestroy()\n        // 销毁：最后的清理工作\n    }\n}'
              },
              {
                type: 'tip',
                content: '不需要重写所有方法！根据实际需求选择。最常用的是 onCreate()（初始化）和 onDestroy()（清理）。'
              },
              {
                type: 'warning',
                content: '重要：一定要调用 super 的对应方法！否则会崩溃。'
              }
            ]
          },
          {
            id: 'activity-intent',
            title: 'Intent 与页面跳转',
            description: '使用 Intent 在 Activity 之间传递数据',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## 什么是 Intent？\n\nIntent 是 Android 中用于组件间通信的"信使"。最常用的场景是启动另一个 Activity 并传递数据。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 启动另一个 Activity\nclass MainActivity : AppCompatActivity() {\n    \n    private fun goToDetail() {\n        // 创建 Intent\n        val intent = Intent(this, DetailActivity::class.java)\n        \n        // 传递数据\n        intent.putExtra("user_name", "张三")\n        intent.putExtra("user_age", 25)\n        \n        // 启动\n        startActivity(intent)\n    }\n}'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 在目标 Activity 中接收数据\nclass DetailActivity : AppCompatActivity() {\n    \n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        setContentView(R.layout.activity_detail)\n        \n        // 获取传递的数据\n        val name = intent.getStringExtra("user_name") ?: "未知"\n        val age = intent.getIntExtra("user_age", 0)\n        \n        // 使用数据\n        textView.text = "姓名: $name, 年龄: $age"\n    }\n}'
              },
              {
                type: 'tip',
                content: '使用常量定义 key 值，避免拼写错误：\ncompanion object { const val EXTRA_USER_NAME = "user_name" }'
              }
            ]
          }
        ]
      },
      {
        id: 'fragment',
        title: 'Fragment',
        lessons: [
          {
            id: 'fragment-intro',
            title: 'Fragment 概述',
            description: 'Fragment 是什么、为什么需要它',
            duration: 15,
            contents: [
              {
                type: 'text',
                content: '## 什么是 Fragment？\n\nFragment 是可重用的 UI 模块，可以理解为"Activity 中的小 Activity"。一个 Activity 可以包含多个 Fragment。'
              },
              {
                type: 'text',
                content: '## 为什么需要 Fragment？\n\n| 场景 | 说明 |\n|-----|------|\n| 模块化 UI | 把复杂页面拆分成独立模块 |\n| 适配平板 | 手机显示一个 Fragment，平板同时显示多个 |\n| 底部导航 | 每个 Tab 对应一个 Fragment |\n| ViewPager | 滑动切换的页面通常是 Fragment |'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 基本的 Fragment\nclass HomeFragment : Fragment() {\n    \n    override fun onCreateView(\n        inflater: LayoutInflater,\n        container: ViewGroup?,\n        savedInstanceState: Bundle?\n    ): View? {\n        // 加载布局\n        return inflater.inflate(R.layout.fragment_home, container, false)\n    }\n    \n    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {\n        super.onViewCreated(view, savedInstanceState)\n        // 初始化视图\n        val button = view.findViewById<Button>(R.id.myButton)\n        button.setOnClickListener {\n            // 处理点击\n        }\n    }\n}'
              },
              {
                type: 'tip',
                content: 'Fragment 有自己的生命周期，但依附于 Activity。Activity 销毁时，其中的 Fragment 也会销毁。'
              }
            ]
          },
          {
            id: 'fragment-lifecycle',
            title: 'Fragment 生命周期',
            description: '了解 Fragment 的生命周期方法',
            duration: 20,
            contents: [
              {
                type: 'text',
                content: '## Fragment 生命周期\n\nFragment 的生命周期比 Activity 更复杂，因为它还涉及视图的创建和销毁：'
              },
              {
                type: 'text',
                content: '## 主要生命周期方法\n\n| 方法 | 时机 | 常见用途 |\n|-----|------|----------|\n| `onAttach()` | 附加到 Activity | 获取 Activity 引用 |\n| `onCreate()` | Fragment 创建 | 初始化非 UI 数据 |\n| `onCreateView()` | 创建视图 | 加载布局 |\n| `onViewCreated()` | 视图创建完成 | 初始化 UI 组件 |\n| `onStart()` | 即将可见 | - |\n| `onResume()` | 可交互 | 开始动画等 |\n| `onPause()` | 失去焦点 | 暂停操作 |\n| `onStop()` | 不可见 | - |\n| `onDestroyView()` | 销毁视图 | 清理视图相关资源 |\n| `onDestroy()` | Fragment 销毁 | 最终清理 |\n| `onDetach()` | 从 Activity 分离 | - |'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'class MyFragment : Fragment() {\n    \n    private var _binding: FragmentMyBinding? = null\n    private val binding get() = _binding!!\n    \n    override fun onCreateView(\n        inflater: LayoutInflater,\n        container: ViewGroup?,\n        savedInstanceState: Bundle?\n    ): View {\n        _binding = FragmentMyBinding.inflate(inflater, container, false)\n        return binding.root\n    }\n    \n    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {\n        super.onViewCreated(view, savedInstanceState)\n        // 在这里初始化 UI\n        binding.button.setOnClickListener { /* ... */ }\n    }\n    \n    override fun onDestroyView() {\n        super.onDestroyView()\n        // 重要：避免内存泄漏\n        _binding = null\n    }\n}'
              },
              {
                type: 'warning',
                content: '使用 ViewBinding 时，必须在 onDestroyView() 中将 binding 置为 null，否则会内存泄漏！'
              }
            ]
          },
          {
            id: 'fragment-communication',
            title: 'Fragment 通信',
            description: 'Fragment 与 Activity、Fragment 之间的通信',
            duration: 20,
            contents: [
              {
                type: 'text',
                content: '## Fragment 通信方式\n\n| 方式 | 场景 | 推荐程度 |\n|-----|------|----------|\n| ViewModel | Fragment 之间共享数据 | ⭐⭐⭐ 推荐 |\n| Fragment Result API | 返回结果给上一个 Fragment | ⭐⭐⭐ 推荐 |\n| 接口回调 | Fragment 通知 Activity | ⭐⭐ 可用 |\n| 直接引用 | 不推荐 | ❌ 避免 |'
              },
              {
                type: 'text',
                content: '## 通过 ViewModel 共享数据（推荐）'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 共享的 ViewModel\nclass SharedViewModel : ViewModel() {\n    private val _selectedItem = MutableLiveData<Item>()\n    val selectedItem: LiveData<Item> = _selectedItem\n    \n    fun selectItem(item: Item) {\n        _selectedItem.value = item\n    }\n}\n\n// Fragment A - 发送数据\nclass ListFragment : Fragment() {\n    // 使用 activityViewModels 共享 ViewModel\n    private val sharedViewModel: SharedViewModel by activityViewModels()\n    \n    private fun onItemClick(item: Item) {\n        sharedViewModel.selectItem(item)\n    }\n}\n\n// Fragment B - 接收数据\nclass DetailFragment : Fragment() {\n    private val sharedViewModel: SharedViewModel by activityViewModels()\n    \n    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {\n        super.onViewCreated(view, savedInstanceState)\n        sharedViewModel.selectedItem.observe(viewLifecycleOwner) { item ->\n            // 显示详情\n            binding.title.text = item.title\n        }\n    }\n}'
              },
              {
                type: 'text',
                content: '## Fragment Result API'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// Fragment A - 监听结果\nclass FragmentA : Fragment() {\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        // 设置结果监听\n        setFragmentResultListener("requestKey") { key, bundle ->\n            val result = bundle.getString("resultKey")\n            // 处理结果\n        }\n    }\n}\n\n// Fragment B - 返回结果\nclass FragmentB : Fragment() {\n    private fun sendResult() {\n        setFragmentResult("requestKey", bundleOf("resultKey" to "Hello"))\n        // 返回上一个 Fragment\n        findNavController().popBackStack()\n    }\n}'
              },
              {
                type: 'tip',
                content: '优先使用 ViewModel 共享数据，它更符合 MVVM 架构，也更容易测试。'
              }
            ]
          }
        ]
      },
      {
        id: 'ui-basics',
        title: 'UI 开发基础',
        lessons: [
          {
            id: 'layout-basics',
            title: '布局基础',
            description: 'LinearLayout、ConstraintLayout、常用属性',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## Android 布局系统\n\n传统 Android 使用 XML 文件定义 UI 布局，文件放在 res/layout/ 目录下。'
              },
              {
                type: 'text',
                content: '## 常用布局类型\n\n| 布局 | 特点 | 使用场景 |\n|-----|------|----------|\n| LinearLayout | 线性排列（水平/垂直） | 简单列表、表单 |\n| ConstraintLayout | 约束定位，性能好 | 复杂布局（推荐） |\n| FrameLayout | 层叠布局 | 单一子元素、叠加效果 |\n| ScrollView | 可滚动 | 内容超出屏幕时 |'
              },
              {
                type: 'code',
                language: 'xml',
                content: '<!-- LinearLayout 示例 -->\n<LinearLayout\n    android:layout_width="match_parent"\n    android:layout_height="wrap_content"\n    android:orientation="vertical"\n    android:padding="16dp">\n    \n    <TextView\n        android:layout_width="wrap_content"\n        android:layout_height="wrap_content"\n        android:text="标题"\n        android:textSize="24sp"\n        android:textColor="@color/black" />\n    \n    <Button\n        android:id="@+id/myButton"\n        android:layout_width="match_parent"\n        android:layout_height="wrap_content"\n        android:text="点击我" />\n        \n</LinearLayout>'
              },
              {
                type: 'text',
                content: '## 常用尺寸单位\n\n| 单位 | 用途 | 说明 |\n|-----|------|------|\n| dp | 布局尺寸 | 密度无关像素，自动适配不同屏幕 |\n| sp | 文字大小 | 可缩放像素，跟随系统字体设置 |\n| match_parent | 宽高 | 填满父容器 |\n| wrap_content | 宽高 | 包裹内容 |'
              },
              {
                type: 'tip',
                content: '现代 Android 开发推荐使用 Jetpack Compose，但了解 XML 布局仍然重要，很多现有项目还在使用。'
              }
            ]
          },
          {
            id: 'jetpack-compose-intro',
            title: 'Jetpack Compose 基础',
            description: '现代声明式 UI 框架入门',
            duration: 30,
            contents: [
              {
                type: 'text',
                content: '## 什么是 Jetpack Compose？\n\nCompose 是 Android 现代 UI 框架，用 Kotlin 代码构建 UI，不需要 XML。'
              },
              {
                type: 'text',
                content: '## Compose vs XML\n\n| 对比 | Compose | XML |\n|-----|---------|-----|\n| 语言 | Kotlin | XML + Kotlin |\n| 风格 | 声明式 | 命令式 |\n| 代码量 | 少 | 多 |\n| 预览 | 实时 | 需要编译 |\n| 学习曲线 | 中等 | 较低 |'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 基本的 Composable 函数\n@Composable\nfun Greeting(name: String) {\n    Text(text = "Hello, $name!")\n}\n\n// 带样式的组件\n@Composable\nfun StyledGreeting(name: String) {\n    Text(\n        text = "Hello, $name!",\n        fontSize = 24.sp,\n        fontWeight = FontWeight.Bold,\n        color = Color.Blue,\n        modifier = Modifier.padding(16.dp)\n    )\n}'
              },
              {
                type: 'text',
                content: '## 常用布局组件'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// Column - 垂直排列（类似 LinearLayout vertical）\nColumn {\n    Text("第一行")\n    Text("第二行")\n    Text("第三行")\n}\n\n// Row - 水平排列（类似 LinearLayout horizontal）\nRow {\n    Text("左")\n    Spacer(modifier = Modifier.weight(1f))\n    Text("右")\n}\n\n// Box - 层叠布局（类似 FrameLayout）\nBox {\n    Image(painter = painterResource(R.drawable.bg), contentDescription = null)\n    Text("叠加的文字", modifier = Modifier.align(Alignment.Center))\n}'
              },
              {
                type: 'text',
                content: '## Modifier：样式和布局'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '@Composable\nfun ModifierExample() {\n    Box(\n        modifier = Modifier\n            .fillMaxWidth()           // 宽度填满\n            .height(200.dp)           // 固定高度\n            .padding(16.dp)           // 内边距\n            .background(Color.Gray)   // 背景色\n            .clickable { /* 点击 */ } // 可点击\n    ) {\n        Text(\n            text = "内容",\n            modifier = Modifier.align(Alignment.Center)\n        )\n    }\n}'
              },
              {
                type: 'tip',
                content: 'Modifier 的顺序很重要！padding 在 background 前后效果不同。'
              }
            ]
          },
          {
            id: 'compose-state',
            title: 'Compose 状态管理',
            description: 'remember、mutableStateOf、状态提升',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## Compose 中的状态\n\nCompose 是声明式 UI：UI = f(State)。状态变化时，UI 自动更新。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 基本状态用法\n@Composable\nfun Counter() {\n    // remember: 在重组时保持状态\n    // mutableStateOf: 创建可观察的状态\n    var count by remember { mutableStateOf(0) }\n    \n    Column {\n        Text("Count: $count")\n        Button(onClick = { count++ }) {\n            Text("增加")\n        }\n    }\n}'
              },
              {
                type: 'text',
                content: '## 状态提升（State Hoisting）\n\n把状态提升到父组件，让子组件成为"无状态"的，更容易复用和测试。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 无状态的子组件（推荐）\n@Composable\nfun CounterDisplay(\n    count: Int,\n    onIncrement: () -> Unit\n) {\n    Column {\n        Text("Count: $count")\n        Button(onClick = onIncrement) {\n            Text("增加")\n        }\n    }\n}\n\n// 有状态的父组件\n@Composable\nfun CounterScreen() {\n    var count by remember { mutableStateOf(0) }\n    \n    CounterDisplay(\n        count = count,\n        onIncrement = { count++ }\n    )\n}'
              },
              {
                type: 'text',
                content: '## 与 ViewModel 配合'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// ViewModel\nclass CounterViewModel : ViewModel() {\n    private val _count = MutableStateFlow(0)\n    val count: StateFlow<Int> = _count.asStateFlow()\n    \n    fun increment() {\n        _count.value++\n    }\n}\n\n// Composable\n@Composable\nfun CounterScreen(viewModel: CounterViewModel = viewModel()) {\n    // collectAsState: 将 Flow 转换为 Compose State\n    val count by viewModel.count.collectAsState()\n    \n    CounterDisplay(\n        count = count,\n        onIncrement = { viewModel.increment() }\n    )\n}'
              },
              {
                type: 'tip',
                content: '生产环境推荐：UI 状态放 ViewModel，用 StateFlow；Compose 用 collectAsState() 观察。'
              }
            ]
          },
          {
            id: 'list-display',
            title: '列表展示',
            description: 'LazyColumn、LazyRow、RecyclerView',
            duration: 30,
            contents: [
              {
                type: 'text',
                content: '## 列表是最常用的 UI 模式\n\n用户列表、消息列表、商品列表... 几乎每个应用都需要列表。'
              },
              {
                type: 'text',
                content: '## Compose 方式：LazyColumn/LazyRow\n\nLazy 组件只渲染可见项，性能优秀。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 基本列表\n@Composable\nfun UserList(users: List<User>) {\n    LazyColumn {\n        items(users) { user ->\n            UserItem(user)\n        }\n    }\n}\n\n// 带索引的列表\n@Composable\nfun NumberedList(items: List<String>) {\n    LazyColumn {\n        itemsIndexed(items) { index, item ->\n            Text("${index + 1}. $item")\n        }\n    }\n}\n\n// 混合内容\n@Composable\nfun MixedList(users: List<User>) {\n    LazyColumn {\n        // 头部\n        item {\n            Text("用户列表", style = MaterialTheme.typography.h6)\n        }\n        // 列表项\n        items(users) { user ->\n            UserItem(user)\n        }\n        // 尾部\n        item {\n            Text("共 ${users.size} 人")\n        }\n    }\n}'
              },
              {
                type: 'text',
                content: '## 列表项组件'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '@Composable\nfun UserItem(\n    user: User,\n    onClick: () -> Unit = {}\n) {\n    Row(\n        modifier = Modifier\n            .fillMaxWidth()\n            .clickable { onClick() }\n            .padding(16.dp),\n        verticalAlignment = Alignment.CenterVertically\n    ) {\n        // 头像\n        AsyncImage(\n            model = user.avatarUrl,\n            contentDescription = "头像",\n            modifier = Modifier\n                .size(48.dp)\n                .clip(CircleShape)\n        )\n        Spacer(modifier = Modifier.width(12.dp))\n        // 信息\n        Column {\n            Text(user.name, fontWeight = FontWeight.Bold)\n            Text(user.email, color = Color.Gray, fontSize = 14.sp)\n        }\n    }\n}'
              },
              {
                type: 'text',
                content: '## 传统方式：RecyclerView\n\n如果使用 XML 布局，需要 RecyclerView + Adapter。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// Adapter\nclass UserAdapter(private val users: List<User>) :\n    RecyclerView.Adapter<UserAdapter.ViewHolder>() {\n    \n    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {\n        val nameText: TextView = view.findViewById(R.id.nameText)\n        val emailText: TextView = view.findViewById(R.id.emailText)\n    }\n    \n    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {\n        val view = LayoutInflater.from(parent.context)\n            .inflate(R.layout.item_user, parent, false)\n        return ViewHolder(view)\n    }\n    \n    override fun onBindViewHolder(holder: ViewHolder, position: Int) {\n        val user = users[position]\n        holder.nameText.text = user.name\n        holder.emailText.text = user.email\n    }\n    \n    override fun getItemCount() = users.size\n}\n\n// 使用\nrecyclerView.layoutManager = LinearLayoutManager(context)\nrecyclerView.adapter = UserAdapter(users)'
              },
              {
                type: 'tip',
                content: '新项目强烈推荐 Compose 的 LazyColumn，代码量少、更直观。RecyclerView 代码量大但在老项目中很常见。'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'phase-3',
    name: '数据与网络',
    description: '本地存储、网络请求、图片加载',
    iconName: 'Globe',
    colorType: 'orange',
    modules: [
      {
        id: 'local-storage',
        title: '本地存储',
        lessons: [
          {
            id: 'shared-prefs',
            title: 'SharedPreferences',
            description: '轻量级键值对存储，适合配置项',
            duration: 15,
            contents: [
              {
                type: 'text',
                content: '## SharedPreferences 是什么？\n\n轻量级键值对存储，适合保存简单的配置数据：用户设置、登录状态、主题偏好等。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 获取 SharedPreferences\nval prefs = context.getSharedPreferences("my_prefs", Context.MODE_PRIVATE)\n\n// 保存数据\nprefs.edit().apply {\n    putString("username", "张三")\n    putInt("age", 25)\n    putBoolean("isLoggedIn", true)\n    apply()  // 异步保存（推荐）\n    // commit()  // 同步保存\n}\n\n// 读取数据\nval username = prefs.getString("username", "默认值") // 第二个参数是默认值\nval age = prefs.getInt("age", 0)\nval isLoggedIn = prefs.getBoolean("isLoggedIn", false)'
              },
              {
                type: 'text',
                content: '## DataStore：现代替代方案\n\nGoogle 推荐使用 DataStore 替代 SharedPreferences，它支持协程和 Flow。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 定义 DataStore\nval Context.dataStore by preferencesDataStore(name = "settings")\n\n// 定义键\nobject PrefsKeys {\n    val USERNAME = stringPreferencesKey("username")\n    val IS_DARK_MODE = booleanPreferencesKey("is_dark_mode")\n}\n\n// 读取数据\nval usernameFlow: Flow<String> = context.dataStore.data\n    .map { prefs -> prefs[PrefsKeys.USERNAME] ?: "默认" }\n\n// 保存数据\nsuspend fun saveUsername(name: String) {\n    context.dataStore.edit { prefs ->\n        prefs[PrefsKeys.USERNAME] = name\n    }\n}'
              },
              {
                type: 'tip',
                content: '新项目推荐使用 DataStore。但 SharedPreferences 在老项目中很常见，需要认识。'
              }
            ]
          },
          {
            id: 'room-intro',
            title: 'Room 数据库入门',
            description: 'Android 官方数据库框架',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## 什么是 Room？\n\nRoom 是 Android 官方的数据库框架，基于 SQLite，提供编译时检查和简洁的 API。'
              },
              {
                type: 'text',
                content: '## Room 三大组件\n\n| 组件 | 作用 | 注解 |\n|-----|------|------|\n| Entity | 数据表 | @Entity |\n| DAO | 数据访问对象 | @Dao |\n| Database | 数据库 | @Database |'
              },
              {
                type: 'text',
                content: '## 1. 定义 Entity（数据表）'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '@Entity(tableName = "users")\ndata class User(\n    @PrimaryKey(autoGenerate = true)\n    val id: Long = 0,\n    \n    @ColumnInfo(name = "user_name")\n    val name: String,\n    \n    val email: String,\n    \n    val createdAt: Long = System.currentTimeMillis()\n)'
              },
              {
                type: 'text',
                content: '## 2. 定义 DAO（数据访问对象）'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '@Dao\ninterface UserDao {\n    // 查询所有\n    @Query("SELECT * FROM users ORDER BY createdAt DESC")\n    fun getAllUsers(): Flow<List<User>>  // 返回 Flow 自动观察变化\n    \n    // 根据 ID 查询\n    @Query("SELECT * FROM users WHERE id = :userId")\n    suspend fun getUserById(userId: Long): User?\n    \n    // 插入\n    @Insert(onConflict = OnConflictStrategy.REPLACE)\n    suspend fun insertUser(user: User): Long\n    \n    // 更新\n    @Update\n    suspend fun updateUser(user: User)\n    \n    // 删除\n    @Delete\n    suspend fun deleteUser(user: User)\n    \n    // 根据条件删除\n    @Query("DELETE FROM users WHERE id = :userId")\n    suspend fun deleteUserById(userId: Long)\n}'
              },
              {
                type: 'text',
                content: '## 3. 定义 Database'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '@Database(\n    entities = [User::class],\n    version = 1,\n    exportSchema = false\n)\nabstract class AppDatabase : RoomDatabase() {\n    abstract fun userDao(): UserDao\n    \n    companion object {\n        @Volatile\n        private var INSTANCE: AppDatabase? = null\n        \n        fun getDatabase(context: Context): AppDatabase {\n            return INSTANCE ?: synchronized(this) {\n                val instance = Room.databaseBuilder(\n                    context.applicationContext,\n                    AppDatabase::class.java,\n                    "app_database"\n                ).build()\n                INSTANCE = instance\n                instance\n            }\n        }\n    }\n}'
              },
              {
                type: 'tip',
                content: 'Room 的 DAO 方法使用 suspend 或返回 Flow，确保数据库操作不在主线程。'
              }
            ]
          },
          {
            id: 'room-usage',
            title: 'Room 实战使用',
            description: 'Repository 模式、与 ViewModel 配合',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## Repository 模式\n\nRepository 封装数据源，ViewModel 不直接访问 DAO。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'class UserRepository(private val userDao: UserDao) {\n    // 暴露 Flow 给 ViewModel 观察\n    val allUsers: Flow<List<User>> = userDao.getAllUsers()\n    \n    suspend fun addUser(name: String, email: String) {\n        val user = User(name = name, email = email)\n        userDao.insertUser(user)\n    }\n    \n    suspend fun deleteUser(user: User) {\n        userDao.deleteUser(user)\n    }\n    \n    suspend fun getUserById(id: Long): User? {\n        return userDao.getUserById(id)\n    }\n}'
              },
              {
                type: 'text',
                content: '## 在 ViewModel 中使用'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'class UserViewModel(private val repository: UserRepository) : ViewModel() {\n    // 观察用户列表\n    val users: StateFlow<List<User>> = repository.allUsers\n        .stateIn(\n            scope = viewModelScope,\n            started = SharingStarted.WhileSubscribed(5000),\n            initialValue = emptyList()\n        )\n    \n    fun addUser(name: String, email: String) {\n        viewModelScope.launch {\n            repository.addUser(name, email)\n        }\n    }\n    \n    fun deleteUser(user: User) {\n        viewModelScope.launch {\n            repository.deleteUser(user)\n        }\n    }\n}'
              },
              {
                type: 'text',
                content: '## 在 Compose 中观察'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '@Composable\nfun UserListScreen(viewModel: UserViewModel) {\n    val users by viewModel.users.collectAsState()\n    \n    LazyColumn {\n        items(users) { user ->\n            UserItem(\n                user = user,\n                onDelete = { viewModel.deleteUser(user) }\n            )\n        }\n    }\n}'
              },
              {
                type: 'warning',
                content: '数据库版本升级需要迁移（Migration），否则会丢失数据或崩溃。开发阶段可以用 fallbackToDestructiveMigration()。'
              }
            ]
          }
        ]
      },
      {
        id: 'network',
        title: '网络请求',
        lessons: [
          {
            id: 'retrofit-intro',
            title: 'Retrofit 入门',
            description: 'Android 最流行的网络请求库',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## 什么是 Retrofit？\n\nRetrofit 是 Square 开发的 HTTP 客户端，是 Android 最流行的网络请求库。它将 HTTP API 转换成 Kotlin 接口。'
              },
              {
                type: 'text',
                content: '## 添加依赖'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// build.gradle.kts\ndependencies {\n    implementation("com.squareup.retrofit2:retrofit:2.9.0")\n    implementation("com.squareup.retrofit2:converter-gson:2.9.0")  // JSON 解析\n    implementation("com.squareup.okhttp3:logging-interceptor:4.11.0")  // 日志\n}'
              },
              {
                type: 'text',
                content: '## 定义数据模型'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// API 返回的数据结构\ndata class UserResponse(\n    val id: Int,\n    val name: String,\n    val email: String,\n    val avatar: String?\n)\n\ndata class ApiResponse<T>(\n    val code: Int,\n    val message: String,\n    val data: T?\n)'
              },
              {
                type: 'text',
                content: '## 定义 API 接口'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'interface ApiService {\n    // GET 请求\n    @GET("users")\n    suspend fun getUsers(): List<UserResponse>\n    \n    // 带路径参数\n    @GET("users/{id}")\n    suspend fun getUserById(@Path("id") userId: Int): UserResponse\n    \n    // 带查询参数\n    @GET("users")\n    suspend fun searchUsers(\n        @Query("keyword") keyword: String,\n        @Query("page") page: Int = 1\n    ): List<UserResponse>\n    \n    // POST 请求\n    @POST("users")\n    suspend fun createUser(@Body user: UserRequest): UserResponse\n    \n    // 带 Header\n    @GET("profile")\n    suspend fun getProfile(@Header("Authorization") token: String): UserResponse\n}'
              },
              {
                type: 'tip',
                content: 'suspend 函数让 Retrofit 自动在后台线程执行，返回结果在主线程。'
              }
            ]
          },
          {
            id: 'retrofit-setup',
            title: 'Retrofit 配置与使用',
            description: '创建实例、错误处理、与 ViewModel 配合',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## 创建 Retrofit 实例'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'object RetrofitClient {\n    private const val BASE_URL = "https://api.example.com/"\n    \n    // 日志拦截器（调试用）\n    private val loggingInterceptor = HttpLoggingInterceptor().apply {\n        level = HttpLoggingInterceptor.Level.BODY\n    }\n    \n    // OkHttp 客户端\n    private val okHttpClient = OkHttpClient.Builder()\n        .addInterceptor(loggingInterceptor)\n        .connectTimeout(30, TimeUnit.SECONDS)\n        .readTimeout(30, TimeUnit.SECONDS)\n        .build()\n    \n    // Retrofit 实例\n    private val retrofit = Retrofit.Builder()\n        .baseUrl(BASE_URL)\n        .client(okHttpClient)\n        .addConverterFactory(GsonConverterFactory.create())\n        .build()\n    \n    val apiService: ApiService = retrofit.create(ApiService::class.java)\n}'
              },
              {
                type: 'text',
                content: '## 在 Repository 中使用'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'class UserRepository {\n    private val api = RetrofitClient.apiService\n    \n    suspend fun getUsers(): Result<List<UserResponse>> {\n        return try {\n            val users = api.getUsers()\n            Result.success(users)\n        } catch (e: Exception) {\n            Result.failure(e)\n        }\n    }\n    \n    suspend fun getUserById(id: Int): Result<UserResponse> {\n        return try {\n            val user = api.getUserById(id)\n            Result.success(user)\n        } catch (e: Exception) {\n            Result.failure(e)\n        }\n    }\n}'
              },
              {
                type: 'text',
                content: '## 在 ViewModel 中使用'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'class UserViewModel(private val repository: UserRepository) : ViewModel() {\n    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)\n    val uiState: StateFlow<UiState> = _uiState.asStateFlow()\n    \n    init {\n        loadUsers()\n    }\n    \n    fun loadUsers() {\n        viewModelScope.launch {\n            _uiState.value = UiState.Loading\n            \n            repository.getUsers()\n                .onSuccess { users ->\n                    _uiState.value = UiState.Success(users)\n                }\n                .onFailure { error ->\n                    _uiState.value = UiState.Error(error.message ?: "未知错误")\n                }\n        }\n    }\n}\n\n// UI 状态\nsealed class UiState {\n    object Loading : UiState()\n    data class Success(val users: List<UserResponse>) : UiState()\n    data class Error(val message: String) : UiState()\n}'
              },
              {
                type: 'warning',
                content: '别忘了在 AndroidManifest.xml 中添加网络权限：<uses-permission android:name="android.permission.INTERNET" />'
              }
            ]
          }
        ]
      },
      {
        id: 'image-loading',
        title: '图片加载',
        lessons: [
          {
            id: 'coil-intro',
            title: 'Coil 图片加载',
            description: '现代 Kotlin 优先的图片加载库',
            duration: 20,
            contents: [
              {
                type: 'text',
                content: '## 为什么需要图片加载库？\n\n直接加载网络图片会：\n- 阻塞主线程\n- 消耗大量内存\n- 没有缓存，重复下载\n\n图片加载库帮你处理这些问题。'
              },
              {
                type: 'text',
                content: '## Coil vs Glide\n\n| 对比 | Coil | Glide |\n|-----|------|-------|\n| 语言 | Kotlin 优先 | Java |\n| 体积 | 小 | 较大 |\n| Compose 支持 | 原生支持 | 需要额外库 |\n| 协程 | 原生支持 | 需要扩展 |\n\n新项目推荐 Coil，老项目常见 Glide。'
              },
              {
                type: 'text',
                content: '## 添加依赖'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// build.gradle.kts\ndependencies {\n    implementation("io.coil-kt:coil-compose:2.5.0")  // Compose 版本\n    // 或\n    implementation("io.coil-kt:coil:2.5.0")  // View 版本\n}'
              },
              {
                type: 'text',
                content: '## 在 Compose 中使用'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '@Composable\nfun UserAvatar(avatarUrl: String) {\n    AsyncImage(\n        model = avatarUrl,\n        contentDescription = "用户头像",\n        modifier = Modifier\n            .size(64.dp)\n            .clip(CircleShape),\n        contentScale = ContentScale.Crop\n    )\n}\n\n// 带加载状态和错误处理\n@Composable\nfun ImageWithState(imageUrl: String) {\n    AsyncImage(\n        model = ImageRequest.Builder(LocalContext.current)\n            .data(imageUrl)\n            .crossfade(true)  // 淡入动画\n            .build(),\n        contentDescription = null,\n        placeholder = painterResource(R.drawable.placeholder),  // 加载中\n        error = painterResource(R.drawable.error),  // 加载失败\n        modifier = Modifier.fillMaxWidth()\n    )\n}'
              },
              {
                type: 'text',
                content: '## 在 ImageView 中使用（传统方式）'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 基本加载\nimageView.load(imageUrl)\n\n// 带配置\nimageView.load(imageUrl) {\n    crossfade(true)\n    placeholder(R.drawable.placeholder)\n    error(R.drawable.error)\n    transformations(CircleCropTransformation())  // 圆形裁剪\n}'
              },
              {
                type: 'tip',
                content: 'Coil 自动处理内存缓存和磁盘缓存，同一图片不会重复下载。'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'phase-4',
    name: '架构进阶',
    description: 'MVVM、依赖注入、Navigation',
    iconName: 'Building2',
    colorType: 'purple',
    modules: [
      {
        id: 'architecture',
        title: '架构模式',
        lessons: [
          {
            id: 'mvvm-intro',
            title: 'MVVM 架构',
            description: 'Android 官方推荐的架构模式',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## 为什么需要架构？\n\n没有架构的代码会变成"意大利面条"——所有逻辑混在一起，难以维护和测试。'
              },
              {
                type: 'text',
                content: '## MVVM 三层结构\n\n| 层 | 职责 | 示例 |\n|---|------|------|\n| **Model** | 数据层，获取/存储数据 | Repository、Room、Retrofit |\n| **View** | UI 层，显示数据 | Activity、Fragment、Composable |\n| **ViewModel** | 连接层，持有 UI 状态 | UserViewModel |'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 数据流向：Repository -> ViewModel -> View\n//\n// Repository: 数据来源（网络/数据库）\n//     ↓\n// ViewModel: 持有状态，处理业务逻辑\n//     ↓\n// View: 观察状态，显示 UI'
              },
              {
                type: 'text',
                content: '## ViewModel 基本用法'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'class UserViewModel(private val repository: UserRepository) : ViewModel() {\n    // UI 状态\n    private val _uiState = MutableStateFlow<UserUiState>(UserUiState.Loading)\n    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()\n    \n    // 加载数据\n    fun loadUser(userId: String) {\n        viewModelScope.launch {\n            _uiState.value = UserUiState.Loading\n            try {\n                val user = repository.getUser(userId)\n                _uiState.value = UserUiState.Success(user)\n            } catch (e: Exception) {\n                _uiState.value = UserUiState.Error(e.message ?: "未知错误")\n            }\n        }\n    }\n}\n\n// UI 状态定义\nsealed class UserUiState {\n    object Loading : UserUiState()\n    data class Success(val user: User) : UserUiState()\n    data class Error(val message: String) : UserUiState()\n}'
              },
              {
                type: 'text',
                content: '## 在 Compose 中使用'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '@Composable\nfun UserScreen(viewModel: UserViewModel = viewModel()) {\n    val uiState by viewModel.uiState.collectAsState()\n    \n    when (val state = uiState) {\n        is UserUiState.Loading -> LoadingIndicator()\n        is UserUiState.Success -> UserContent(state.user)\n        is UserUiState.Error -> ErrorMessage(state.message)\n    }\n}'
              },
              {
                type: 'tip',
                content: 'ViewModel 的生命周期比 Activity/Fragment 长，屏幕旋转不会丢失数据。'
              }
            ]
          },
          {
            id: 'clean-architecture',
            title: '分层架构',
            description: 'UI层、Domain层、Data层的职责划分',
            duration: 20,
            contents: [
              {
                type: 'text',
                content: '## 三层架构\n\n在 MVVM 基础上，进一步细分：'
              },
              {
                type: 'text',
                content: '## 各层职责\n\n| 层 | 包含 | 职责 |\n|---|------|------|\n| **UI 层** | Screen、ViewModel | 显示数据、处理用户交互 |\n| **Domain 层** | UseCase（可选） | 业务逻辑、数据转换 |\n| **Data 层** | Repository、DataSource | 数据获取、缓存策略 |'
              },
              {
                type: 'code',
                language: 'text',
                content: '项目结构示例：\n\ncom.example.app/\n├── ui/                    # UI 层\n│   ├── screen/\n│   │   ├── HomeScreen.kt\n│   │   └── UserScreen.kt\n│   └── viewmodel/\n│       └── UserViewModel.kt\n├── domain/                # Domain 层（可选）\n│   ├── model/\n│   │   └── User.kt\n│   └── usecase/\n│       └── GetUserUseCase.kt\n└── data/                  # Data 层\n    ├── repository/\n    │   └── UserRepository.kt\n    ├── remote/\n    │   └── ApiService.kt\n    └── local/\n        └── UserDao.kt'
              },
              {
                type: 'text',
                content: '## Repository 模式'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: 'class UserRepository(\n    private val api: ApiService,\n    private val userDao: UserDao\n) {\n    // 单一数据源：先从缓存取，没有再从网络取\n    suspend fun getUser(id: String): User {\n        // 1. 尝试从本地获取\n        val cached = userDao.getUserById(id)\n        if (cached != null) return cached\n        \n        // 2. 从网络获取\n        val remote = api.getUser(id)\n        \n        // 3. 保存到本地\n        userDao.insertUser(remote)\n        \n        return remote\n    }\n    \n    // 观察数据变化\n    fun observeUsers(): Flow<List<User>> = userDao.getAllUsers()\n}'
              },
              {
                type: 'tip',
                content: 'Repository 隐藏数据来源细节，ViewModel 不关心数据是从网络还是数据库来的。'
              }
            ]
          }
        ]
      },
      {
        id: 'di',
        title: '依赖注入',
        lessons: [
          {
            id: 'hilt-intro',
            title: 'Hilt 依赖注入',
            description: 'Android 官方推荐的依赖注入框架',
            duration: 30,
            contents: [
              {
                type: 'text',
                content: '## 什么是依赖注入？\n\n依赖注入（DI）是一种设计模式：不是自己创建依赖，而是从外部"注入"。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 不用 DI：自己创建依赖（耦合度高）\nclass UserViewModel : ViewModel() {\n    private val repository = UserRepository(\n        ApiService(),\n        UserDatabase.getInstance().userDao()\n    )\n}\n\n// 用 DI：从外部注入（解耦）\nclass UserViewModel @Inject constructor(\n    private val repository: UserRepository\n) : ViewModel() {\n    // repository 从外部注入，不关心怎么创建的\n}'
              },
              {
                type: 'text',
                content: '## Hilt 基础配置'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 1. Application 类添加 @HiltAndroidApp\n@HiltAndroidApp\nclass MyApplication : Application()\n\n// 2. Activity/Fragment 添加 @AndroidEntryPoint\n@AndroidEntryPoint\nclass MainActivity : ComponentActivity() {\n    // 现在可以注入依赖了\n}'
              },
              {
                type: 'text',
                content: '## 定义依赖提供方式'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '@Module\n@InstallIn(SingletonComponent::class)  // 单例作用域\nobject AppModule {\n    \n    @Provides\n    @Singleton\n    fun provideApiService(): ApiService {\n        return Retrofit.Builder()\n            .baseUrl("https://api.example.com/")\n            .addConverterFactory(GsonConverterFactory.create())\n            .build()\n            .create(ApiService::class.java)\n    }\n    \n    @Provides\n    @Singleton\n    fun provideDatabase(@ApplicationContext context: Context): AppDatabase {\n        return Room.databaseBuilder(\n            context,\n            AppDatabase::class.java,\n            "app_database"\n        ).build()\n    }\n    \n    @Provides\n    fun provideUserDao(database: AppDatabase): UserDao {\n        return database.userDao()\n    }\n}'
              },
              {
                type: 'text',
                content: '## 在 ViewModel 中使用'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '@HiltViewModel\nclass UserViewModel @Inject constructor(\n    private val repository: UserRepository\n) : ViewModel() {\n    // repository 自动注入\n}\n\n// Repository 也可以注入依赖\nclass UserRepository @Inject constructor(\n    private val api: ApiService,\n    private val userDao: UserDao\n) {\n    // api 和 userDao 自动注入\n}'
              },
              {
                type: 'tip',
                content: 'Hilt 让你专注业务逻辑，不用操心对象创建。也方便单元测试时替换依赖。'
              }
            ]
          }
        ]
      },
      {
        id: 'navigation',
        title: 'Navigation',
        lessons: [
          {
            id: 'navigation-intro',
            title: 'Navigation 组件',
            description: 'Jetpack Navigation 实现页面导航',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## 为什么用 Navigation？\n\n传统方式用 Intent 跳转，参数传递容易出错。Navigation 组件提供：\n- 类型安全的参数传递\n- 统一的导航管理\n- 自动处理返回栈\n- 支持深链接'
              },
              {
                type: 'text',
                content: '## Compose Navigation 基础'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 定义路由\nobject Routes {\n    const val HOME = "home"\n    const val DETAIL = "detail/{userId}"  // 带参数\n    const val SETTINGS = "settings"\n    \n    fun detailRoute(userId: String) = "detail/$userId"\n}\n\n// 设置导航图\n@Composable\nfun AppNavigation() {\n    val navController = rememberNavController()\n    \n    NavHost(\n        navController = navController,\n        startDestination = Routes.HOME\n    ) {\n        composable(Routes.HOME) {\n            HomeScreen(\n                onUserClick = { userId ->\n                    navController.navigate(Routes.detailRoute(userId))\n                }\n            )\n        }\n        \n        composable(\n            route = Routes.DETAIL,\n            arguments = listOf(navArgument("userId") { type = NavType.StringType })\n        ) { backStackEntry ->\n            val userId = backStackEntry.arguments?.getString("userId") ?: ""\n            DetailScreen(userId = userId)\n        }\n        \n        composable(Routes.SETTINGS) {\n            SettingsScreen()\n        }\n    }\n}'
              },
              {
                type: 'text',
                content: '## 导航操作'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 基本导航\nnavController.navigate("detail/123")\n\n// 带选项\nnavController.navigate("home") {\n    // 清除返回栈到指定目标\n    popUpTo("login") { inclusive = true }\n    // 避免重复创建\n    launchSingleTop = true\n}\n\n// 返回上一页\nnavController.popBackStack()\n\n// 返回到指定页面\nnavController.popBackStack("home", inclusive = false)'
              },
              {
                type: 'text',
                content: '## 底部导航栏'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '@Composable\nfun MainScreen() {\n    val navController = rememberNavController()\n    \n    Scaffold(\n        bottomBar = {\n            NavigationBar {\n                val currentRoute = navController.currentBackStackEntry\n                    ?.destination?.route\n                \n                NavigationBarItem(\n                    icon = { Icon(Icons.Default.Home, "首页") },\n                    label = { Text("首页") },\n                    selected = currentRoute == "home",\n                    onClick = {\n                        navController.navigate("home") {\n                            popUpTo("home") { inclusive = true }\n                            launchSingleTop = true\n                        }\n                    }\n                )\n                NavigationBarItem(\n                    icon = { Icon(Icons.Default.Person, "我的") },\n                    label = { Text("我的") },\n                    selected = currentRoute == "profile",\n                    onClick = {\n                        navController.navigate("profile") {\n                            popUpTo("home")\n                            launchSingleTop = true\n                        }\n                    }\n                )\n            }\n        }\n    ) { paddingValues ->\n        NavHost(\n            navController = navController,\n            startDestination = "home",\n            modifier = Modifier.padding(paddingValues)\n        ) {\n            composable("home") { HomeScreen() }\n            composable("profile") { ProfileScreen() }\n        }\n    }\n}'
              },
              {
                type: 'tip',
                content: '底部导航切换时使用 popUpTo + launchSingleTop，避免创建多个实例。'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'phase-5',
    name: '实战项目',
    description: '完整项目开发、发布上架',
    iconName: 'Rocket',
    colorType: 'green',
    modules: [
      {
        id: 'projects',
        title: '项目实战',
        lessons: [
          {
            id: 'todo-app-overview',
            title: '待办清单：项目规划',
            description: '项目需求分析、技术选型、架构设计',
            duration: 15,
            contents: [
              {
                type: 'text',
                content: '## 项目目标\n\n开发一个功能完整的待办清单应用，实践所学的全部技能。'
              },
              {
                type: 'text',
                content: '## 功能需求\n\n| 功能 | 描述 |\n|-----|------|\n| 添加任务 | 输入任务标题和描述 |\n| 查看列表 | 显示所有任务，区分已完成/未完成 |\n| 完成任务 | 点击切换完成状态 |\n| 删除任务 | 滑动或点击删除 |\n| 数据持久化 | 关闭应用后数据不丢失 |'
              },
              {
                type: 'text',
                content: '## 技术选型\n\n| 层次 | 技术 | 原因 |\n|-----|------|------|\n| UI | Jetpack Compose | 现代、简洁 |\n| 架构 | MVVM | 官方推荐 |\n| 数据库 | Room | 本地持久化 |\n| 依赖注入 | Hilt | 解耦、可测试 |\n| 导航 | Navigation Compose | 页面管理 |'
              },
              {
                type: 'code',
                language: 'text',
                content: '项目结构：\n\ncom.example.todoapp/\n├── ui/\n│   ├── screen/\n│   │   ├── TodoListScreen.kt    # 任务列表页\n│   │   └── AddTodoScreen.kt     # 添加任务页\n│   ├── component/\n│   │   └── TodoItem.kt          # 任务卡片组件\n│   └── viewmodel/\n│       └── TodoViewModel.kt\n├── data/\n│   ├── local/\n│   │   ├── TodoDao.kt\n│   │   └── TodoDatabase.kt\n│   ├── model/\n│   │   └── Todo.kt\n│   └── repository/\n│       └── TodoRepository.kt\n├── di/\n│   └── AppModule.kt\n└── TodoApplication.kt'
              },
              {
                type: 'tip',
                content: 'AI 辅助提示：让 AI 帮你生成项目骨架，然后逐个实现功能。遇到问题把错误信息发给 AI。'
              }
            ]
          },
          {
            id: 'todo-app-data',
            title: '待办清单：数据层',
            description: '定义数据模型、Room 数据库、Repository',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## Step 1：定义数据模型'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// data/model/Todo.kt\n@Entity(tableName = "todos")\ndata class Todo(\n    @PrimaryKey(autoGenerate = true)\n    val id: Long = 0,\n    val title: String,\n    val description: String = "",\n    val isCompleted: Boolean = false,\n    val createdAt: Long = System.currentTimeMillis()\n)'
              },
              {
                type: 'text',
                content: '## Step 2：定义 DAO'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// data/local/TodoDao.kt\n@Dao\ninterface TodoDao {\n    @Query("SELECT * FROM todos ORDER BY createdAt DESC")\n    fun getAllTodos(): Flow<List<Todo>>\n    \n    @Query("SELECT * FROM todos WHERE id = :id")\n    suspend fun getTodoById(id: Long): Todo?\n    \n    @Insert(onConflict = OnConflictStrategy.REPLACE)\n    suspend fun insertTodo(todo: Todo): Long\n    \n    @Update\n    suspend fun updateTodo(todo: Todo)\n    \n    @Delete\n    suspend fun deleteTodo(todo: Todo)\n    \n    @Query("UPDATE todos SET isCompleted = :completed WHERE id = :id")\n    suspend fun setCompleted(id: Long, completed: Boolean)\n}'
              },
              {
                type: 'text',
                content: '## Step 3：定义 Database'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// data/local/TodoDatabase.kt\n@Database(entities = [Todo::class], version = 1)\nabstract class TodoDatabase : RoomDatabase() {\n    abstract fun todoDao(): TodoDao\n}'
              },
              {
                type: 'text',
                content: '## Step 4：定义 Repository'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// data/repository/TodoRepository.kt\nclass TodoRepository @Inject constructor(\n    private val todoDao: TodoDao\n) {\n    val allTodos: Flow<List<Todo>> = todoDao.getAllTodos()\n    \n    suspend fun addTodo(title: String, description: String = "") {\n        val todo = Todo(title = title, description = description)\n        todoDao.insertTodo(todo)\n    }\n    \n    suspend fun toggleComplete(todo: Todo) {\n        todoDao.setCompleted(todo.id, !todo.isCompleted)\n    }\n    \n    suspend fun deleteTodo(todo: Todo) {\n        todoDao.deleteTodo(todo)\n    }\n}'
              },
              {
                type: 'text',
                content: '## Step 5：配置 Hilt'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// di/AppModule.kt\n@Module\n@InstallIn(SingletonComponent::class)\nobject AppModule {\n    \n    @Provides\n    @Singleton\n    fun provideDatabase(@ApplicationContext context: Context): TodoDatabase {\n        return Room.databaseBuilder(\n            context,\n            TodoDatabase::class.java,\n            "todo_database"\n        ).build()\n    }\n    \n    @Provides\n    fun provideTodoDao(database: TodoDatabase): TodoDao {\n        return database.todoDao()\n    }\n}'
              }
            ]
          },
          {
            id: 'todo-app-ui',
            title: '待办清单：UI 层',
            description: 'ViewModel、Compose 界面、交互逻辑',
            duration: 35,
            contents: [
              {
                type: 'text',
                content: '## Step 1：定义 ViewModel'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// ui/viewmodel/TodoViewModel.kt\n@HiltViewModel\nclass TodoViewModel @Inject constructor(\n    private val repository: TodoRepository\n) : ViewModel() {\n    \n    val todos: StateFlow<List<Todo>> = repository.allTodos\n        .stateIn(\n            scope = viewModelScope,\n            started = SharingStarted.WhileSubscribed(5000),\n            initialValue = emptyList()\n        )\n    \n    fun addTodo(title: String, description: String = "") {\n        if (title.isBlank()) return\n        viewModelScope.launch {\n            repository.addTodo(title, description)\n        }\n    }\n    \n    fun toggleComplete(todo: Todo) {\n        viewModelScope.launch {\n            repository.toggleComplete(todo)\n        }\n    }\n    \n    fun deleteTodo(todo: Todo) {\n        viewModelScope.launch {\n            repository.deleteTodo(todo)\n        }\n    }\n}'
              },
              {
                type: 'text',
                content: '## Step 2：任务列表组件'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// ui/component/TodoItem.kt\n@Composable\nfun TodoItem(\n    todo: Todo,\n    onToggleComplete: () -> Unit,\n    onDelete: () -> Unit,\n    modifier: Modifier = Modifier\n) {\n    Card(\n        modifier = modifier\n            .fillMaxWidth()\n            .padding(horizontal = 16.dp, vertical = 4.dp)\n    ) {\n        Row(\n            modifier = Modifier\n                .padding(16.dp)\n                .fillMaxWidth(),\n            verticalAlignment = Alignment.CenterVertically\n        ) {\n            // 完成状态复选框\n            Checkbox(\n                checked = todo.isCompleted,\n                onCheckedChange = { onToggleComplete() }\n            )\n            \n            Spacer(modifier = Modifier.width(8.dp))\n            \n            // 任务内容\n            Column(modifier = Modifier.weight(1f)) {\n                Text(\n                    text = todo.title,\n                    style = MaterialTheme.typography.titleMedium,\n                    textDecoration = if (todo.isCompleted) \n                        TextDecoration.LineThrough else TextDecoration.None\n                )\n                if (todo.description.isNotBlank()) {\n                    Text(\n                        text = todo.description,\n                        style = MaterialTheme.typography.bodySmall,\n                        color = Color.Gray\n                    )\n                }\n            }\n            \n            // 删除按钮\n            IconButton(onClick = onDelete) {\n                Icon(Icons.Default.Delete, "删除")\n            }\n        }\n    }\n}'
              },
              {
                type: 'text',
                content: '## Step 3：任务列表页面'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// ui/screen/TodoListScreen.kt\n@Composable\nfun TodoListScreen(\n    viewModel: TodoViewModel = hiltViewModel(),\n    onAddClick: () -> Unit\n) {\n    val todos by viewModel.todos.collectAsState()\n    \n    Scaffold(\n        floatingActionButton = {\n            FloatingActionButton(onClick = onAddClick) {\n                Icon(Icons.Default.Add, "添加任务")\n            }\n        }\n    ) { paddingValues ->\n        if (todos.isEmpty()) {\n            // 空状态\n            Box(\n                modifier = Modifier\n                    .fillMaxSize()\n                    .padding(paddingValues),\n                contentAlignment = Alignment.Center\n            ) {\n                Text("暂无任务，点击右下角添加")\n            }\n        } else {\n            // 任务列表\n            LazyColumn(\n                modifier = Modifier\n                    .fillMaxSize()\n                    .padding(paddingValues)\n            ) {\n                items(todos, key = { it.id }) { todo ->\n                    TodoItem(\n                        todo = todo,\n                        onToggleComplete = { viewModel.toggleComplete(todo) },\n                        onDelete = { viewModel.deleteTodo(todo) }\n                    )\n                }\n            }\n        }\n    }\n}'
              },
              {
                type: 'text',
                content: '## Step 4：添加任务页面'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// ui/screen/AddTodoScreen.kt\n@Composable\nfun AddTodoScreen(\n    viewModel: TodoViewModel = hiltViewModel(),\n    onBack: () -> Unit\n) {\n    var title by remember { mutableStateOf("") }\n    var description by remember { mutableStateOf("") }\n    \n    Column(\n        modifier = Modifier\n            .fillMaxSize()\n            .padding(16.dp)\n    ) {\n        OutlinedTextField(\n            value = title,\n            onValueChange = { title = it },\n            label = { Text("任务标题") },\n            modifier = Modifier.fillMaxWidth()\n        )\n        \n        Spacer(modifier = Modifier.height(8.dp))\n        \n        OutlinedTextField(\n            value = description,\n            onValueChange = { description = it },\n            label = { Text("任务描述（可选）") },\n            modifier = Modifier.fillMaxWidth(),\n            minLines = 3\n        )\n        \n        Spacer(modifier = Modifier.height(16.dp))\n        \n        Button(\n            onClick = {\n                viewModel.addTodo(title, description)\n                onBack()\n            },\n            modifier = Modifier.fillMaxWidth(),\n            enabled = title.isNotBlank()\n        ) {\n            Text("保存")\n        }\n    }\n}'
              },
              {
                type: 'tip',
                content: '完整项目代码较长，建议让 AI 帮你生成完整文件，然后逐步理解和调试。'
              }
            ]
          },
          {
            id: 'project-tips',
            title: '项目开发技巧',
            description: 'AI 辅助开发、调试方法、常见问题',
            duration: 20,
            contents: [
              {
                type: 'text',
                content: '## 与 AI 协作开发项目\n\n项目开发时，善用 AI 能大幅提升效率。'
              },
              {
                type: 'text',
                content: '## 有效的 Prompt 示例\n\n| 场景 | Prompt |\n|-----|--------|\n| 生成骨架 | "用 Compose + Hilt + Room 创建一个待办清单项目，包含添加、删除、完成功能" |\n| 实现功能 | "在这个项目基础上，添加任务分类功能，每个任务可以选择一个分类" |\n| 修复问题 | "运行时报错 IllegalStateException: xxx，这是完整日志：[粘贴日志]" |\n| 优化代码 | "这段代码有什么问题？如何优化？[粘贴代码]" |'
              },
              {
                type: 'text',
                content: '## 常见问题排查\n\n| 问题 | 可能原因 | 解决方法 |\n|-----|---------|----------|\n| 编译失败 | 依赖版本冲突 | 检查 build.gradle，让 AI 分析错误 |\n| 运行崩溃 | 空指针、主线程操作 | 查看 Logcat，找到 Exception |\n| 数据不显示 | Flow 没有 collect | 检查 ViewModel 和 UI 的连接 |\n| UI 不更新 | State 没有正确更新 | 确保使用 mutableStateOf 或 StateFlow |'
              },
              {
                type: 'text',
                content: '## 调试技巧'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 1. 使用 Log 打印调试信息\nLog.d("TodoViewModel", "addTodo called: $title")\n\n// 2. 在 Compose 中打印\n@Composable\nfun MyScreen() {\n    val data by viewModel.data.collectAsState()\n    \n    // 打印当前状态\n    LaunchedEffect(data) {\n        Log.d("MyScreen", "Data updated: $data")\n    }\n}\n\n// 3. 使用断点调试\n// 在 Android Studio 中点击行号左侧设置断点'
              },
              {
                type: 'tip',
                content: '遇到问题别慌！复制完整的错误日志给 AI，大多数问题都能快速解决。'
              },
              {
                type: 'text',
                content: '## 下一步\n\n完成待办清单后，可以尝试：\n\n1. **添加功能**：任务分类、截止日期、提醒通知\n2. **美化 UI**：主题切换、动画效果\n3. **尝试新项目**：天气应用（网络请求）、记账本（图表）\n\n实践是最好的学习方式，多写多练！'
              }
            ]
          }
        ]
      }
    ]
  }
]

/**
 * 获取所有课程的扁平列表
 */
export function getAllLessons(): Array<{ phaseId: string; moduleId: string; lesson: Lesson }> {
  const lessons: Array<{ phaseId: string; moduleId: string; lesson: Lesson }> = []
  
  courseData.forEach(phase => {
    phase.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        lessons.push({
          phaseId: phase.id,
          moduleId: module.id,
          lesson
        })
      })
    })
  })
  
  return lessons
}

/**
 * 根据 ID 获取课程
 */
export function getLessonById(phaseId: string, lessonId: string): Lesson | null {
  const phase = courseData.find(p => p.id === phaseId)
  if (!phase) return null
  
  for (const module of phase.modules) {
    const lesson = module.lessons.find(l => l.id === lessonId)
    if (lesson) return lesson
  }
  
  return null
}

/**
 * 获取课程的上一课和下一课
 */
export function getAdjacentLessons(phaseId: string, lessonId: string): {
  prev: { phaseId: string; lessonId: string } | null
  next: { phaseId: string; lessonId: string } | null
} {
  const allLessons = getAllLessons()
  const currentIndex = allLessons.findIndex(
    l => l.phaseId === phaseId && l.lesson.id === lessonId
  )
  
  if (currentIndex === -1) {
    return { prev: null, next: null }
  }
  
  const prev = currentIndex > 0
    ? { phaseId: allLessons[currentIndex - 1].phaseId, lessonId: allLessons[currentIndex - 1].lesson.id }
    : null
    
  const next = currentIndex < allLessons.length - 1
    ? { phaseId: allLessons[currentIndex + 1].phaseId, lessonId: allLessons[currentIndex + 1].lesson.id }
    : null
    
  return { prev, next }
}
