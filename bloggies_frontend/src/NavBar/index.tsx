import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <div className="NavBar">
      <NavLink to="/">
        <span className="NavBar-title">bloggies.</span>
      </NavLink>
      <ul className="NavBar-list">
        <NavLink to="/">blogs</NavLink>
        <NavLink to="/users/login">login</NavLink>
        <NavLink to="/users/register">sign up</NavLink>
      </ul>
    </div>
  );
};

export default NavBar;