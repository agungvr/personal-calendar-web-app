import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Root from './root';
import configureStore from './store/configure-store';
import rootReducer from './reducers';
import rootSaga from './sagas';
import 'semantic-ui-css/semantic.min.css';
import './assets/css/style.css'
import * as serviceWorker from './serviceWorker';
import { PersistGate } from 'redux-persist/integration/react'

const { store, persistor } = configureStore(rootReducer, rootSaga);

const el = document.createElement('div');
document.body.appendChild(el);

const mount = Component => render((
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Component/>
    </PersistGate>
  </Provider>
), el);

mount(Root);

serviceWorker.unregister();

