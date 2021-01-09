import { Dispatch } from "react";
import { Action } from "redux";
import { BASE_URL } from "../config";
import { LOAD_FAVORITES, LOAD_POSTS, LOAD_USER, LOGOUT } from "./actionTypes";

export function getPostsFromAPI() {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/posts`);
    const postsRes = await res.json();
    dispatch(gotPosts(postsRes.posts));
  }
}

export function getUserInfoFromAPI(token: string) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      body: JSON.stringify({ "_token": token })
    });
    const userRes = await res.json();
    dispatch(gotUserInfo(userRes.user));
  }
}

export function getUserFavoritesFromAPI(userId: number) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/favorites/${userId}`, {
      method: "GET"
    });
    const favoritesRes = await res.json();
    dispatch(gotFavorites(favoritesRes.favorites));
  }
}

function gotFavorites(favorites: Array<any>) {
  return { type: LOAD_FAVORITES, payload: { favorites }};
}

function gotPosts(posts: Array<any>) {
  return { type: LOAD_POSTS, payload: { posts } };
}

export function logoutUser() {
  return { type: LOGOUT };
}

export function gotUserInfo(user: any) {
  return { type: LOAD_USER, payload: { user }};
}