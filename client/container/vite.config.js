import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'container',
      remotes: {
        auth: 'http://localhost:3001/assets/remoteEntry.js',
        community: 'http://localhost:3002/assets/remoteEntry.js',
        ai_assistant: 'http://localhost:3003/assets/remoteEntry.js',
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
    port: 3000,
    strictPort: true,
    cors: {
      origin: '*'
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  preview: {
    port: 3000,
    strictPort: true,
    cors: {
      origin: '*'
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}); 