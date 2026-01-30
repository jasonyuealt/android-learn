/**
 * 第五阶段：实战项目
 * 完整项目开发、发布上架
 */

import type { Phase } from './types'

export const phase5: Phase = {
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
