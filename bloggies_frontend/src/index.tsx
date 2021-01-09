import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AnyAction, applyMiddleware, createStore, Store } from "redux";
import rootReducer from './redux/rootReducer';
import { composeWithDevTools} from "redux-devtools-extension";
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

const store: Store<any, AnyAction> = createStore(rootReducer, 
  composeWithDevTools(
    applyMiddleware(thunk)
  ));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
