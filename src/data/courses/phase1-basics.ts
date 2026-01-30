/**
 * 第一阶段：基础入门
 * Kotlin 核心概念、项目结构、运行调试
 */

import type { Phase } from './types'

export const phase1: Phase = {
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
}
