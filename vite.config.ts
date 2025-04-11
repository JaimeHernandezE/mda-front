import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react({
    // Habilita las características de emotion para Material-UI
    jsxImportSource: '@emotion/react',
    babel: {
      plugins: ['@emotion/babel-plugin'],
    },
  })],
  server: {
    port: 3000,  // Mismo puerto que CRA para consistencia
    proxy: {
      // Configura el proxy para la API de Django
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'build',  // Mismo directorio de salida que CRA
    sourcemap: true,  // Habilita sourcemaps para debugging
  },
  resolve: {
    alias: {
      // Alias útiles para importaciones
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@services': '/src/services',
      '@utils': '/src/utils',
      '@styles': '/src/styles',
    },
  },
}); 