import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'ai_assistant',
      filename: 'remoteEntry.js',
      exposes: {
        './AIChatbot': './src/components/AIChatbot.jsx'
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
    port: 3003,
    strictPort: true,
    cors: {
      origin: '*'
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  preview: {
    port: 3003,
    strictPort: true,
    cors: {
      origin: '*'
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}); 