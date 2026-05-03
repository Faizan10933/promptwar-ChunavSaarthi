import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    })
  ],
  build: {
    target: 'esnext',
    cssMinify: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@google/genai') || id.includes('@google/generative-ai')) {
              return 'ai';
            }
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('react')) {
              return 'react-core';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    env: {
      VITE_GEMINI_API_KEY: 'test_key',
      VITE_FIREBASE_API_KEY: 'test_firebase_key'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/setupTests.js', 'src/main.jsx', 'eslint.config.js']
    }
  }
});
