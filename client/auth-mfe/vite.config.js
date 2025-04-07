import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

const allowedOrigin = 'https://community-aibot-container.onrender.com';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    federation({
      name: 'auth',
      filename: 'remoteEntry.js',
      exposes: {
        './AuthApp': './src/App.jsx'
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        '@apollo/client': { singleton: true, requiredVersion: '^3.0.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' },
        'react-bootstrap': { singleton: true, requiredVersion: '^2.0.0' }
      }
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    outDir: 'dist',
    rollupOptions: {
      external: ['react', 'react-dom', '@apollo/client', 'react-router-dom', 'react-bootstrap'],
      output: {
        format: 'esm',
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  server: {
    port: 3001,
    strictPort: true,
    cors: {
      origin: allowedOrigin,
      credentials: true
    },
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  },
  preview: {
    port: 3001,
    strictPort: true,
    cors: {
      origin: allowedOrigin,
      credentials: true
    },
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  }
})
