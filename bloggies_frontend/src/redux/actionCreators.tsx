import { Dispatch } from "react";
import { Action } from "redux";
import { BASE_URL } from "../config";
import { Post, PostFormData, User } from "../custom";
import { ADD_FAVORITE, ADD_POST, DELETE_FAVORITE, DELETE_POST, DISPLAY_SERVER_ERR, LOAD_FAVORITES, LOAD_POSTS, LOAD_SEARCH_RESULTS, LOAD_USER, LOGOUT, UPDATE_POST } from "./actionTypes";

/**
 * POST request to add a post to backend and dispatches
 * action to update redux store.
 */
export function addPostToAPI(postData: PostFormData) {
  return async function (dispatch: Dispatch<Action>) {
    const _token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      body: JSON.stringify({ ...postData, _token }),
      headers: {
        "Content-type": "application/json"
      }
    });
    const resData = await res.json();
    if (res.status === 201) {
      dispatch(addPost(resData.post));
    } else {
      console.log("error in posting", resData.error.message);
    }
  }
}

function addPost(post: Post) {
  return { type: ADD_POST, payload: { post } };
}

/**
 * DELETE request to remove a post on backend and dispatches
 * action to update redux store.
 */
export function deletePostFromAPI(postId: number, _token: string) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      body: JSON.stringify({ _token }),
      headers: {
        "Content-type": "application/json"
      }
    });
    const resData = await res.json();
    if (res.status === 200) {
      dispatch(deletePost(postId))
    } else {
      dispatch(displayServerErr(resData.error.message));
    }
  }
}

function deletePost(postId: number) {
  return { type: DELETE_POST, payload: { postId } };
}

function displayServerErr(message: string) {
  return { type: DISPLAY_SERVER_ERR, payload: { message }};
}

/**
 * GET request to retrieve posts from backend and dispatches
 * action to update redux store.
 */
export function getPostsFromAPI() {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/posts`);
    const postsRes = await res.json();
    dispatch(gotPosts(postsRes.posts));
  }
}

/**
 * GET request to add a post to backend and dispatches
 * action to update redux store.
 */
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

/**
 * returns UPDATE_POST action object to update redux store.
 */
export function updateCurrentPost(post: Post) {
  return { type: UPDATE_POST, payload: { post }};
}

/**
 * GET request search backend for both posts and users matching the
 * search `term` passed and dispatches action to update redux store. 
 */
export function getSearchResultsFromAPI(term: string) {
  return async function (dispatch: Dispatch<Action>) {
    const postsRes = await fetch(`${BASE_URL}/posts/search?term=${term}`);
    const postsData = await postsRes.json();

    const usersRes = await fetch(`${BASE_URL}/users/search?term=${term}`);
    const usersData = await usersRes.json();

    if (postsRes.status === 200 && usersRes.status === 200) {
      dispatch(gotSearchResults(postsData.posts, usersData.users));
    }
  }
}

function gotSearchResults(posts: Array<Post>, users: Array<User>) {
  return { type: LOAD_SEARCH_RESULTS, payload: { posts, users } };
}

/**
 * POST request to add a favorite post to a user to backend 
 * and dispatches action to update redux store.
 */
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
    if (res.status === 201) {
      dispatch(addFavorite(post));
    }
  }
}

function addFavorite(post: Post) {
  return { type: ADD_FAVORITE, payload: { post } };
}

/**
 * DELETE request to remove a favorite post from a user to backend 
 * and dispatches action to update redux store.
 */
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

/**
 * GET request to retrieve all favorite posts of a user from backend 
 * and dispatches action to update redux store.
 */
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

/**Returns an action object for type LOGOUT*/
export function logoutUser() {
  return { type: LOGOUT };
}

/**Returns an action object for type LOAD_USER*/
export function gotUserInfo(user: User) {
  return { type: LOAD_USER, payload: { user } };
}