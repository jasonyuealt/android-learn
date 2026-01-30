/**
 * 第三阶段：数据与网络
 * 本地存储、网络请求、图片加载
 */

import type { Phase } from './types'

export const phase3: Phase = {
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
}
