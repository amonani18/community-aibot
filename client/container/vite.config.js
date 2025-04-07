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
  };
}); 