import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../services/supabaseService'
import { useProgressBloc } from './progressBloc'

/**
 * 认证状态接口
 * 
 * 现在使用 Supabase 认证系统，不再使用 localStorage
 */
interface AuthState {
  // 当前登录用户
  currentUser: User | null
  // 是否正在加载
  isLoading: boolean
  // 错误信息
  error: string | null
  // 是否已初始化（加载过当前会话）
  isInitialized: boolean
  
  // 初始化认证状态（从 Supabase 加载当前会话）
  initialize: () => Promise<void>
  // 注册
  register: (username: string, email: string, password: string) => Promise<boolean>
  // 登录（现在只支持邮箱登录）
  login: (email: string, password: string) => Promise<boolean>
  // 退出登录
  logout: () => Promise<void>
  // 更新用户信息
  updateProfile: (updates: Partial<Pick<User, 'username' | 'avatar'>>) => void
  // 清除错误
  clearError: () => void
}

/**
 * 用户认证状态管理（Supabase 版本）
 * 
 * 变化：
 * 1. 不再使用 localStorage 存储用户密码
 * 2. 认证逻辑交给 Supabase 处理（更安全）
 * 3. 只持久化当前用户信息
 * 4. 登录只支持邮箱（Supabase 标准）
 */
export const useAuthBloc = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      // 初始化：从 Supabase 加载当前会话
      initialize: async () => {
        if (get().isInitialized) return
        
        set({ isLoading: true })
        
        try {
          const user = await getCurrentUser()
          set({ 
            currentUser: user, 
            isLoading: false, 
            isInitialized: true 
          })
        } catch (error) {
          console.error('初始化认证失败:', error)
          set({ 
            currentUser: null, 
            isLoading: false, 
            isInitialized: true 
          })
        }
      },

      // 注册新用户
      register: async (username: string, email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null })

        // 前端验证（减少不必要的 API 调用）
        if (username.length < 2 || username.length > 20) {
          set({ isLoading: false, error: '用户名长度需要在 2-20 个字符之间' })
          return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          set({ isLoading: false, error: '请输入有效的邮箱地址' })
          return false
        }

        if (password.length < 6) {
          set({ isLoading: false, error: '密码长度至少为 6 个字符' })
          return false
        }

        // 调用 Supabase 注册
        const result = await registerUser(username, email, password)
        
        if (!result.success) {
          set({ isLoading: false, error: result.error || '注册失败' })
          return false
        }

        // 注册成功，设置当前用户
        set({ 
          currentUser: result.user!, 
          isLoading: false, 
          error: null 
        })
        return true
      },

      // 登录（只支持邮箱）
      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null })

        // 调用 Supabase 登录
        const result = await loginUser(email, password)
        
        if (!result.success) {
          set({ isLoading: false, error: result.error || '登录失败' })
          return false
        }

        // 登录成功，设置当前用户
        set({ 
          currentUser: result.user!, 
          isLoading: false, 
          error: null 
        })
        return true
      },

      // 退出登录
      logout: async () => {
        set({ isLoading: true })
        
        await logoutUser()
        
        // 清空进度数据
        const { resetProgress } = useProgressBloc.getState()
        resetProgress()
        
        set({ 
          currentUser: null, 
          error: null, 
          isLoading: false 
        })
      },

      // 更新用户信息（暂时只更新本地状态，后续可以同步到 Supabase）
      updateProfile: (updates: Partial<Pick<User, 'username' | 'avatar'>>) => {
        const { currentUser } = get()
        
        if (!currentUser) return

        const updatedUser = { ...currentUser, ...updates }
        set({ currentUser: updatedUser })
        
        // TODO: 同步到 Supabase profiles 表
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'android-learn-auth',
      partialize: (state) => ({
        // 只持久化当前用户信息，用于快速恢复 UI 状态
        // 真实认证状态由 Supabase 会话管理
        currentUser: state.currentUser,
      }),
    }
  )
)
