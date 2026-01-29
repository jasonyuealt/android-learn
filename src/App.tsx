import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useThemeBloc } from './blocs/themeBloc'
import { BackgroundDecoration } from './components/BackgroundDecoration'
import { Navbar } from './components/Navbar'
import { BottomNav } from './components/BottomNav'
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
 */
function App() {
  const theme = useThemeBloc((state) => state.theme)

  // 初始化时同步主题到 body
  useEffect(() => {
    document.body.classList.remove('dark', 'light')
    document.body.classList.add(theme)
  }, [theme])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  )
}

export default App
