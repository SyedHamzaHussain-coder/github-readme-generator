/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string
  readonly VITE_APP_GITHUB_CLIENT_ID: string
  readonly VITE_APP_API_URL: string
  readonly REACT_APP_BASE_URL: string
  readonly REACT_APP_GITHUB_CLIENT_ID: string
  readonly REACT_APP_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
