import React, { useEffect } from 'react';
import './App.css';
import './animations.css';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { getUserFavoritesFromAPI, getUserInfoFromAPI } from './redux/actionCreators';
import NavBar from './NavBar';
import { CustomReduxState } from './custom';
import { getCookie } from './helpers';

function App() {
  const userId = ((st: CustomReduxState) => st.user.id);
  const dispatch = useDispatch();

  useEffect(function handleGetUser() {
    const token = getCookie("token");
    // if the user has not signed out from previous session and
    // still has a token, retrieve the user's information by
    // id upon App mount.
    if (token && !userId) {
      dispatch(getUserInfoFromAPI());
      dispatch(getUserFavoritesFromAPI(userId));
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes />
      </BrowserRouter>
    </div >
  );
}

export default App;
