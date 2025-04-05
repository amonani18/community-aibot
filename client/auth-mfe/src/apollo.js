import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
  credentials: 'same-origin'
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage
  const token = localStorage.getItem('token');
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'Content-Type': 'application/json',
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          communityPosts: {
            merge: false
          },
          helpRequests: {
            merge: false
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    }
  }
});

export default client; 