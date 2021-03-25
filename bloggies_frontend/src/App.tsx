import React, { useEffect } from 'react';
import './App.css';
import './animations.css';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { getUserFavoritesFromAPI, getUserInfoFromAPI } from './redux/actionCreators';
import NavBar from './NavBar';
import { CustomReduxState } from './custom';
import { getCookie } from './helpers';
import { ThemeProvider } from 'styled-components';
import { defaultAppTheme, GlobalStyles, premiumAppTheme } from './theme';


function App() {
  const currentUser = useSelector((st: CustomReduxState) => st.user);
  const serverErr = useSelector((st: CustomReduxState) => st.serverErr);
  const dispatch = useDispatch();

  useEffect(function handleGetUser() {
    const token = getCookie("token");
    // if the user has not signed out from previous session and
    // still has a token, retrieve the user's information by
    // id upon App mount.
    if (token && !currentUser.id) {
      dispatch(getUserInfoFromAPI());
      dispatch(getUserFavoritesFromAPI(currentUser.id));
    }
  }, []);

  return (
    <ThemeProvider theme={currentUser.membership_status === "active" ? premiumAppTheme : defaultAppTheme}>
      <GlobalStyles />
      <div className="App">
        <BrowserRouter>
          {serverErr && <div className="App-server-error">{serverErr}</div>}
          <NavBar />
          <Routes />
        </BrowserRouter>
      </div >
    </ThemeProvider>
  );
}

export default App;
