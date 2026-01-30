/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // AI API 配置（仅开发环境使用）
  readonly VITE_AI_API_BASE?: string
  readonly VITE_AI_API_KEY?: string
  readonly VITE_AI_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
