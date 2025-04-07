import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

console.log('Initializing Apollo Client with API URL:', import.meta.env.VITE_API_URL);

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
  credentials: 'include',
  fetchOptions: {
    mode: 'cors'
  }
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  console.log('Setting auth context, token present:', !!token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    },
    mutate: {
      errorPolicy: 'all'
    }
  },
  connectToDevTools: true
}); 