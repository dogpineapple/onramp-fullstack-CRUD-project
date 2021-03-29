import React from "react";
import { Redirect, Route, Switch } from "react-router";
import Login from "../RoutedPages/Login";
import Register from "../RoutedPages/Register";
import RegisterStatusPage from "../RoutedPages/RegisterStatusPage";
import BlogPage from "../RoutedPages/BlogPage";
import PostDetails from "../RoutedPages/PostDetails";
import ComposePage from "../RoutedPages/ComposePage";
import SearchResults from "../RoutedPages/SearchResults";
import UserProfile from "../RoutedPages/UserProfile";
import UserSettingsPage from "../RoutedPages/UserSettingsPage";
import PaymentCancelPage from "../RoutedPages/PaymentCancelPage";
import PaymentSuccessPage from "../RoutedPages/PaymentSuccessPage";
import "./Routes.css";
import UserSubscriptionPayment from "../RoutedPages/UserSubscriptionPayment";
import UserApplicationPage from "../RoutedPages/UserApplicationPage";
import UserAddtionalApplicationPage from "../RoutedPages/UserAdditionalApplicationPage";

function Routes() {
  return (
    <Switch>
      <Route exact path="/users/:userId/settings">
        <div>
          <UserSettingsPage />
        </div>
      </Route>
      <Route exact path="/users/:userId/:displayName">
        <div className="Routes-thin-container">
          <UserProfile />
        </div>
      </Route>
      <Route exact path="/blogs/:postId/:postTitle">
        <div className="Routes-thin-container">
          <PostDetails />
        </div>
      </Route>
      <Route exact path="/blogs/create">
        <div className="Routes-thin-container">
          <ComposePage />
        </div>
      </Route>
      <Route exact path="/payment/success">
        <div className="Routes-thin-container">
          <PaymentSuccessPage />
        </div>
      </Route>
      <Route exact path="/payment/cancel">
        <div className="Routes-thin-container">
          <PaymentCancelPage />
        </div>
      </Route>
      <Route exact path="/payment/checkout">
        <div className="Routes-thin-container">
          <UserSubscriptionPayment />
        </div>
      </Route>
      <Route exact path="/register/membership-form">
        <div>
          <UserApplicationPage />
        </div>
      </Route>
      <Route exact path="/register/membership-additional-form">
        <div>
          <UserAddtionalApplicationPage />
        </div>
      </Route>
      <Route exact path="/register/membership-status">
        <RegisterStatusPage />
      </Route>
      <Route exact path="/users/register">
        <Register />
      </Route>
      <Route exact path="/users/login">
        <Login />
      </Route>
      <Route exact path="/search">
        <SearchResults />
      </Route>
      <Route exact path="/">
        <div className="Routes-thin-container">
          <BlogPage />
        </div>
      </Route>
      <Route exact path="/payment/form">
        <UserSubscriptionPayment/>
      </Route>
      <Redirect to="/" />
    </Switch>
  )
}

export default Routes;
