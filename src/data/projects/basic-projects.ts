/**
 * 基础实战项目
 * Todo、天气、新闻
 */

import type { ProjectData } from '@/data/projects/types'

export const basicProjects: ProjectData[] = [
  {
    id: 'todo',
    name: '待办清单 Todo',
    description: '学习本地数据存储、MVVM 架构和列表展示的基础项目',
    iconName: 'CheckSquare',
    difficulty: 1,
    tags: ['Room', 'MVVM', '列表', 'RecyclerView'],
    estimatedHours: 8,
    overview: '待办清单是学习 Android 开发的经典入门项目。通过这个项目，你将掌握数据持久化、列表展示和基础架构模式。',
    features: [
      '添加新的待办事项',
      '标记完成/未完成',
      '编辑待办内容',
      '删除待办事项',
      '数据本地持久化',
      '按完成状态筛选'
    ],
    techStack: [
      'Kotlin',
      'Room Database',
      'ViewModel + LiveData',
      'RecyclerView',
      'Material Design'
    ],
    steps: [
      {
        title: '项目初始化',
        description: '创建新项目，添加必要的依赖',
        code: `// build.gradle.kts (Module: app)
dependencies {
    // Room
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")
    
    // ViewModel
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.7.0")
    
    // RecyclerView
    implementation("androidx.recyclerview:recyclerview:1.3.2")
}`,
        language: 'kotlin'
      },
      {
        title: '定义数据模型',
        description: '创建 Todo 实体类，定义数据库表结构',
        code: `@Entity(tableName = "todos")
data class Todo(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val description: String = "",
    val isCompleted: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)`,
        language: 'kotlin'
      },
      {
        title: '创建 DAO',
        description: '定义数据访问对象，实现增删改查',
        code: `@Dao
interface TodoDao {
    @Query("SELECT * FROM todos ORDER BY createdAt DESC")
    fun getAllTodos(): Flow<List<Todo>>
    
    @Insert
    suspend fun insert(todo: Todo)
    
    @Update
    suspend fun update(todo: Todo)
    
    @Delete
    suspend fun delete(todo: Todo)
    
    @Query("UPDATE todos SET isCompleted = :completed WHERE id = :id")
    suspend fun updateCompleted(id: Long, completed: Boolean)
}`,
        language: 'kotlin'
      },
      {
        title: '实现 ViewModel',
        description: '创建 ViewModel 管理 UI 状态',
        code: `class TodoViewModel(private val dao: TodoDao) : ViewModel() {
    
    val allTodos: Flow<List<Todo>> = dao.getAllTodos()
    
    fun addTodo(title: String, description: String = "") {
        viewModelScope.launch {
            dao.insert(Todo(title = title, description = description))
        }
    }
    
    fun toggleCompleted(todo: Todo) {
        viewModelScope.launch {
            dao.updateCompleted(todo.id, !todo.isCompleted)
        }
    }
    
    fun deleteTodo(todo: Todo) {
        viewModelScope.launch {
            dao.delete(todo)
        }
    }
}`,
        language: 'kotlin'
      },
      {
        title: '构建 UI',
        description: '创建列表界面和交互逻辑',
        code: `// 使用 RecyclerView 显示列表
// 或使用 Jetpack Compose
@Composable
fun TodoList(todos: List<Todo>, onToggle: (Todo) -> Unit) {
    LazyColumn {
        items(todos) { todo ->
            TodoItem(
                todo = todo,
                onToggle = { onToggle(todo) }
            )
        }
    }
}`,
        language: 'kotlin'
      }
    ]
  },
  {
    id: 'weather',
    name: '天气应用',
    description: '掌握网络请求、位置服务和现代 UI 开发',
    iconName: 'CloudSun',
    difficulty: 2,
    tags: ['Retrofit', '定位', 'Compose', 'API'],
    estimatedHours: 12,
    overview: '天气应用是学习网络请求的绝佳项目。你将学会调用第三方 API、处理 JSON 数据、获取设备位置，并构建美观的天气展示界面。',
    features: [
      '显示当前天气',
      '未来天气预报',
      '自动获取位置',
      '搜索城市',
      '天气图标动画',
      '下拉刷新'
    ],
    techStack: [
      'Kotlin',
      'Retrofit + OkHttp',
      'Kotlin Coroutines',
      'Jetpack Compose',
      'Location Services',
      '和风天气 API'
    ],
    steps: [
      {
        title: '项目准备',
        description: '创建项目，注册天气 API，添加网络权限',
        code: `<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />`,
        language: 'xml'
      },
      {
        title: '配置 Retrofit',
        description: '设置网络请求框架',
        code: `interface WeatherApi {
    @GET("weather/now")
    suspend fun getCurrentWeather(
        @Query("location") location: String,
        @Query("key") apiKey: String
    ): WeatherResponse
}

val retrofit = Retrofit.Builder()
    .baseUrl("https://devapi.qweather.com/v7/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()`,
        language: 'kotlin'
      },
      {
        title: '获取位置',
        description: '使用 FusedLocationProvider 获取当前位置',
        code: `private val fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)

suspend fun getCurrentLocation(): Location? {
    return suspendCoroutine { continuation ->
        fusedLocationClient.lastLocation
            .addOnSuccessListener { location ->
                continuation.resume(location)
            }
            .addOnFailureListener {
                continuation.resume(null)
            }
    }
}`,
        language: 'kotlin'
      }
    ]
  },
  {
    id: 'news',
    name: '新闻阅读器',
    description: '实现数据分页加载、离线缓存和网页浏览',
    iconName: 'Newspaper',
    difficulty: 3,
    tags: ['Paging', '缓存', 'WebView', 'Room'],
    estimatedHours: 16,
    overview: '新闻阅读器帮助你掌握处理大量数据的技巧，包括分页加载、本地缓存、WebView 使用等高级功能。',
    features: [
      '新闻列表展示',
      '下拉刷新 + 上拉加载',
      '新闻详情页',
      '收藏功能',
      '离线缓存',
      '分享功能'
    ],
    techStack: [
      'Kotlin',
      'Paging 3',
      'Room + RemoteMediator',
      'WebView',
      'Retrofit',
      'Coil 图片加载'
    ],
    steps: []
  }
]
