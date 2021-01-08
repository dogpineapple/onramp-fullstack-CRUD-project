import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="NavBar">
      <span className="NavBar-title">
        <NavLink to="/">bloggies.</NavLink>
      </span>
      <ul className="NavBar-list">
        <NavLink to="/users/login">login</NavLink>
        <NavLink to="/users/register">sign up</NavLink>
      </ul>
    </nav>
  );
};

export default NavBar;