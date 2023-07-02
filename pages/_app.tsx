import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Header from '@/Components/Header';

const client = new ApolloClient({
  uri: '/api/graphql', // Update the URI if your GraphQL endpoint is different
  cache: new InMemoryCache(),
});


function MyApp({ Component, pageProps } : AppProps) {
  return (
    <UserProvider>
      <ApolloProvider client={client}>
        <Header />
        <Component {...pageProps} />
      </ApolloProvider>
    </UserProvider>
  );
}

export default MyApp;
