import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useThemeBloc } from './blocs/themeBloc'
import { useAuthBloc } from './blocs/authBloc'
import { useProgressBloc } from './blocs/progressBloc'
import { BackgroundDecoration } from './components/BackgroundDecoration'
import { Navbar } from './components/Navbar'
import { BottomNav } from './components/BottomNav'
import { KotlinPlayground } from './components/KotlinPlayground'
import { AiTextAssistant } from './components/AiTextAssistant'
import { AiPageAssistant } from './components/AiPageAssistant'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { LessonPage } from './pages/LessonPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProfilePage } from './pages/ProfilePage'
import { ResourcesPage } from './pages/ResourcesPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

/**
 * 主布局组件（带导航栏）
 */
function MainLayout({ children }: { children: React.ReactNode }) {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)

  return (
    <div className="min-h-screen relative">
      {/* 背景装饰 */}
      <BackgroundDecoration />

      {/* 导航栏 */}
      <Navbar />

      {/* 主内容区 */}
      <main className="relative z-10">
        {children}
      </main>

      {/* 底部导航 */}
      <BottomNav />

      {/* Kotlin 在线测试浮动按钮（点击打开 AI 助手） */}
      <KotlinPlayground onOpenAI={() => setIsAIAssistantOpen(true)} />

      {/* AI 文本分析助手（选中文本时显示） */}
      <AiTextAssistant />

      {/* AI 页面助手（点击右下角按钮打开） */}
      <AiPageAssistant 
        isOpen={isAIAssistantOpen} 
        onClose={() => setIsAIAssistantOpen(false)} 
      />
    </div>
  )
}

/**
 * 认证页面布局（无导航栏）
 */
function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {children}
    </div>
  )
}

/**
 * 路由变化时滚动到顶部
 */
function ScrollToTop() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}

/**
 * 应用内容组件
 * 根据路由决定使用哪种布局
 */
function AppContent() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  if (isAuthPage) {
    return (
      <AuthLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AuthLayout>
    )
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:phaseId/:lessonId" element={<LessonPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </MainLayout>
  )
}

/**
 * 主应用组件
 * 使用 React Router 实现页面路由
 * 初始化 Supabase 认证状态和加载云端进度
 */
function App() {
  const theme = useThemeBloc((state) => state.theme)
  const { initialize, isInitialized, currentUser } = useAuthBloc()
  const { loadFromCloud } = useProgressBloc()

  // 初始化认证状态（恢复 Supabase 会话）
  useEffect(() => {
    initialize()
  }, [initialize])

  // 用户登录后，加载云端进度
  useEffect(() => {
    if (currentUser) {
      loadFromCloud(currentUser.id)
    }
  }, [currentUser, loadFromCloud])

  // 初始化时同步主题到 body
  useEffect(() => {
    document.body.classList.remove('dark', 'light')
    document.body.classList.add(theme)
  }, [theme])

  // 等待认证初始化完成
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-text-secondary">初始化中...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  )
}

export default App
