/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly TELEGRAM_BOT_TOKEN?: string
  readonly PORT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}