import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// Helper function to get environment variable with fallback
const getEnvVar = (key, defaultValue) => {
  return process.env[key] || defaultValue;
};

// Default URLs for development
const defaultUrls = {
  auth: 'http://localhost:3001',
  community: 'http://localhost:3002',
  ai_assistant: 'http://localhost:3003'
};

// Get URLs from environment or use defaults
const getRemoteUrl = (name) => {
  const envVar = `VITE_${name.toUpperCase()}_MFE_URL`;
  const url = getEnvVar(envVar, defaultUrls[name]);
  return `${url}/assets/remoteEntry.js`;
};

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'container',
      filename: 'remoteEntry.js',
      remotes: {
        auth: {
          external: getRemoteUrl('auth'),
          from: 'vite',
          externalType: 'url'
        },
        community: getRemoteUrl('community'),
        ai_assistant: getRemoteUrl('ai_assistant'),
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
    cors: {
      origin: ['https://community-aibot-1.onrender.com', 'http://localhost:3001'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    },
    headers: {
      'Access-Control-Allow-Origin': 'https://community-aibot-1.onrender.com',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  },
  preview: {
    port: 3000,
    strictPort: true,
    cors: {
      origin: ['https://community-aibot-1.onrender.com', 'http://localhost:3001'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    },
    headers: {
      'Access-Control-Allow-Origin': 'https://community-aibot-1.onrender.com',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    }
  }
}); 