import { LOAD_POSTS, LOAD_USER } from "./actionTypes";

const INITIAL_STATE = { user: {}, posts: [], favorites: [] };

interface Action {
  type: string,
  payload: any;
}

function rootReducer(state = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case LOAD_USER:
      return { ...state, user: action.payload.user };
    case LOAD_POSTS:
      return { ...state, posts: action.payload.posts };
    default:
      return state;
  }
}


export default rootReducer;