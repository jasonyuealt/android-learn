/**
 * 第四阶段：架构进阶
 * MVVM、依赖注入、Navigation
 */

import type { Phase } from './types'

export const phase4: Phase = {
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
}
