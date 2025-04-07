import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  base: 'https://community-aibot-1.onrender.com/',
  plugins: [
    react(),
    federation({
      name: 'auth',
      filename: 'remoteEntry.js',
      exposes: {
        './AuthApp': './src/App.jsx'
      },
      shared: ['react', 'react-dom', '@apollo/client', 'react-router-dom', 'react-bootstrap']
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', '@apollo/client', 'react-router-dom', 'react-bootstrap'],
      output: {
        format: 'esm',
        dir: 'dist',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    port: 3001,
    strictPort: true,
    cors: {
      origin: [
        'http://localhost:3000',
        'https://community-aibot-container.onrender.com'
      ],
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    },
    headers: {
      'Access-Control-Allow-Origin': 'https://community-aibot-container.onrender.com',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  },
  preview: {
    port: 3001,
    strictPort: true,
    cors: {
      origin: [
        'http://localhost:3000',
        'https://community-aibot-container.onrender.com'
      ],
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    },
    headers: {
      'Access-Control-Allow-Origin': 'https://community-aibot-container.onrender.com',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  }
})
