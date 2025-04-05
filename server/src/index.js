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
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
    credentials: true
  }));
  app.use(express.json());
  app.use(auth); // Apply auth middleware

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Return the authenticated user in the context
      return { 
        req, 
        user: req.user // Explicitly add the user to the context
      };
    },
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      // Return a cleaner error message to the client
      return {
        message: error.message,
        locations: error.locations,
        path: error.path
      };
    }
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  const PORT = process.env.PORT || 4000;
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/community-app';

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

startServer(); 