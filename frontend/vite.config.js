import { defineConfig } from 'vite'
import react from '@vitejs.plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Aumenta o limite do aviso para 1000 kB (1 MB) se quiser apenas sumir com o aviso
    chunkSizeWarningLimit: 1000,
    
    // Separa as bibliotecas de terceiros (node_modules) do código principal
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Cria um arquivo separado só para as bibliotecas pesadas (Three.js, Lucide, Axios)
          }
        }
      }
    }
  }
})