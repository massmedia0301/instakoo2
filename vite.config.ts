import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // GitHub Pages (project page) base path
  // https://massmedia0301.github.io/instakoo2/
  base: '/instakoo2/',

  build: {
    outDir: 'dist',
  },
})
