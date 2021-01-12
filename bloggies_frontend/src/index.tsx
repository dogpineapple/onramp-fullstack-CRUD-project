import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AnyAction, applyMiddleware, createStore, Store } from "redux";
import rootReducer from './redux/rootReducer';
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';


const persistConfig = {
  key: "root",
  storage,
  whitelist: ['user', 'favorites'] // user and favorites will be persisted, rest will not.
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store: Store<any, AnyAction> = createStore(persistedReducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  ));

let persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
