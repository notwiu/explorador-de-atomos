import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// O build gera um único index.html (funciona offline, até de um pendrive).
export default defineConfig({
  plugins: [react(), viteSingleFile()],
})
