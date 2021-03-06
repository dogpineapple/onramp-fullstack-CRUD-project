import { Dispatch } from "react";
import { Action } from "redux";
import { BASE_URL } from "../config";
import { Post, PostFormData, User } from "../custom";
import { ADD_FAVORITE, ADD_POST, DELETE_FAVORITE, DELETE_POST, DISPLAY_SERVER_ERR, LOAD_FAVORITES, LOAD_POSTS, LOAD_SEARCH_RESULTS, LOAD_USER, LOGOUT, REMOVE_SERVER_ERR, UPDATE_POST, UPDATE_PROFILE_PHOTO } from "./actionTypes";

/**
 * POST request to add a post to backend and dispatches
 * action to update redux store.
 */
export function addPostToAPI(postData: PostFormData) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ ...postData }),
      headers: {
        "Content-type": "application/json"
      }
    });
    const resData = await res.json();
    if (res.status === 201) {
      dispatch(deleteServerErr());
      dispatch(addPost(resData.post));
    } else {
      dispatch(gotServerErr(resData.error.message));
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
export function deletePostFromAPI(postId: number) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-type": "application/json"
      }
    });
    const resData = await res.json();
    if (res.status === 200) {
      dispatch(deleteServerErr());
      dispatch(deletePost(postId))
    } else {
      dispatch(gotServerErr(resData.error.message));
    }
  }
}

function deletePost(postId: number) {
  return { type: DELETE_POST, payload: { postId } };
}

/**
 * GET request to retrieve posts from backend and dispatches
 * action to update redux store.
 */
export function getPostsFromAPI() {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/posts`);
    const postsRes = await res.json();
    if (res.status === 200) {
      dispatch(deleteServerErr());
      dispatch(gotPosts(postsRes.posts));
    } else {
      dispatch(gotServerErr(postsRes.error.message));
    }
  }
}

/**
 * GET request to add a post to backend and dispatches
 * action to update redux store.
 */
export function getUserInfoFromAPI() {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      credentials: "include"
    });
    const userRes = await res.json();
    dispatch(gotUserInfo(userRes.user));
  }
}

/**
 * returns UPDATE_POST action object to update redux store.
 */
export function updateCurrentPost(post: Post) {
  return { type: UPDATE_POST, payload: { post } };
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
      dispatch(deleteServerErr());
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
    const res = await fetch(`${BASE_URL}/favorites`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ postId: post.id }),
      headers: {
        "Content-type": "application/json"
      }
    });
    if (res.status === 201) {
      dispatch(deleteServerErr());
      dispatch(addFavorite(post));
    } else {
      const resData = await res.json();
      dispatch(gotServerErr(resData.error.message));
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
    const res = await fetch(`${BASE_URL}/favorites`, {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify({ postId }),
      headers: {
        "Content-type": "application/json"
      }
    });
    if (res.status === 200) {
      dispatch(deleteServerErr());
      dispatch(deleteFavorite(postId));
    }
  }
}

function deleteFavorite(postId: number) {
  return { type: DELETE_FAVORITE, payload: { postId } };
}

function gotServerErr(err: string) {
  return { type: DISPLAY_SERVER_ERR, payload: { err } };
}

function deleteServerErr() {
  return { type: REMOVE_SERVER_ERR };
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


export function uploadFileToApi(file: FormData) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/users/upload-photo`, {
      method: 'POST',
      credentials: 'include',
      body: file
    });
    const resData = await res.json();
    if (res.status === 200) {   
      dispatch(deleteServerErr());
      dispatch(gotPhotoUrl(resData.photoUrl));
    } else {
      dispatch(gotServerErr(resData.error.message));
    }
  }
}

function gotPhotoUrl(photoUrl: string) {
  return { type: UPDATE_PROFILE_PHOTO, payload: { photoUrl } };
}