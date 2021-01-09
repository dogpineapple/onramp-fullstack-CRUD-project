import { Dispatch } from "react";
import { Action } from "redux";
import { BASE_URL } from "../config";
import { LOAD_POSTS, LOAD_USER } from "./actionTypes";

export function getPostsFromAPI() {
  return async function (dispatch: Dispatch<Action>) {
    const res = await fetch(`${BASE_URL}/posts`);
    const postsRes = await res.json();
    dispatch(gotPosts(postsRes.posts));
  }
}

function gotPosts(posts: Array<any>) {
  return { type: LOAD_POSTS, payload: { posts } };
}

export function gotUserInfo(user: any) {
  return { type: LOAD_USER, payload: { user }};
}