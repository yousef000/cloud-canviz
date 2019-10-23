import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {createStore} from 'redux'
import {Provider} from 'react-redux'

import Reducer from './store/reducer'

import { ApolloClient } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

const cache = new InMemoryCache()
const link = new HttpLink({
  uri: 'http://localhost:4000/graphql'
})
const client = new ApolloClient({
  cache,
  link
})

const store = createStore(Reducer)
ReactDOM.render(<ApolloProvider client={client}><Provider store={store}><App /></Provider></ApolloProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();