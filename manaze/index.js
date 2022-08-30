/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {name as appName} from './app.json';
import store, {persistor} from './store';

const RNRedux = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
AppRegistry.registerComponent(appName, () => RNRedux);
