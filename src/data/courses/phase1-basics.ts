/**
 * 第一阶段：基础入门
 * 配置开发环境，掌握 Kotlin 核心语法，理解 Android 架构
 */

import type { Phase } from './types'

export const phase1: Phase = {
  id: 'phase-1',
  name: '基础入门',
  description: '配置开发环境，掌握 Kotlin 核心语法，理解 Android 架构',
  iconName: 'Smartphone',
  colorType: 'green',
  modules: [
    {
      id: 'quick-start',
      title: '快速入门',
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
              content: '## 基本工作流程\n\n1. 在 Cursor 中描述需求，让 AI 生成代码\n2. 理解 AI 生成的代码，确认逻辑正确\n3. 在 Android Studio 中运行，测试效果\n4. 发现问题后回到 Cursor，描述问题让 AI 修复\n5. 重复直到功能完成'
            },
            {
              type: 'text',
              content: '## 与 AI 协作的技巧\n\n**描述需求时要具体**：\n- ❌ "写一个登录页面"\n- ✅ "用 Jetpack Compose 写一个登录页面，包含邮箱输入框、密码输入框、登录按钮，使用 MVVM 架构"\n\n**发现问题时提供上下文**：\n- ❌ "代码不工作"\n- ✅ "点击登录按钮后没有反应，Logcat 显示 NetworkOnMainThreadException"'
            },
            {
              type: 'warning',
              content: '**AI 不是万能的**：它可能生成过时的 API、有安全隐患的代码、或者效率低下的实现。你的代码理解能力决定了最终代码质量。'
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
    },
    {
      id: 'kotlin-basics',
      title: 'Kotlin 核心语法',
      lessons: [
        {
          id: 'kotlin-variables',
          title: '变量与数据类型',
          description: 'val/var、基本类型、实用场景',
          duration: 16,
          contents: [
            {
              type: 'text',
              content: '## 为什么要学变量和类型？\n\n想象你要做一个计步器 App：需要存储步数（会变化）、用户名（不变）、今日目标（不变）...\n\n在 Kotlin 中，不同的数据用不同的变量和类型来存储。选对了类型，代码更清晰、bug 更少。'
            },
            {
              type: 'tip',
              content: '**JS 开发者注意**：Kotlin 的 `val` 类似 JS 的 `const`，`var` 类似 `let`。但 Kotlin 的类型检查更严格，能在编译时发现更多问题。'
            },
            {
              type: 'text',
              content: '## val 和 var：可变 vs 不可变\n\nKotlin 有两种变量声明方式：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: 'fun main() {\n    val userName = "张三"    // val = 不可变（类似 const）\n    var stepCount = 0        // var = 可变（类似 let）\n    \n    stepCount = stepCount + 1000  // 可以修改\n    println("$userName 今天走了 $stepCount 步")  // 输出: 张三 今天走了 1000 步\n    \n    // userName = "李四"  // 编译错误！val 不能重新赋值\n}'
            },
            {
              type: 'text',
              content: '**何时用 val？何时用 var？**\n\n| 数据 | 推荐 | 理由 |\n|-----|------|------|\n| 用户 ID | val | 登录后不变 |\n| 计数器 | var | 需要递增 |\n| 配置 URL | val | 固定不变 |\n| 表单输入 | var | 用户会修改 |\n| API 返回数据 | val | 一次性获取 |'
            },
            {
              type: 'tip',
              content: '原则：**优先用 val**。只有确定需要修改时才用 var。这能避免意外修改导致的 bug。'
            },
            {
              type: 'text',
              content: '## 常用数据类型\n\n| 类型 | 用途 | 示例 |\n|-----|------|------|\n| `Int` | 整数（-21亿~21亿） | 年龄、数量、ID |\n| `Long` | 大整数 | 时间戳、文件大小 |\n| `Double` | 小数 | 价格、评分、百分比 |\n| `Boolean` | 布尔值 | 开关、是否登录 |\n| `String` | 字符串 | 名称、URL、描述 |'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: 'fun main() {\n    // 整数\n    val age = 25               // Int\n    val userId = 12345         // Int\n    \n    // 大整数（注意 L 后缀）\n    val timestamp = System.currentTimeMillis()  // Long：1706500000000\n    val fileSize = 5368709120L                  // Long：5GB 字节数\n    \n    // 小数\n    val price = 99.99          // Double（默认）\n    val rating = 4.5           // Double\n    \n    // 布尔值\n    val isLoggedIn = true\n    val isDarkMode = false\n    \n    // 字符串\n    val name = "张三"\n    val greeting = "你好，$name"  // 字符串模板\n    val info = "明年 ${age + 1} 岁"  // 表达式用 ${}\n}'
            },
            {
              type: 'warning',
              content: '**注意：**\n\n- Int 最大约 21 亿，时间戳必须用 Long\n- 金额计算不要用 Double（有精度问题），建议用分（Int）\n- 大数字记得加 L 后缀：`5368709120L`'
            },
            {
              type: 'text',
              content: '## 实战：常见问题对比\n\n看看这些代码有什么问题：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// [错误] 问题1：用 var 存储不会变的数据\nvar apiUrl = "https://api.example.com"  // 应该用 val\n\n// [正确] 不会改变的配置用 val\nval apiUrl = "https://api.example.com"\n\n// [错误] 问题2：用 Int 存储时间戳\nval timestamp = System.currentTimeMillis().toInt()  // Int 存不下！\n\n// [正确] 时间戳必须用 Long\nval timestamp = System.currentTimeMillis()  // Long\n\n// [错误] 问题3：直接用 toInt() 转换用户输入\nval ageInput = editText.text.toString()\nval age = ageInput.toInt()  // 用户输入"abc"就崩溃！\n\n// [正确] 用 toIntOrNull() + 默认值\nval age = ageInput.toIntOrNull() ?: 0'
            },
            {
              type: 'text',
              content: '## 类型转换技巧\n\nKotlin 不会自动转换类型，需要显式调用转换方法：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// 数字之间转换\nval intVal = 42\nval longVal = intVal.toLong()      // Int → Long\nval doubleVal = intVal.toDouble()  // Int → Double\n\n// 字符串转数字（安全方式）\nval str = "123"\nval num = str.toIntOrNull()  // 成功返回 123，失败返回 null\n\n// 配合默认值使用\nval safeNum = str.toIntOrNull() ?: 0  // 失败时用 0'
            },
            {
              type: 'warning',
              content: '**永远不要用 `toInt()` 转换用户输入！**\n\n用 `toIntOrNull()` 配合 `?:` 提供默认值，避免崩溃。'
            },
            {
              type: 'text',
              content: '## 速查表：数据类型\n\n忘记了随时回来看：'
            },
            {
              type: 'code',
              language: 'text',
              content: 'val/var      → val 优先，var 仅在需要修改时用\nInt          → 整数（-21亿~21亿），年龄、数量、ID\nLong         → 大整数，时间戳、文件大小（加 L 后缀）\nDouble       → 小数，价格、评分、百分比\nBoolean      → 布尔值（true/false），开关、状态\nString       → 字符串，名称、URL、描述\n字符串模板    → "你好，$name" 或 "明年 ${age + 1} 岁"\n类型转换      → toIntOrNull() ?: 默认值（安全转换）'
            }
          ]
        },
        {
          id: 'kotlin-functions',
          title: '函数与 Lambda',
          description: '函数定义、Lambda 表达式、Android 中的应用',
          duration: 15,
          contents: [
            {
              type: 'text',
              content: '## 为什么要学函数和 Lambda？\n\nAndroid 开发中到处都是函数和 Lambda：\n- 点击按钮 → 执行一段代码（Lambda）\n- 过滤列表 → 用条件筛选（Lambda）\n- 网络请求回调 → 数据返回后处理（Lambda）\n\n看懂这些，才能理解大部分 Android 代码在做什么。'
            },
            {
              type: 'tip',
              content: '**JS 开发者注意**：Kotlin 的 Lambda 就像 JS 的箭头函数 `() => {}`，但语法稍有不同。'
            },
            {
              type: 'text',
              content: '## 函数基础\n\n使用 `fun` 关键字定义函数：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// 基本语法：fun 函数名(参数: 类型): 返回类型 { 函数体 }\nfun add(a: Int, b: Int): Int {\n    return a + b\n}\n\nprintln(add(3, 5))  // 输出: 8\n\n// 单表达式函数（更简洁）\nfun add(a: Int, b: Int) = a + b  // 自动推断返回 Int\n\n// 无返回值（Unit 可省略）\nfun showMessage(msg: String) {\n    println(msg)  // 输出传入的消息\n}'
            },
            {
              type: 'text',
              content: '## 默认参数：减少重载\n\nKotlin 支持默认参数，不需要写多个重载函数：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// 有默认值的参数\nfun greet(name: String = "用户", greeting: String = "你好") {\n    println("$greeting, $name!")\n}\n\ngreet()                      // 输出: 你好, 用户!\ngreet("张三")                // 输出: 你好, 张三!\ngreet("张三", "早上好")      // 输出: 早上好, 张三!\ngreet(greeting = "晚安")     // 输出: 晚安, 用户!'
            },
            {
              type: 'tip',
              content: '**命名参数**让你可以跳过某些参数，或者不按顺序传参，代码更清晰。'
            },
            {
              type: 'text',
              content: '## Lambda：可传递的代码块\n\nLambda 是一段可以作为参数传递的代码，在 Android 中非常常用。'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// Lambda 语法：{ 参数 -> 函数体 }\nval double = { x: Int -> x * 2 }\nprintln(double(5))  // 输出: 10\n\n// 多个参数\nval sum = { a: Int, b: Int -> a + b }\nprintln(sum(3, 4))  // 输出: 7\n\n// 单参数可以用 it 简化\nval triple = { it: Int -> it * 3 }\nval tripleSimple = { it * 3 }  // 等价写法\nprintln(tripleSimple(5))  // 输出: 15'
            },
            {
              type: 'text',
              content: '## Lambda 在 Android 中的 3 大用途\n\n**1. 按钮点击**'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// 点击按钮时执行的代码\nbutton.setOnClickListener { \n    showMessage("按钮被点击了")\n    updateCounter()\n}'
            },
            {
              type: 'text',
              content: '**2. 列表操作**'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: 'val numbers = listOf(1, 2, 3, 4, 5)\n\n// 过滤：找出大于 2 的数\nval filtered = numbers.filter { it > 2 }\nprintln(filtered)  // 输出: [3, 4, 5]\n\n// 转换：每个数乘以 2\nval doubled = numbers.map { it * 2 }\nprintln(doubled)  // 输出: [2, 4, 6, 8, 10]\n\n// 遍历：依次打印\nnumbers.forEach { println(it) }  // 输出: 1 2 3 4 5（每个数字一行）'
            },
            {
              type: 'text',
              content: '**3. 异步回调**'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// 网络请求完成后执行\napi.getUser { user ->\n    textView.text = user.name\n    updateUI(user)\n}\n\n// 数据库查询完成后执行\ndatabase.query { results ->\n    showResults(results)\n}'
            },
            {
              type: 'text',
              content: '## 实战：理解 Lambda 的执行时机'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// [错误] 误以为 Lambda 立即执行\nbutton.setOnClickListener { \n    val data = fetchDataFromNetwork()  // 网络请求！会卡住 UI\n}\n\n// [正确] Lambda 在点击时才执行\nbutton.setOnClickListener { \n    // 这里的代码等用户点击按钮时才运行\n    viewModel.loadData()  // 异步加载，不会卡 UI\n}'
            },
            {
              type: 'warning',
              content: '**重点：Lambda 中的代码不是立即执行，而是在特定时机执行**\n\n- 点击事件：用户点击时执行\n- 列表操作：遍历每个元素时执行\n- 异步回调：数据返回时执行'
            },
            {
              type: 'text',
              content: '## 速查表：函数与 Lambda\n\n忘记了随时回来看：'
            },
            {
              type: 'code',
              language: 'text',
              content: '函数定义       → fun 函数名(参数: 类型): 返回类型 { ... }\n单表达式函数   → fun add(a: Int, b: Int) = a + b\n默认参数       → fun greet(name: String = "用户")\n命名参数       → greet(greeting = "晚安")\nLambda 语法    → { 参数 -> 函数体 } 或 { it }\n按钮点击       → button.setOnClickListener { ... }\n列表过滤       → list.filter { it > 2 }\n列表转换       → list.map { it * 2 }\n异步回调       → api.getUser { user -> ... }'
            }
          ]
        },
        {
          id: 'kotlin-null-safety',
          title: '空安全（Kotlin 核心特性）',
          description: '?. / ?: / !! / lateinit - 防止 App 崩溃',
          duration: 18,
          contents: [
            {
              type: 'text',
              content: '## 为什么要学空安全？\n\n想象一下：你写了一个显示用户昵称的功能，测试时发现 App 崩溃了。'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: 'fun showUserProfile(userId: String) {\n    val user = database.getUser(userId)\n    textView.text = "欢迎：${user.nickname}"  // 崩溃！\n}\n\n// Logcat 显示：\n// NullPointerException: Attempt to read from field \'String User.nickname\' on a null object'
            },
            {
              type: 'text',
              content: '**问题：** 用户没设置昵称，`nickname` 是 `null`，但代码直接使用了它。\n\n在 Java/JavaScript 里，这种错误只能运行时发现。Kotlin 从语言层面解决了这个问题。'
            },
            {
              type: 'tip',
              content: '**JS 开发者注意**：Kotlin 的 `?.` 就像 TS 的 Optional Chaining，但编译器会强制你处理 null，不给你崩溃的机会。'
            },
            {
              type: 'text',
              content: '## 基础：认识可空类型 `?`\n\nKotlin 用类型上的 `?` 区分"保证有值"和"可能是 null"：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// 保证有值（不会是 null）\nval appName: String = "Android学习"\nprintln(appName.length)  // 输出: 10（永远安全）\n\n// 可能是 null（类型后面有 ?）\nval nickname: String? = getUserNickname()  // 注意这个问号！\n// println(nickname.length)  // 编译错误！Kotlin 不让你直接用'
            },
            {
              type: 'text',
              content: '看到 `String?`、`User?`、`List<User>?` 就知道"这个变量可能是 null，需要特殊处理"。'
            },
            {
              type: 'text',
              content: '## 处理方式1：安全调用 `?.`\n\n**含义：** 如果不是 null 就调用，否则返回 null（不会崩溃）。'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: 'val nickname: String? = getUserNickname()\n\n// 安全写法\nval length = nickname?.length  // nickname 是 null 时，返回 null\nprintln(length)  // 如果 nickname 是 null，输出: null\n\n// 链式调用也安全\nval firstChar = nickname?.uppercase()?.first()  // 任何一步 null 就返回 null\nprintln(firstChar)  // 如果 nickname 是 null，输出: null'
            },
            {
              type: 'tip',
              content: '`?.` 是 Kotlin 最常用的空安全操作符，代码里到处都是。'
            },
            {
              type: 'text',
              content: '## 处理方式2：提供默认值 `?:`\n\n**含义：** 如果是 null 就用右边的默认值。'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: 'val nickname: String? = null\n\n// null 时用默认值\nval displayName = nickname ?: "游客"  \nprintln("欢迎：$displayName")  // 输出: 欢迎：游客\n\n// Android 中最常见的用法\nval userName = intent.getStringExtra("user_name") ?: "未知用户"\nval userId = intent.getIntExtra("user_id", -1)'
            },
            {
              type: 'tip',
              content: '**JS 开发者注意**：`?:` 就像 JS 的 `??`（Nullish Coalescing），非常常用。'
            },
            {
              type: 'text',
              content: '## 危险操作：强制断言 `!!`\n\n**含义：** 告诉编译器"我保证这个变量不是 null"。如果实际是 null → 直接崩溃！'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// [错误] 危险写法（容易崩溃）\nval user = database.getUser(userId!!)  // userId 是 null → 崩溃\ntextView.text = user!!.name            // user 是 null → 崩溃\n\n// [正确] 安全写法\nval user = userId?.let { database.getUser(it) } ?: return\ntextView.text = user.name  // 这里 user 保证非空'
            },
            {
              type: 'warning',
              content: '**重点：看到 `!!` 就要小心！**\n\n99% 的情况下应该改成：\n- `user!!.name` → `user?.name ?: "默认值"`\n- `userId!!` → `userId ?: return`\n\n`!!` 就像在说"我不管了，出问题就崩溃吧"，是最不安全的写法。'
            },
            {
              type: 'text',
              content: '## Android 特有：延迟初始化 `lateinit`\n\n**场景：** Activity 中的 ViewBinding 必须在 `onCreate` 才能初始化。'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// Activity 代码中最常见的用法\nclass MainActivity : AppCompatActivity() {\n    private lateinit var binding: ActivityMainBinding  // 稍后初始化\n    \n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        binding = ActivityMainBinding.inflate(layoutInflater)  // 这里初始化\n        \n        // 之后可以直接用，不需要 ?.\n        binding.button.setOnClickListener { }\n        binding.textView.text = "Hello"\n    }\n}'
            },
            {
              type: 'tip',
              content: '`lateinit` 告诉编译器："我保证在用之前会初始化，别逼我写 `?`"。主要用于 ViewBinding、依赖注入等场景。'
            },
            {
              type: 'text',
              content: '## 实战：3 种常见问题\n\n结合上面学的知识，看看这些代码有什么问题：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// [错误] 问题1：滥用 !!\nval userName = intent.getStringExtra("name")!!\n// [正确] 改进：val userName = intent.getStringExtra("name") ?: "默认值"\n\n// [错误] 问题2：ViewBinding 用可空类型\nprivate var binding: ActivityMainBinding? = null\n// [正确] 改进：private lateinit var binding: ActivityMainBinding\n\n// [错误] 问题3：不处理 null 直接用\nval user = database.getUser(id)\ntextView.text = user.name  // user 可能是 null\n// [正确] 改进：textView.text = user?.name ?: "未知用户"'
            },
            {
              type: 'text',
              content: '## 速查表：空安全操作符\n\n忘记了随时回来看：'
            },
            {
              type: 'code',
              language: 'text',
              content: '?     → 标记可空类型            String? = null\n?.    → 安全调用                user?.name\n?:    → 提供默认值              name ?: "游客"\n!!    → 强制断言（危险，慎用）   name!!\nlateinit → 延迟初始化          lateinit var binding'
            },
            {
              type: 'warning',
              content: '**一句话总结：**\n\n**"`!!` 越少越好，`?.` 和 `?:` 越多越安全。"**\n\n遇到 `!!` 先想想能不能改成 `?.` 或 `?:`。实在改不了，至少要确认"这里 100% 不会是 null"。'
            },
            {
              type: 'tip',
              content: '**下节预告：** 学完类与对象后，你会遇到 `data class User(val nickname: String?)`。空安全是贯穿整个 Android 开发的基础，慢慢就习惯了。'
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
              content: '// 基本的类\nclass User(val name: String, var age: Int) {\n    // 方法\n    fun introduce() = "我是 $name，$age 岁"\n}\n\n// 使用\nval user = User("张三", 25)\nprintln(user.name)        // 输出: 张三\nprintln(user.introduce()) // 输出: 我是 张三，25 岁'
            },
            {
              type: 'text',
              content: '## data class：数据类（非常常用）\n\n用于存储数据的类。AI 生成的数据模型几乎都是 data class。'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// 定义数据类\ndata class User(\n    val id: Int,\n    val name: String,\n    val email: String\n)\n\n// 自动获得这些功能：\nval user1 = User(1, "张三", "zhangsan@example.com")\nval user2 = User(1, "张三", "zhangsan@example.com")\n\nprintln(user1 == user2)  // 输出: true（自动比较所有属性）\nprintln(user1)           // 输出: User(id=1, name=张三, email=zhangsan@example.com)\n\n// copy - 复制并修改部分属性\nval user3 = user1.copy(name = "李四")  // 只改名字\nprintln(user3)  // 输出: User(id=1, name=李四, email=zhangsan@example.com)'
            },
            {
              type: 'text',
              content: '## object：单例对象\n\n整个应用只有一个实例的对象。'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// object - 单例\nobject AppConfig {\n    val apiUrl = "https://api.example.com"\n    var isDebug = false\n}\n\n// 直接使用，不需要创建实例\nprintln(AppConfig.apiUrl)  // 输出: https://api.example.com\nAppConfig.isDebug = true\nprintln(AppConfig.isDebug)  // 输出: true\n\n// companion object - 类的伴生对象（类似静态成员）\nclass User(val name: String) {\n    companion object {\n        fun create(name: String) = User(name)\n    }\n}\n\nval user = User.create("张三")  // 不需要先创建 User 实例\nprintln(user.name)  // 输出: 张三'
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
              content: '// 创建列表\nval fruits = listOf("苹果", "香蕉", "橙子")  // 不可变\nval numbers = mutableListOf(1, 2, 3)         // 可变\n\n// 访问元素\nprintln(fruits[0])          // 输出: 苹果\nprintln(fruits.first())     // 输出: 苹果\nprintln(fruits.last())      // 输出: 橙子\n\n// 修改可变列表\nnumbers.add(4)              // [1, 2, 3, 4]\nprintln(numbers)            // 输出: [1, 2, 3, 4]\nnumbers.remove(2)           // [1, 3, 4]\nprintln(numbers)            // 输出: [1, 3, 4]\n\n// Map\nval user = mapOf(\n    "name" to "张三",\n    "age" to 25\n)\nprintln(user["name"])       // 输出: 张三'
            },
            {
              type: 'text',
              content: '## 常用操作（必须认识）\n\n| 操作 | 作用 | 示例 |\n|-----|------|------|\n| `filter` | 过滤 | `list.filter { it > 0 }` |\n| `map` | 转换 | `list.map { it * 2 }` |\n| `find` | 查找第一个 | `list.find { it > 5 }` |\n| `any` | 是否有满足条件的 | `list.any { it > 10 }` |\n| `all` | 是否全部满足 | `list.all { it > 0 }` |\n| `sortedBy` | 排序 | `list.sortedBy { it.name }` |'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: 'data class User(val name: String, val age: Int)\n\nval users = listOf(\n    User("张三", 25),\n    User("李四", 30),\n    User("王五", 20)\n)\n\n// 过滤：找出年龄大于 22 的用户\nval adults = users.filter { it.age > 22 }\nprintln(adults)  // 输出: [User(张三, 25), User(李四, 30)]\n\n// 转换：提取所有用户名\nval names = users.map { it.name }\nprintln(names)  // 输出: [张三, 李四, 王五]\n\n// 查找：找第一个年龄大于 25 的\nval found = users.find { it.age > 25 }\nprintln(found)  // 输出: User(李四, 30)\n\n// 排序：按年龄排序\nval sorted = users.sortedBy { it.age }\nprintln(sorted)  // 输出: [User(王五, 20), User(张三, 25), User(李四, 30)]\n\n// 链式调用 - 非常常见\nval result = users\n    .filter { it.age >= 20 }\n    .sortedBy { it.age }\n    .map { it.name }\nprintln(result)  // 输出: [王五, 张三, 李四]'
            },
            {
              type: 'tip',
              content: '**链式调用**是 Kotlin 的特色。AI 经常生成这样的代码，你需要能一行行读懂每一步在做什么。'
            }
          ]
        }
      ]
    },
    {
      id: 'android-architecture',
      title: 'Android 架构基础',
      lessons: [
        {
          id: 'viewmodel-lifecycle',
          title: 'ViewModel 与生命周期',
          description: 'ViewModel、lifecycleScope、viewModelScope',
          duration: 15,
          contents: [
            {
              type: 'text',
              content: '## 你遇到过这个问题吗？\n\n你做了一个计数器 App，用户点了 100 次按钮，然后把手机横过来...\n\n数据没了。计数器回到 0。\n\n这是因为屏幕旋转时，Android 会销毁并重建 Activity，Activity 中的变量全部清空。ViewModel 就是为了解决这个问题。'
            },
            {
              type: 'tip',
              content: '**JS 开发者注意**：这就像 React 组件卸载再重新挂载，`useState` 的值全丢了。ViewModel 类似把状态放在组件外部（如 Redux Store），不受组件重建影响。'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// ❌ 数据放在 Activity 中：屏幕旋转后 count 变成 0\nclass MainActivity : AppCompatActivity() {\n    private var count = 0  // 旋转后丢失！\n    \n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        println("当前计数: $count")  // 每次旋转都输出: 0\n    }\n}\n\n// ✅ 数据放在 ViewModel 中：屏幕旋转后 count 保留\nclass CounterViewModel : ViewModel() {\n    private var count = 0  // ViewModel 不会被销毁\n    \n    fun getCount() = count\n    fun increment() { count++ }\n}\n\nclass MainActivity : AppCompatActivity() {\n    private val viewModel: CounterViewModel by viewModels()\n    \n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        // 即使屏幕旋转，count 的值也会保留\n        println("当前计数: ${viewModel.getCount()}")  // 输出: 100\n    }\n}'
            },
            {
              type: 'text',
              content: '## ViewModel 的核心职责\n\n| 职责 | 说明 |\n|------|------|\n| 保存 UI 数据 | 屏幕旋转、配置更改时数据不丢失 |\n| 分离业务逻辑 | Activity 只负责显示，ViewModel 处理数据 |\n| 管理协程 | 提供 `viewModelScope`，自动取消 |'
            },
            {
              type: 'text',
              content: '## 生命周期对比\n\n```mermaid\nsequenceDiagram\n    participant Activity\n    participant ViewModel\n    \n    Activity->>ViewModel: 创建\n    Note over Activity: 用户使用中...\n    Activity->>Activity: 屏幕旋转（销毁重建）\n    Note over ViewModel: 继续存在，数据保留\n    Activity->>ViewModel: 重新连接\n    Note over Activity: 用户退出\n    Activity->>ViewModel: 真正销毁\n```\n\nViewModel 的生命周期比 Activity 更长——它在 Activity 因配置更改销毁重建时继续存在，直到 Activity **真正结束**才销毁。'
            },
            {
              type: 'text',
              content: '## 协程作用域：viewModelScope vs lifecycleScope\n\n协程需要绑定到"作用域"，组件销毁时协程会自动取消，避免内存泄漏。\n\n| 作用域 | 绑定到 | 使用场景 |\n|--------|--------|----------|\n| `viewModelScope` | ViewModel | 数据加载、网络请求（推荐） |\n| `lifecycleScope` | Activity/Fragment | 纯 UI 动画等短期任务 |'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// ✅ 在 ViewModel 中用 viewModelScope（推荐）\nclass UserViewModel : ViewModel() {\n    fun loadUser() {\n        viewModelScope.launch {\n            // ViewModel 销毁时自动取消\n            val user = fetchUserFromServer()\n            println("用户: ${user.name}")\n        }\n    }\n}\n\n// ✅ 在 Activity 中用 lifecycleScope（短期 UI 操作）\nclass MainActivity : AppCompatActivity() {\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        lifecycleScope.launch {\n            // Activity 销毁时自动取消\n            val data = loadData()\n            updateUI(data)\n        }\n    }\n}\n\n// ❌ 永远不要用 GlobalScope\nGlobalScope.launch {\n    // 不会自动取消！Activity 销毁后仍在运行 → 内存泄漏\n    val data = fetchData()\n}'
            },
            {
              type: 'warning',
              content: '**永远不要用 `GlobalScope.launch`！** 它不会自动取消，容易导致内存泄漏。看到 `GlobalScope` 就改成 `viewModelScope` 或 `lifecycleScope`。'
            },
            {
              type: 'tip',
              content: '**经验法则**：网络请求、数据库操作 → `viewModelScope`（在 ViewModel 中）；纯 UI 动画、短期显示 → `lifecycleScope`（在 Activity/Fragment 中）。'
            },
            {
              type: 'text',
              content: '## 速查表\n\n忘记了随时回来看：'
            },
            {
              type: 'code',
              language: 'text',
              content: 'ViewModel          → 存放 UI 数据和业务逻辑，屏幕旋转不丢失\nby viewModels()    → 在 Activity 中获取 ViewModel 实例\nviewModelScope     → ViewModel 的协程作用域，自动取消\nlifecycleScope     → Activity/Fragment 的协程作用域，自动取消\nGlobalScope        → ❌ 禁止使用，不会自动取消'
            }
          ]
        }
      ]
    },
    {
      id: 'async-programming',
      title: '异步编程',
      lessons: [
        {
          id: 'kotlin-coroutines',
          title: '协程入门（重点）',
          description: 'suspend、launch、async、Flow、异步编程',
          duration: 25,
          contents: [
            {
              type: 'text',
              content: '## 你的 App 为什么卡住了？\n\n想象你做了一个天气 App，点击"刷新"按钮后，整个页面冻住了——不能滑动、不能点击，过了几秒才恢复。\n\n原因：网络请求在主线程执行，阻塞了 UI 渲染。协程就是解决这个问题的工具。'
            },
            {
              type: 'warning',
              content: '**Android 铁律**：不能在主线程执行耗时操作（网络请求、数据库读写、文件操作）！否则应用会 ANR（Application Not Responding）。'
            },
            {
              type: 'tip',
              content: '**JS 开发者注意**：Kotlin 协程 ≈ JS 的 async/await。`suspend` 就像 `async function`，`launch` 就像调用异步函数。但 Kotlin 协程更强大，内置了取消和作用域管理。'
            },
            {
              type: 'text',
              content: '## 回调地狱 vs 协程'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// ❌ 传统回调：嵌套越来越深（回调地狱）\ngetUser { user ->\n    getOrders(user.id) { orders ->\n        getOrderDetails(orders[0].id) { details ->\n            // 继续嵌套...\n        }\n    }\n}\n\n// ✅ 协程：像同步代码一样清晰\nsuspend fun loadData() {\n    val user = getUser()                        // 等待完成\n    val orders = getOrders(user.id)             // 等待完成\n    val details = getOrderDetails(orders[0].id) // 等待完成\n    // 顺序执行，没有嵌套\n}'
            },
            {
              type: 'text',
              content: '## 核心概念一览\n\n| 关键字 | 作用 | JS 类比 |\n|-------|------|--------|\n| `suspend` | 标记可暂停的函数 | `async function` |\n| `launch` | 启动协程，不返回结果 | 调用 async 函数不 await |\n| `async` | 启动协程，返回结果 | `Promise` |\n| `await()` | 等待 async 的结果 | `await` |\n| `Flow` | 持续数据流 | `Observable` / `AsyncIterable` |'
            },
            {
              type: 'text',
              content: '## suspend 函数\n\n`suspend` 标记的函数可以"暂停"执行，等待耗时操作完成后继续，不会阻塞线程：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// 定义 suspend 函数\nsuspend fun fetchUser(): User {\n    delay(1000)  // 模拟网络延迟 1 秒（不阻塞线程）\n    return User("张三", 25)\n}\n\n// 在协程中调用\nviewModelScope.launch {\n    val user = fetchUser()  // 暂停 1 秒，然后继续\n    println(user.name)      // 输出: 张三\n}\n\n// ❌ 不能在普通函数中直接调用 suspend 函数\n// fetchUser()  // 编译错误！必须在协程中调用'
            },
            {
              type: 'text',
              content: '## launch：启动协程\n\n`launch` 启动一个不需要返回值的协程，最常用：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// 典型用法：在 ViewModel 中加载数据\nclass UserViewModel : ViewModel() {\n    fun loadUser() {\n        viewModelScope.launch {\n            try {\n                val user = fetchUser()  // suspend 函数\n                println("加载成功: ${user.name}")\n            } catch (e: Exception) {\n                println("加载失败: ${e.message}")\n            }\n        }\n    }\n}'
            },
            {
              type: 'text',
              content: '## async/await：并发请求\n\n需要同时发起多个请求时，用 `async` 并行执行：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// 场景：同时加载用户信息和订单列表\nviewModelScope.launch {\n    // async 启动并行任务\n    val userTask = async { fetchUser() }       // 请求1：耗时 1 秒\n    val ordersTask = async { fetchOrders() }   // 请求2：耗时 1 秒\n    \n    // await 等待结果（并行执行，总耗时约 1 秒而非 2 秒）\n    val user = userTask.await()\n    val orders = ordersTask.await()\n    \n    println("${user.name} 有 ${orders.size} 个订单")\n}\n\n// 对比：顺序执行需要 2 秒\nviewModelScope.launch {\n    val user = fetchUser()       // 等 1 秒\n    val orders = fetchOrders()   // 再等 1 秒\n    // 总共 2 秒\n}'
            },
            {
              type: 'tip',
              content: '**何时用 async？** 多个请求互不依赖时，用 async 并行可以节省时间。如果后一个请求依赖前一个的结果，就用普通顺序调用。'
            },
            {
              type: 'text',
              content: '## Flow：持续数据流\n\nFlow 用于持续观察数据变化，适合倒计时、实时消息等场景：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// 创建 Flow：倒计时\nfun countDown(): Flow<Int> = flow {\n    for (i in 5 downTo 0) {\n        emit(i)       // 发送数据\n        delay(1000)   // 等待 1 秒\n    }\n}\n\n// 收集 Flow 数据\nviewModelScope.launch {\n    countDown().collect { number ->\n        println("倒计时: $number")  // 每秒输出一次\n    }\n}\n// 输出: 倒计时: 5 → 4 → 3 → 2 → 1 → 0'
            },
            {
              type: 'text',
              content: '## 常见错误对比'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// ❌ 错误1：在主线程做网络请求\nfun loadUser() {\n    val user = api.getUser()  // 崩溃！NetworkOnMainThreadException\n}\n// ✅ 正确：用协程\nfun loadUser() {\n    viewModelScope.launch {\n        val user = api.getUser()  // 在协程中调用 suspend 函数\n    }\n}\n\n// ❌ 错误2：用 GlobalScope（不会自动取消）\nGlobalScope.launch { fetchData() }\n// ✅ 正确：用 viewModelScope\nviewModelScope.launch { fetchData() }\n\n// ❌ 错误3：忘记处理异常\nviewModelScope.launch {\n    val user = fetchUser()  // 网络出错直接崩溃\n}\n// ✅ 正确：try-catch\nviewModelScope.launch {\n    try {\n        val user = fetchUser()\n    } catch (e: Exception) {\n        showError(e.message ?: "请求失败")\n    }\n}'
            },
            {
              type: 'text',
              content: '## 速查表\n\n忘记了随时回来看：'
            },
            {
              type: 'code',
              language: 'text',
              content: 'suspend fun        → 可暂停函数，只能在协程中调用\nlaunch { }         → 启动协程，不返回结果（最常用）\nasync { }          → 启动协程，返回 Deferred\nawait()            → 获取 async 的结果\nflow { emit(x) }   → 创建数据流\ncollect { }        → 收集 Flow 数据\nviewModelScope     → ViewModel 中启动协程（推荐）\ntry-catch          → 协程中的异常处理（必须加）'
            }
          ]
        }
      ]
    },
    {
      id: 'state-management',
      title: '状态管理',
      lessons: [
        {
          id: 'stateflow-basics',
          title: 'StateFlow 状态管理',
          description: 'ViewModel 中的状态管理方案',
          duration: 15,
          contents: [
            {
              type: 'text',
              content: '## ViewModel 有了数据，UI 怎么知道？\n\n上一课学了 ViewModel 保存数据，但还有一个问题：数据变化时，UI 怎么自动更新？\n\n比如用户点了"加载"按钮，ViewModel 从服务器拿到了新数据，页面怎么自动刷新？\n\n答案是 **StateFlow**——一种"可观察的状态容器"。'
            },
            {
              type: 'tip',
              content: '**JS 开发者注意**：StateFlow 就像 React 的 `useState`。`MutableStateFlow` ≈ `setState`（可修改），`StateFlow` ≈ 组件读取的 `state`（只读）。数据变了，UI 自动更新。'
            },
            {
              type: 'text',
              content: '## StateFlow 的特点\n\n| 特点 | 说明 |\n|------|------|\n| 总有值 | 创建时必须提供初始值（不会是 null） |\n| 只保存最新值 | 新订阅者立即收到当前值 |\n| 自动去重 | 相同的值不会重复触发 UI 更新 |\n| 线程安全 | 可在任何线程读写 |'
            },
            {
              type: 'text',
              content: '## 核心模式：私有可变 + 公开只读\n\n```mermaid\ngraph LR\n    A[用户操作] --> B[调用 ViewModel 方法]\n    B --> C[修改 MutableStateFlow]\n    C --> D[StateFlow 通知 UI]\n    D --> E[UI 自动更新]\n```\n\nViewModel 内部用 `MutableStateFlow`（可改），对外暴露 `StateFlow`（只读），防止 UI 层直接改数据：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: 'class CounterViewModel : ViewModel() {\n    // 私有：ViewModel 内部可以修改\n    private val _count = MutableStateFlow(0)\n    // 公开：UI 层只能读取，不能修改\n    val count: StateFlow<Int> = _count.asStateFlow()\n    \n    fun increment() { _count.value++ }\n    fun decrement() { _count.value-- }\n    fun reset() { _count.value = 0 }\n}'
            },
            {
              type: 'text',
              content: '## 在 Compose 中观察状态\n\n`collectAsState()` 让 Compose 自动订阅 StateFlow，数据变了 UI 自动刷新：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '@Composable\nfun CounterScreen(viewModel: CounterViewModel) {\n    val count by viewModel.count.collectAsState()  // 自动订阅\n    \n    Column {\n        Text("计数: $count")  // count 变化时自动更新\n        Button(onClick = { viewModel.increment() }) { Text("加一") }\n        Button(onClick = { viewModel.reset() }) { Text("重置") }\n    }\n}'
            },
            {
              type: 'text',
              content: '## 实战：用 sealed class 管理加载状态\n\n真实项目中，一个页面通常有三种状态：加载中、成功、失败。用 sealed class + StateFlow 优雅处理：'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// 定义三种状态\nsealed class UiState<out T> {\n    object Loading : UiState<Nothing>()\n    data class Success<T>(val data: T) : UiState<T>()\n    data class Error(val message: String) : UiState<Nothing>()\n}\n\n// ViewModel：管理加载状态\nclass UserViewModel : ViewModel() {\n    private val _state = MutableStateFlow<UiState<User>>(UiState.Loading)\n    val state: StateFlow<UiState<User>> = _state.asStateFlow()\n    \n    fun loadUser(userId: String) {\n        viewModelScope.launch {\n            _state.value = UiState.Loading\n            try {\n                val user = fetchUser(userId)\n                _state.value = UiState.Success(user)\n            } catch (e: Exception) {\n                _state.value = UiState.Error(e.message ?: "加载失败")\n            }\n        }\n    }\n}\n\n// UI：根据状态显示不同内容\n@Composable\nfun UserScreen(viewModel: UserViewModel) {\n    val state by viewModel.state.collectAsState()\n    \n    when (state) {\n        is UiState.Loading -> CircularProgressIndicator()\n        is UiState.Success -> Text("用户: ${(state as UiState.Success).data.name}")\n        is UiState.Error -> Text("错误: ${(state as UiState.Error).message}", color = Color.Red)\n    }\n}'
            },
            {
              type: 'text',
              content: '## 常见错误对比'
            },
            {
              type: 'code',
              language: 'kotlin',
              content: '// ❌ 错误：把 MutableStateFlow 直接暴露给 UI\nclass BadViewModel : ViewModel() {\n    val count = MutableStateFlow(0)  // UI 可以随意修改！\n}\n\n// ✅ 正确：私有可变 + 公开只读\nclass GoodViewModel : ViewModel() {\n    private val _count = MutableStateFlow(0)\n    val count: StateFlow<Int> = _count.asStateFlow()\n    fun increment() { _count.value++ }\n}'
            },
            {
              type: 'warning',
              content: '**不要把 MutableStateFlow 暴露给 UI 层！** 始终用 `_state`（私有可变）+ `state`（公开只读）的模式，保证数据流向是单向的：ViewModel → UI。'
            },
            {
              type: 'tip',
              content: '**最佳实践**：ViewModel 内部 `MutableStateFlow` + 暴露 `StateFlow`；用 sealed class 定义 Loading/Success/Error 状态；在 Compose 中用 `collectAsState()` 观察。'
            },
            {
              type: 'text',
              content: '## 速查表\n\n忘记了随时回来看：'
            },
            {
              type: 'code',
              language: 'text',
              content: 'MutableStateFlow(初始值)   → 可修改的状态（ViewModel 内部用）\n.asStateFlow()             → 转为只读 StateFlow（暴露给 UI）\n_state.value = x           → 更新状态\ncollectAsState()           → 在 Compose 中观察状态变化\nsealed class UiState       → 定义 Loading / Success / Error\nwhen (state) { ... }       → 根据状态显示不同 UI'
            }
          ]
        }
      ]
    }
  ]
}
