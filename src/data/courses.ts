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
 */
export const courseData: Phase[] = [
  {
    id: 'phase-1',
    name: '基础入门',
    description: 'Kotlin 语法、开发环境、第一个 App',
    iconName: 'Smartphone',
    colorType: 'green',
    modules: [
      {
        id: 'kotlin-basics',
        title: 'Kotlin 基础',
        lessons: [
          {
            id: 'kotlin-intro',
            title: 'Kotlin 语言简介',
            description: '了解 Kotlin 的历史、特点和为什么 Android 选择它',
            duration: 15,
            contents: [
              {
                type: 'text',
                content: '## 什么是 Kotlin？\n\nKotlin 是由 JetBrains 开发的现代编程语言，2017 年被 Google 宣布为 Android 官方开发语言。它运行在 JVM 上，与 Java 完全兼容，但语法更简洁、更安全。'
              },
              {
                type: 'tip',
                content: '在 AI 时代，你不需要从零开始写代码。但理解 Kotlin 的核心概念能帮助你更好地与 AI 协作，理解生成的代码。'
              },
              {
                type: 'text',
                content: '## Kotlin 的优势\n\n1. **空安全** - 从语言层面避免空指针异常\n2. **简洁** - 比 Java 减少约 40% 的代码量\n3. **协程** - 原生支持异步编程\n4. **与 Java 互操作** - 可以在同一项目中混用'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// Java 写法\nString name = null;\nif (name != null) {\n    int length = name.length();\n}\n\n// Kotlin 写法 - 更简洁安全\nval name: String? = null\nval length = name?.length // 安全调用，不会崩溃'
              }
            ]
          },
          {
            id: 'kotlin-variables',
            title: '变量与类型',
            description: '学习 val/var、基本类型、类型推断',
            duration: 20,
            contents: [
              {
                type: 'text',
                content: '## 变量声明\n\nKotlin 有两种变量声明方式：\n- `val` - 不可变变量（推荐优先使用）\n- `var` - 可变变量'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 不可变变量 - 一旦赋值就不能改变\nval name = "Android"  // 类型自动推断为 String\nval age: Int = 10     // 显式指定类型\n\n// 可变变量 - 可以重新赋值\nvar count = 0\ncount = count + 1  // OK\n\n// name = "iOS"  // 错误！val 不能重新赋值'
              },
              {
                type: 'tip',
                content: '优先使用 val！不可变性让代码更安全、更容易理解。只有确实需要修改时才用 var。'
              },
              {
                type: 'text',
                content: '## 基本类型\n\n- **整数**: `Int`, `Long`, `Short`, `Byte`\n- **浮点数**: `Double`, `Float`\n- **布尔**: `Boolean`\n- **字符**: `Char`\n- **字符串**: `String`'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 数字类型\nval intValue: Int = 42\nval longValue: Long = 42L\nval doubleValue: Double = 3.14\nval floatValue: Float = 3.14f\n\n// 字符串模板 - 非常实用！\nval name = "Kotlin"\nval message = "Hello, $name!"  // "Hello, Kotlin!"\nval calc = "1 + 1 = ${1 + 1}"  // "1 + 1 = 2"'
              }
            ]
          },
          {
            id: 'kotlin-functions',
            title: '函数与 Lambda',
            description: '函数定义、参数、返回值、Lambda 表达式',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## 函数定义\n\n使用 `fun` 关键字定义函数。Kotlin 支持默认参数和命名参数，让函数调用更灵活。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 基本函数\nfun greet(name: String): String {\n    return "Hello, $name!"\n}\n\n// 单表达式函数 - 简洁写法\nfun greet(name: String) = "Hello, $name!"\n\n// 默认参数\nfun greet(name: String = "World") = "Hello, $name!"\ngreet()        // "Hello, World!"\ngreet("Kotlin") // "Hello, Kotlin!"\n\n// 命名参数\nfun createUser(name: String, age: Int, email: String) { }\ncreateUser(name = "张三", age = 25, email = "test@example.com")'
              },
              {
                type: 'text',
                content: '## Lambda 表达式\n\nLambda 是匿名函数，在 Android 开发中大量使用（如点击事件、回调等）。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// Lambda 基本语法: { 参数 -> 函数体 }\nval sum = { a: Int, b: Int -> a + b }\nsum(1, 2)  // 3\n\n// 在 Android 中的典型用法\nbutton.setOnClickListener { view ->\n    // 处理点击事件\n    Toast.makeText(context, "Clicked!", Toast.LENGTH_SHORT).show()\n}\n\n// 如果只有一个参数，可以用 it 代替\nval numbers = listOf(1, 2, 3, 4, 5)\nnumbers.filter { it > 2 }  // [3, 4, 5]\nnumbers.map { it * 2 }     // [2, 4, 6, 8, 10]'
              },
              {
                type: 'tip',
                content: 'Lambda 在 Android 中无处不在！按钮点击、网络回调、列表操作都会用到。多练习几遍就能掌握。'
              }
            ]
          },
          {
            id: 'kotlin-null-safety',
            title: '空安全',
            description: '可空类型、安全调用、Elvis 操作符',
            duration: 20,
            contents: [
              {
                type: 'text',
                content: '## 为什么空安全很重要？\n\n空指针异常（NullPointerException）是 Java 程序最常见的崩溃原因。Kotlin 从语言层面解决了这个问题。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 默认不可为空\nvar name: String = "Kotlin"\n// name = null  // 编译错误！\n\n// 可空类型 - 加 ? 表示可以为 null\nvar nullableName: String? = "Kotlin"\nnullableName = null  // OK\n\n// 安全调用 ?. \nval length = nullableName?.length  // null 时返回 null，不崩溃\n\n// Elvis 操作符 ?:\nval len = nullableName?.length ?: 0  // null 时返回默认值 0\n\n// 非空断言 !!（慎用！可能崩溃）\nval len2 = nullableName!!.length  // 如果为 null 会崩溃'
              },
              {
                type: 'warning',
                content: '尽量避免使用 !! 非空断言。如果你确定不为空，通常有更好的方式来处理，比如使用 let 或 require。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 更安全的空值处理\nfun processUser(user: User?) {\n    // 方式1: let - 只在非空时执行\n    user?.let { u ->\n        println("用户名: ${u.name}")\n        println("年龄: ${u.age}")\n    }\n    \n    // 方式2: if 判断后智能转换\n    if (user != null) {\n        // 这里 user 自动变成非空类型\n        println(user.name)\n    }\n    \n    // 方式3: 提前返回\n    val u = user ?: return\n    println(u.name)\n}'
              }
            ]
          }
        ]
      },
      {
        id: 'android-env',
        title: '开发环境搭建',
        lessons: [
          {
            id: 'install-as',
            title: '安装 Android Studio',
            description: '下载安装 Android Studio，配置开发环境',
            duration: 30,
            contents: [
              {
                type: 'text',
                content: '## 下载 Android Studio\n\n访问 [developer.android.com/studio](https://developer.android.com/studio) 下载最新版本的 Android Studio。'
              },
              {
                type: 'text',
                content: '## 系统要求\n\n- **Windows**: 64 位系统，8GB RAM（推荐 16GB）\n- **macOS**: 10.14 或更高版本，8GB RAM\n- **Linux**: 64 位系统，8GB RAM\n- **硬盘**: 至少 8GB 可用空间'
              },
              {
                type: 'tip',
                content: 'Android Studio 首次启动会下载 SDK 和组件，可能需要较长时间。建议使用稳定的网络环境。'
              },
              {
                type: 'text',
                content: '## 配置 SDK\n\n首次运行时，Android Studio 会引导你配置 SDK。选择标准安装即可，它会自动下载：\n- Android SDK\n- Android SDK Platform\n- Android Virtual Device（模拟器）'
              }
            ]
          },
          {
            id: 'first-project',
            title: '创建第一个项目',
            description: '新建项目，了解项目结构',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## 创建新项目\n\n1. 打开 Android Studio\n2. 点击 "New Project"\n3. 选择 "Empty Activity" 模板\n4. 配置项目信息'
              },
              {
                type: 'code',
                language: 'text',
                content: '项目配置说明：\n- Name: 应用名称（如 MyFirstApp）\n- Package name: 唯一标识符（如 com.example.myfirstapp）\n- Save location: 项目保存位置\n- Language: 选择 Kotlin\n- Minimum SDK: API 24 (Android 7.0) 是个好选择'
              },
              {
                type: 'text',
                content: '## 项目结构\n\n```\napp/\n├── src/main/\n│   ├── java/           # Kotlin/Java 代码\n│   ├── res/            # 资源文件\n│   │   ├── layout/     # 布局 XML\n│   │   ├── values/     # 字符串、颜色等\n│   │   └── drawable/   # 图片资源\n│   └── AndroidManifest.xml  # 应用配置\n├── build.gradle.kts    # 模块构建配置\n└── ...\n```'
              },
              {
                type: 'tip',
                content: '不需要记住所有文件的作用！随着学习深入，你会逐渐熟悉每个部分。现在只需要知道代码在 java/ 目录，布局在 res/layout/ 目录。'
              }
            ]
          },
          {
            id: 'run-app',
            title: '运行应用',
            description: '使用模拟器或真机运行应用',
            duration: 20,
            contents: [
              {
                type: 'text',
                content: '## 使用模拟器\n\n1. 点击 Tools > Device Manager\n2. 点击 "Create Device"\n3. 选择设备类型（推荐 Pixel 系列）\n4. 选择系统镜像（推荐最新稳定版）\n5. 完成创建，启动模拟器'
              },
              {
                type: 'text',
                content: '## 使用真机调试\n\n1. 在手机上开启"开发者选项"（设置 > 关于手机 > 连续点击"版本号"7次）\n2. 开启"USB 调试"\n3. 用 USB 连接电脑\n4. 信任电脑的调试请求'
              },
              {
                type: 'tip',
                content: '真机调试比模拟器更快、更真实。如果有备用 Android 手机，强烈推荐用真机开发。'
              },
              {
                type: 'text',
                content: '## 运行应用\n\n点击工具栏的绿色 ▶ 按钮（或按 Shift + F10），选择目标设备，等待编译和安装。\n\n恭喜！你已经成功运行了第一个 Android 应用！'
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
        id: 'ui-basics',
        title: 'UI 开发基础',
        lessons: [
          {
            id: 'layout-basics',
            title: '布局基础',
            description: '学习常用布局：LinearLayout、ConstraintLayout',
            duration: 30,
            contents: [
              {
                type: 'text',
                content: '## Android 布局系统\n\nAndroid 使用 XML 文件定义 UI 布局。布局文件放在 `res/layout/` 目录下。'
              },
              {
                type: 'text',
                content: '## 常用布局\n\n- **LinearLayout** - 线性布局，子元素垂直或水平排列\n- **ConstraintLayout** - 约束布局，灵活高效（推荐）\n- **FrameLayout** - 帧布局，子元素层叠\n- **RelativeLayout** - 相对布局（已被 ConstraintLayout 取代）'
              },
              {
                type: 'code',
                language: 'xml',
                content: '<!-- LinearLayout 示例 -->\n<LinearLayout\n    android:layout_width="match_parent"\n    android:layout_height="wrap_content"\n    android:orientation="vertical"\n    android:padding="16dp">\n    \n    <TextView\n        android:layout_width="wrap_content"\n        android:layout_height="wrap_content"\n        android:text="标题"\n        android:textSize="24sp" />\n    \n    <Button\n        android:id="@+id/myButton"\n        android:layout_width="match_parent"\n        android:layout_height="wrap_content"\n        android:text="点击我" />\n        \n</LinearLayout>'
              },
              {
                type: 'tip',
                content: 'match_parent = 填满父容器\nwrap_content = 包裹内容\ndp = 密度无关像素（布局用）\nsp = 可缩放像素（文字用）'
              }
            ]
          },
          {
            id: 'jetpack-compose-intro',
            title: 'Jetpack Compose 简介',
            description: '了解现代声明式 UI 框架',
            duration: 25,
            contents: [
              {
                type: 'text',
                content: '## 什么是 Jetpack Compose？\n\nJetpack Compose 是 Android 现代 UI 开发框架，使用 Kotlin 代码直接构建 UI，不再需要 XML。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// Compose 示例\n@Composable\nfun Greeting(name: String) {\n    Column(\n        modifier = Modifier\n            .fillMaxWidth()\n            .padding(16.dp)\n    ) {\n        Text(\n            text = "Hello, $name!",\n            fontSize = 24.sp,\n            fontWeight = FontWeight.Bold\n        )\n        \n        Button(\n            onClick = { /* 处理点击 */ }\n        ) {\n            Text("点击我")\n        }\n    }\n}'
              },
              {
                type: 'text',
                content: '## Compose 的优势\n\n1. **声明式** - 描述"是什么"而不是"怎么做"\n2. **更少代码** - 比 XML + Kotlin 减少约 50% 代码\n3. **实时预览** - 在 IDE 中即时看到效果\n4. **与 Kotlin 完美融合** - 使用 Kotlin 全部特性'
              },
              {
                type: 'tip',
                content: '新项目推荐使用 Jetpack Compose！但了解传统 XML 布局也很重要，因为很多现有项目还在使用。'
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
            description: '轻量级键值对存储',
            duration: 20,
            contents: [
              {
                type: 'text',
                content: '## SharedPreferences 简介\n\nSharedPreferences 是 Android 提供的轻量级键值对存储方案，适合保存简单的配置数据，如用户设置、登录状态等。'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// 保存数据\nval prefs = getSharedPreferences("my_prefs", Context.MODE_PRIVATE)\nprefs.edit().apply {\n    putString("username", "张三")\n    putInt("age", 25)\n    putBoolean("isLoggedIn", true)\n    apply()  // 异步保存\n}\n\n// 读取数据\nval username = prefs.getString("username", "默认值")\nval age = prefs.getInt("age", 0)\nval isLoggedIn = prefs.getBoolean("isLoggedIn", false)'
              },
              {
                type: 'warning',
                content: 'SharedPreferences 不适合存储大量数据或复杂对象。如需存储列表、对象等，请使用 Room 数据库。'
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
            description: '学习 Model-View-ViewModel 架构模式',
            duration: 30,
            contents: [
              {
                type: 'text',
                content: '## 什么是 MVVM？\n\nMVVM（Model-View-ViewModel）是 Android 官方推荐的架构模式：\n\n- **Model** - 数据层，负责获取和存储数据\n- **View** - UI 层，负责显示数据和用户交互\n- **ViewModel** - 连接层，持有 UI 状态，处理业务逻辑'
              },
              {
                type: 'code',
                language: 'kotlin',
                content: '// ViewModel 示例\nclass UserViewModel : ViewModel() {\n    \n    // UI 状态\n    private val _user = MutableLiveData<User>()\n    val user: LiveData<User> = _user\n    \n    // 加载数据\n    fun loadUser(userId: String) {\n        viewModelScope.launch {\n            val result = repository.getUser(userId)\n            _user.value = result\n        }\n    }\n}\n\n// Activity 中使用\nclass UserActivity : AppCompatActivity() {\n    private val viewModel: UserViewModel by viewModels()\n    \n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        \n        // 观察数据变化\n        viewModel.user.observe(this) { user ->\n            // 更新 UI\n            textView.text = user.name\n        }\n        \n        // 加载数据\n        viewModel.loadUser("123")\n    }\n}'
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
            id: 'todo-app',
            title: '待办清单项目',
            description: '从零开始开发一个完整的待办清单应用',
            duration: 120,
            contents: [
              {
                type: 'text',
                content: '## 项目概述\n\n在这个项目中，我们将开发一个功能完整的待办清单应用，涵盖：\n\n- Room 数据库\n- MVVM 架构\n- RecyclerView 列表\n- 添加/编辑/删除功能\n- 完成状态切换'
              },
              {
                type: 'tip',
                content: '这是一个完整的实战项目，建议跟着步骤一步步来。遇到问题可以借助 AI 帮助调试！'
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
