import { Dispatch } from "react";
import { Action } from "redux";
import { BASE_URL } from "../config";
import { Post, PostFormData, User } from "../custom";
import * as t from "./actionTypes";

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
        "Content-type": "application/json",
      },
    });
    const resData = await res.json();
    if (res.status === 201) {
      dispatch(deleteServerErr());
      dispatch(addPost(resData.post));
    } else {
      dispatch(gotServerErr(resData.error.message));
    }
  };
}

function addPost(post: Post) {
  return { type: t.ADD_POST, payload: { post } };
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
        "Content-type": "application/json",
      },
    });
    const resData = await res.json();
    if (res.status === 200) {
      dispatch(deleteServerErr());
      dispatch(deletePost(postId));
    } else {
      dispatch(gotServerErr(resData.error.message));
    }
  };
}

function deletePost(postId: number) {
  return { type: t.DELETE_POST, payload: { postId } };
}

/**
 * GET request to retrieve posts from backend and dispatches
 * action to update redux store.
 */
export function getPostsFromAPI() {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
    });
    const postsRes = await res.json();
    if (res.status === 200) {
      dispatch(deleteServerErr());
      dispatch(gotPosts(postsRes.posts));
    } else {
      dispatch(gotServerErr(postsRes.error.message));
    }
  };
}

/**
 * GET request to add a post to backend and dispatches
 * action to update redux store.
 */
export function getUserInfoFromAPI() {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      credentials: "include",
    });
    const userRes = await res.json();
    dispatch(gotUserInfo(userRes.user));
  };
}

/**
 * returns UPDATE_POST action object to update redux store.
 */
export function updateCurrentPost(post: Post) {
  return { type: t.UPDATE_POST, payload: { post } };
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
  };
}

function gotSearchResults(posts: Array<Post>, users: Array<User>) {
  return { type: t.LOAD_SEARCH_RESULTS, payload: { posts, users } };
}

/**
 * POST request to add a favorite post to a user to backend
 * and dispatches action to update redux store.
 */
export function addFavoriteToAPI(post: Post) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/bookmarks`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ postId: post.id }),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (res.status === 201) {
      dispatch(deleteServerErr());
      dispatch(addFavorite(post));
    } else {
      const resData = await res.json();
      dispatch(gotServerErr(resData.error.message));
    }
  };
}

function addFavorite(post: Post) {
  return { type: t.ADD_FAVORITE, payload: { post } };
}

/**
 * DELETE request to remove a favorite post from a user to backend
 * and dispatches action to update redux store.
 */
export function deleteFavoriteFromAPI(postId: number) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/bookmarks`, {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify({ postId }),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (res.status === 200) {
      dispatch(deleteServerErr());
      dispatch(deleteFavorite(postId));
    }
  };
}

function deleteFavorite(postId: number) {
  return { type: t.DELETE_FAVORITE, payload: { postId } };
}

export function gotServerErr(err: string) {
  return { type: t.DISPLAY_SERVER_ERR, payload: { err } };
}

export function deleteServerErr() {
  return { type: t.REMOVE_SERVER_ERR };
}

/**
 * GET request to retrieve all favorite posts of a user from backend
 * and dispatches action to update redux store.
 */
export function getUserFavoritesFromAPI(userId: number) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/bookmarks/${userId}`, {
      method: "GET",
    });
    const favoritesRes = await res.json();
    dispatch(gotFavorites(favoritesRes.posts));
  };
}

function gotFavorites(favorites: Array<any>) {
  return { type: t.LOAD_FAVORITES, payload: { favorites } };
}

function gotPosts(posts: Array<any>) {
  return { type: t.LOAD_POSTS, payload: { posts } };
}

/**Returns an action object for type LOGOUT*/
export function logoutUser() {
  return { type: t.LOGOUT };
}

export function clearPosts() {
  return { type: t.CLEAR_POSTS };
}

/**Returns an action object for type LOAD_USER*/
export function gotUserInfo(user: User) {
  return { type: t.LOAD_USER, payload: { user } };
}

/**
 * PUT request to update membership status in database upon submission of premium application
 * and dispatches action to update redux store.
 */
export function updateMembershipStatus(status: string) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/users/status-update`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ appStatus: status }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const userRes = await res.json();
    dispatch(updateUserStatus(userRes));
  };
}

function updateUserStatus(user: any) {
  return { type: t.UPDATE_USER_STATUS, payload: { user } };
}

export function getMembershipStatus(userId: number) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/users/membership-status`, {
      method: "GET",
      credentials: "include",
    });
    const resData = await res.json();
    dispatch(gotMembershipStatus(resData.membership_status));
  };
}

export function gotMembershipStatus(membStatus: string) {
  return {
    type: t.UPDATE_MEMBERSHIP_STATUS,
    payload: { membership_status: membStatus },
  };
}

/**
 * DELETE request to cancel premium subscription via Stripe upon submission
 * and dispatches action to update redux store.
 */
export function cancelPremiumUserMembership(subscriptionId: string) {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/checkout/cancel-subscription`, {
      method: 'DELETE',
      body: JSON.stringify({ subscription_id: subscriptionId }),
      headers: {
        "Content-type": "application/json"
      }
    });
    const resData = await res.json();
    // resData.current_period_end
    if (res.status === 200) {
      const updatedMembershipData = {
        membership_end_date: new Date(),
        membership_status: "inactive",
        cancel_at: null
      }
      dispatch(updateUserStatus(updatedMembershipData));
    } else {
      const resData = await res.json();
      dispatch(gotServerErr(resData.error.message));
    }
  };
}
