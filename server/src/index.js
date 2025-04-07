const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import type definitions and resolvers
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const auth = require('./utils/auth');

async function startServer() {
  const app = express();
  
  // Apply middleware
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'https://community-aibot-1.onrender.com',
    'https://community-aibot.onrender.com'
  ];

  app.use(cors({
    origin: function(origin, callback) {
      console.log('Received request from origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        console.log('Origin allowed:', origin);
        callback(null, true);
      } else {
        console.log('Origin not allowed:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());
  app.use(auth); // Apply auth middleware

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      console.log('Apollo Server Context - User:', req.user ? 'Authenticated' : 'Not authenticated');
      return { 
        req, 
        user: req.user
      };
    },
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        locations: error.locations,
        path: error.path
      };
    }
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ 
    app, 
    cors: false, // Disable Apollo's CORS since we're using express-cors
    path: '/graphql'
  });

  const PORT = process.env.PORT || 4000;
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/community-app';

  // MongoDB connection options
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false
  };

  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    if (error.code === 'ENOENT') {
      console.error('Certificate file not found. Please check the path:', process.env.MONGODB_URI);
    }
  }
}

startServer(); 