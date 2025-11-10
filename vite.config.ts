// vite.config.js (ou vite.config.ts)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.json'], // Permite importar arquivos JSON como módulos
  resolve: {
    alias: {
      './models': '/src/models' // Ajuste o caminho conforme necessário
    }
  }
});