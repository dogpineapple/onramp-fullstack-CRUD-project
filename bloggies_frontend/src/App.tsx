import React, { useEffect } from 'react';
import './App.css';
import './animations.css';
import { BrowserRouter } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { getUserFavoritesFromAPI, getUserInfoFromAPI } from './redux/actionCreators';

function App() {
  const userId = ((st: any) => st.user.id);
  const dispatch = useDispatch();

    useEffect(function handleGetUser() {
      const token = localStorage.getItem("token");
      if (token && !userId) {
        dispatch(getUserInfoFromAPI(token));
        dispatch(getUserFavoritesFromAPI(userId));
      }
    }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <PublicRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
