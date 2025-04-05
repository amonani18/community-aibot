import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo/client';
import AIChatbot from './components/AIChatbot';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AIChatbot />
    </ApolloProvider>
  );
}

export default App; 