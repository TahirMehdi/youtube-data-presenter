import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import configureStore from '../redux/configureStore';
import InfluencerCollectionPage from './InfluencerCollectionPage';
import InfluencerSearchPage from './InfluencerSearchPage';
import HelloWorld from '../components/HelloWorld';
import Layout from '../components/Layout';

const store = configureStore();

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/collections" component={Layout}>
            <IndexRoute component={InfluencerCollectionPage} />
          </Route>
          <Route path="/search" component={Layout}>
            <IndexRoute component={InfluencerSearchPage} />
          </Route>
          <Route path="*" component={Layout}>
            <IndexRoute component={HelloWorld} />
          </Route>
        </Router>
      </Provider>
    );
  }
}
