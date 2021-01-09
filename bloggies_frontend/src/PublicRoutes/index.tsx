import React from "react";
import { Redirect, Route, Switch } from "react-router";
import Login from "../PublicPages/Login";
import Homepage from "../PublicPages/Homepage";
import Register from "../PublicPages/Register";
import "./PublicRoutes.css";
import PostDetails from "../PublicPages/PostDetails";
import UserProfile from "../PublicPages/UserProfile";

function PublicRoutes() {
  return (
    <Switch>
      <Route exact path="/blogs/create">
        <h1 className="test">TODO: Create the new post form</h1>
      </Route>
      <Route exact path="/blogs/:postId/:postTitle">
        <div className="PublicRoutes-thin-container">
          <PostDetails />
        </div>
      </Route>
      <Route exact path="/users/:userId/:displayName/favorites">
        <div className="PublicRoutes-thin-container">
          <UserProfile />
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
      <Redirect to="/" />
    </Switch>
  )
}

export default PublicRoutes;