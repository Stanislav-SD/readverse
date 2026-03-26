import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink  = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors && graphQLErrors.length > 0) {
    //console.log(`[GraphQL error]: Message: ${graphQLErrors[0].message}`);
  } else {
    //console.log('[GraphQL error]: None');
  }

  if (networkError) {
    //console.log(`[Network error]: ${networkError}`);
  } else {
    //console.log('[Network error]: None');
  }
});

const link = ApolloLink.from([errorLink, httpLink]);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

export default client;