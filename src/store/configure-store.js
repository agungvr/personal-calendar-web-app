import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

export default (rootReducer, rootSaga, initialState = {}) => {
  const persistConfig = {
    key: 'root',
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer)
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  );
  let persistor = persistStore(store);
  sagaMiddleware.run(rootSaga);

  return {
    store, persistor
  }
}
