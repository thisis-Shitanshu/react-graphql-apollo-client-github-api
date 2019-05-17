import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// Custome Files
import './style.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const GITHUB_BASE_URL = 'https://api.github.com/graphql';

const httpLink = new HttpLink({
    uri: GITHUB_BASE_URL,
    headers: {
        authorization: `Bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
    }
});

// Application Level Error Handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        // do something with graphql error
    }

    if (networkError) {
        // do something with network error
    }
});

// Control-flow is important, terminating link should be last. 
const link = ApolloLink.from([errorLink, httpLink]);

const cache = new InMemoryCache();

// Instance of Apollo Client
const client = new ApolloClient({
    link,
    cache
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
