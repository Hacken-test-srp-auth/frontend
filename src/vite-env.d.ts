/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_N: string;
  readonly VITE_G: string;
  readonly VITE_K: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
