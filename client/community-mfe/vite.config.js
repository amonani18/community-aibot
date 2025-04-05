import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'community',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.jsx'
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
      external: ['react', 'react-dom', '@apollo/client', 'react-router-dom', 'react-bootstrap']
    }
  },
  server: {
    port: 3002,
    strictPort: true,
    cors: {
      origin: '*'
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  preview: {
    port: 3002,
    strictPort: true,
    cors: {
      origin: '*'
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})
