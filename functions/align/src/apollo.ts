import ApolloClient, { InMemoryCache } from 'apollo-boost';

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;

const client: ApolloClient<InMemoryCache> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: GRAPHQL_ENDPOINT,
});

export default client;
