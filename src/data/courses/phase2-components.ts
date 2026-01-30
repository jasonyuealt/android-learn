/**
 * 第二阶段：核心组件
 * Activity、Fragment、UI 开发
 */

import type { Phase } from './types'

export const phase2: Phase = {
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
}
