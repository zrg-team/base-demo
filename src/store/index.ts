import {
  applyMiddleware,
  compose,
  legacy_createStore as createStore,
} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '@reducers/index';
import { createLogger } from 'redux-logger';
import { reduxStorage } from './storage';

declare const window: any;

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  timeout: 0,
  whitelist: ['session', 'navigation'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleWares: Array<any> = [];
if (__DEV__) {
  middleWares.push(createLogger({}));
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composed = [applyMiddleware(...middleWares)];

export const store = createStore(
  persistedReducer,
  {},
  composeEnhancers(...composed),
);

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
