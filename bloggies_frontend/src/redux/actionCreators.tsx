import { Dispatch } from "react";
import { Action } from "redux";
import { BASE_URL } from "../config";
import { Post } from "../custom";
import { ADD_FAVORITE, DELETE_FAVORITE, LOAD_FAVORITES, LOAD_POSTS, LOAD_USER, LOGOUT } from "./actionTypes";

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

export function addFavoriteToAPI(post: Post) {
  return async function (dispatch: Dispatch<Action>) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/favorites`, {
      method: "POST",
      body: JSON.stringify({ postId: post.id, _token: token }),
      headers: {
        "Content-type": "application/json"
      }
    });
    if (res.status === 200) {
      dispatch(addFavorite(post));
    }
  }
}

function addFavorite(post: Post) {
  return { type: ADD_FAVORITE, payload: { post } };
}

export function deleteFavoriteFromAPI(postId: number) {
  return async function (dispatch: Dispatch<Action>) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${BASE_URL}/favorites`, {
      method: "DELETE",
      body: JSON.stringify({ postId, _token: token }),
      headers: {
        "Content-type": "application/json"
      }
    });
    if (res.status === 200) {
      dispatch(deleteFavorite(postId));
    }
  }
}

function deleteFavorite(postId: number) {
  return { type: DELETE_FAVORITE, payload: { postId } }
}

export function getUserFavoritesFromAPI(userId: number) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/favorites/${userId}`, {
      method: "GET"
    });
    const favoritesRes = await res.json();
    dispatch(gotFavorites(favoritesRes.posts));
  }
}

function gotFavorites(favorites: Array<any>) {
  return { type: LOAD_FAVORITES, payload: { favorites } };
}

function gotPosts(posts: Array<any>) {
  return { type: LOAD_POSTS, payload: { posts } };
}

export function logoutUser() {
  return { type: LOGOUT };
}

export function gotUserInfo(user: any) {
  return { type: LOAD_USER, payload: { user } };
}