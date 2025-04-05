import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'container',
      filename: 'remoteEntry.js',
      remotes: {
        auth: `${import.meta.env.VITE_AUTH_MFE_URL}/assets/remoteEntry.js`,
        community: `${import.meta.env.VITE_COMMUNITY_MFE_URL}/assets/remoteEntry.js`,
        ai_assistant: `${import.meta.env.VITE_AI_ASSISTANT_MFE_URL}/assets/remoteEntry.js`,
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@apollo/client', 'graphql'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3000,
    strictPort: true,
    cors: true,
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