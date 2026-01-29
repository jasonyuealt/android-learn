import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserAccount } from '../types'

/**
 * 简单的密码哈希函数（仅用于本地演示，生产环境请使用 bcrypt 等）
 */
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * 验证密码
 */
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

/**
 * 生成随机 ID
 */
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * 生成随机头像（使用 DiceBear API 风格的颜色）
 */
const generateAvatar = (username: string): string => {
  const colors = ['green', 'blue', 'orange', 'purple']
  const colorIndex = username.charCodeAt(0) % colors.length
  return colors[colorIndex]
}

/**
 * 认证状态接口
 */
interface AuthState {
  // 当前登录用户
  currentUser: User | null
  // 所有注册用户（本地存储）
  users: UserAccount[]
  // 是否正在加载
  isLoading: boolean
  // 错误信息
  error: string | null
  
  // 注册
  register: (username: string, email: string, password: string) => Promise<boolean>
  // 登录
  login: (emailOrUsername: string, password: string) => Promise<boolean>
  // 退出登录
  logout: () => void
  // 更新用户信息
  updateProfile: (updates: Partial<Pick<User, 'username' | 'avatar'>>) => void
  // 清除错误
  clearError: () => void
  // 检查用户名是否存在
  isUsernameTaken: (username: string) => boolean
  // 检查邮箱是否存在
  isEmailTaken: (email: string) => boolean
}

/**
 * 用户认证状态管理
 * 使用 Zustand 和 localStorage 持久化
 */
export const useAuthBloc = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isLoading: false,
      error: null,

      // 注册新用户
      register: async (username: string, email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null })

        // 验证用户名
        if (username.length < 2 || username.length > 20) {
          set({ isLoading: false, error: '用户名长度需要在 2-20 个字符之间' })
          return false
        }

        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          set({ isLoading: false, error: '请输入有效的邮箱地址' })
          return false
        }

        // 验证密码长度
        if (password.length < 6) {
          set({ isLoading: false, error: '密码长度至少为 6 个字符' })
          return false
        }

        // 检查用户名是否已存在
        if (get().isUsernameTaken(username)) {
          set({ isLoading: false, error: '用户名已被使用' })
          return false
        }

        // 检查邮箱是否已存在
        if (get().isEmailTaken(email)) {
          set({ isLoading: false, error: '邮箱已被注册' })
          return false
        }

        try {
          // 创建新用户
          const id = generateId()
          const passwordHash = await hashPassword(password)
          const avatar = generateAvatar(username)
          const createdAt = new Date().toISOString()

          const newAccount: UserAccount = {
            id,
            username,
            email,
            passwordHash,
            avatar,
            createdAt,
          }

          const newUser: User = {
            id,
            username,
            email,
            avatar,
            createdAt,
          }

          set((state) => ({
            users: [...state.users, newAccount],
            currentUser: newUser,
            isLoading: false,
            error: null,
          }))

          return true
        } catch {
          set({ isLoading: false, error: '注册失败，请重试' })
          return false
        }
      },

      // 登录
      login: async (emailOrUsername: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null })

        const { users } = get()
        
        // 查找用户（支持邮箱或用户名登录）
        const account = users.find(
          (u) => u.email === emailOrUsername || u.username === emailOrUsername
        )

        if (!account) {
          set({ isLoading: false, error: '用户不存在' })
          return false
        }

        try {
          // 验证密码
          const isValid = await verifyPassword(password, account.passwordHash)
          
          if (!isValid) {
            set({ isLoading: false, error: '密码错误' })
            return false
          }

          // 登录成功，设置当前用户
          const user: User = {
            id: account.id,
            username: account.username,
            email: account.email,
            avatar: account.avatar,
            createdAt: account.createdAt,
          }

          set({ currentUser: user, isLoading: false, error: null })
          return true
        } catch {
          set({ isLoading: false, error: '登录失败，请重试' })
          return false
        }
      },

      // 退出登录
      logout: () => {
        set({ currentUser: null, error: null })
      },

      // 更新用户信息
      updateProfile: (updates: Partial<Pick<User, 'username' | 'avatar'>>) => {
        const { currentUser, users } = get()
        
        if (!currentUser) return

        // 更新当前用户
        const updatedUser = { ...currentUser, ...updates }
        
        // 更新用户列表中对应的账户
        const updatedUsers = users.map((u) =>
          u.id === currentUser.id ? { ...u, ...updates } : u
        )

        set({ currentUser: updatedUser, users: updatedUsers })
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      },

      // 检查用户名是否已存在
      isUsernameTaken: (username: string): boolean => {
        return get().users.some((u) => u.username.toLowerCase() === username.toLowerCase())
      },

      // 检查邮箱是否已存在
      isEmailTaken: (email: string): boolean => {
        return get().users.some((u) => u.email.toLowerCase() === email.toLowerCase())
      },
    }),
    {
      name: 'android-learn-auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users,
      }),
    }
  )
)
