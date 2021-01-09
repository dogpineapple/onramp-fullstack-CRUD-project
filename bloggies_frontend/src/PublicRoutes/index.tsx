import React from "react";
import { Route, Switch } from "react-router";
import NavBar from "../NavBar";
import Login from "../PublicPages/Login";
import Homepage from "../PublicPages/Homepage";
import Register from "../PublicPages/Register";
import "./PublicRoutes.css";
import PostDetails from "../PublicPages/PostDetails";

function PublicRoutes() {
  return (
    <div className="PublicRoutes">
      <NavBar />
      <Switch>
        <Route exact path="/blog/:postId/:postTitle">
          <div className="PublicRoutes-thin-container">
            <PostDetails />
          </div>
        </Route>
        <Route exact path="/users/login">
          <Login />
        </Route>
        <Route exact path="/users/register">
          <Register />
        </Route>
        <Route exact path="/">
          <div className="PublicRoutes-thin-container">
            <Homepage />
          </div>
        </Route>
      </Switch>
    </div>
  )
}

export default PublicRoutes;