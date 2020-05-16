import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import App from './App';
import createStore from './src/store/configureStore';
import {name as appName} from './app.json';

const appRedux = () => (
  <Provider store={createStore()}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => appRedux);
