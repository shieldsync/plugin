import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../assets/js',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/main.jsx'),
      output: {
        entryFileNames: 'shield-sync-dashboard.js',
        chunkFileNames: 'shield-sync-[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'shield-sync-dashboard.css'
          }
          return assetInfo.name
        }
      }
    }
  },
  base: './'
})