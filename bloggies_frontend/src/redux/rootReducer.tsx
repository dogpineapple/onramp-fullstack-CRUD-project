import { LOAD_FAVORITES, LOAD_POSTS, LOAD_USER, LOGOUT } from "./actionTypes";

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
    case LOAD_FAVORITES:
      return { ...state, favorites: action.payload.favorites }; 
    case LOGOUT:
      return { ...state, user: {}, favorites: []};
    default:
      return state;
  }
}


export default rootReducer;