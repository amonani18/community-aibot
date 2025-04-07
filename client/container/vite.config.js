import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      federation({
        name: 'container',
        remotes: {
          auth: env.VITE_AUTH_URL || 'http://localhost:3001/assets/remoteEntry.js',
          community: env.VITE_COMMUNITY_URL || 'http://localhost:3002/assets/remoteEntry.js',
          ai_assistant: env.VITE_AI_ASSISTANT_URL || 'http://localhost:3003/assets/remoteEntry.js',
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
      port: 3000,
      strictPort: true,
      cors: {
        origin: [
          'http://localhost:3001',
          'http://localhost:3002',
          'http://localhost:3003',
          'https://community-aibot-1.onrender.com',
          'https://community-aibot-community-mfe.onrender.com',
          'https://community-aibot-chatbox-mfe.onrender.com'
        ],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    },
    preview: {
      port: 3000,
      strictPort: true,
      cors: {
        origin: [
          'http://localhost:3001',
          'http://localhost:3002',
          'http://localhost:3003',
          'https://community-aibot-1.onrender.com',
          'https://community-aibot-community-mfe.onrender.com',
          'https://community-aibot-chatbox-mfe.onrender.com'
        ],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    }
  };
}); 