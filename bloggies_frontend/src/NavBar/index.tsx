import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../redux/actionCreators";
import SearchBar from "../SearchBar";
import "./NavBar.css";

function NavBar() {
  const dispatch = useDispatch();
  const userId = useSelector((st: any) => st.user.id);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logoutUser());
  }

  return (
    <div className="NavBar">
      <NavLink to="/">
        <span className="NavBar-title">bloggies.</span>
      </NavLink>
      <SearchBar />
      <ul className="NavBar-list">
        <NavLink to="/">blogs</NavLink>
        { userId ?
          <Fragment>
            <NavLink to="/users/account-settings">settings</NavLink>
            <button className="NavBar-logout-btn" onClick={handleLogout}>logout</button>
          </Fragment>
          : <Fragment>
            <NavLink to="/users/login">login</NavLink>
            <NavLink to="/users/register">sign up</NavLink>
          </Fragment>
        }
      </ul>
    </div>
  );
};

export default NavBar;