import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages는 https://<user>.github.io/<repo>/ 하위 경로에서 서빙되므로 CI에서만 base를 주입한다.
  base: process.env.BASE_PATH ?? '/',
})
