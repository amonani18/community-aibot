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
          auth: 'https://community-aibot-1.onrender.com/remoteEntry.js',
          community: 'https://community-aibot-community-mfe.onrender.com/remoteEntry.js',
          ai_assistant: 'https://community-aibot-chatbox-mfe.onrender.com/remoteEntry.js'
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.0.0'
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.0.0'
          },
          '@apollo/client': {
            singleton: true,
            requiredVersion: '^3.0.0'
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '^6.0.0'
          },
          'react-bootstrap': {
            singleton: true,
            requiredVersion: '^2.0.0'
          }
        }
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
          entryFileNames: '[name].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
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
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
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
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    }
  };
}); 