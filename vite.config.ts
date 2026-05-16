import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.md'],
  // 输出到 docs/，Gitee Pages 可直接选择 /docs 目录发布
  build: { outDir: 'docs' },
  // 使用相对路径，兼容子目录部署
  base: './',
})
