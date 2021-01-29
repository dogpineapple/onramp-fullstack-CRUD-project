import { Post, CustomReduxState } from "../custom";
import { ADD_FAVORITE, DELETE_FAVORITE, LOAD_FAVORITES, LOAD_POSTS, LOAD_USER, LOGOUT, LOAD_SEARCH_RESULTS, ADD_POST, DELETE_POST, UPDATE_POST } from "./actionTypes";

const INITIAL_STATE: CustomReduxState = { user: {}, posts: [], favorites: [], searchResults: { posts: [], users: [] }, serverErr: "" };

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
    case LOAD_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload }
    case ADD_FAVORITE:
      const updateAddFavPosts = state.posts.map((p: Post) => {
        // Increment the favorite count of the post
        if (p.id === action.payload.post.id) {
          // POST-SUBMISSION UPDATE: adding a "currentValue variable".
          let currentValue = parseInt(p.favorite_count) || 0;
          const newFavCount = currentValue + 1;
          p.favorite_count = newFavCount.toString();
        }
        return p;
      });
      return { ...state, posts: updateAddFavPosts, favorites: [...state.favorites, action.payload.post] };
    case DELETE_FAVORITE:
      // delete the post from the state's favorites
      let filteredFavorites = state.favorites.filter((f: Post) => {
        return f.id !== action.payload.postId;
      });
      // Decrement the favorite count of the posts
      const updateDelFavPosts = state.posts.map((p: Post) => {
        if (p.id === action.payload.postId) {
          const newFavCount = parseInt(p.favorite_count) - 1;
          p.favorite_count = newFavCount.toString();
        }
        return p;
      });
      return { ...state, posts: updateDelFavPosts, favorites: filteredFavorites };
    case DELETE_POST:
      let filteredPosts = state.posts.filter((p: Post) => {
        return p.id !== action.payload.postId;
      });
      let newFavorites = state.favorites.filter((f: Post) => {
        return f.id !== action.payload.postId;
      });
      return { ...state, posts: filteredPosts, favorites: newFavorites };
    case ADD_POST:
      const newPost = action.payload.post;
      // add in the current user's information 
      newPost.author_name = state.user.display_name;
      newPost.author_id = state.user.id;
      newPost.favorite_count = 0;

      return { ...state, posts: [action.payload.post, ...state.posts] };
    case UPDATE_POST:
      const updatedPost = action.payload.post;
      const updatedPostList = state.posts.map((p: Post) => {
        if (p.id === updatedPost.id) {
          return { ...p, ...updatedPost };
        }
        return p;
      })
      return { ...state, posts: updatedPostList }
    case LOGOUT:
      // reset all states related to a current user.
      return { ...state, user: {}, favorites: [] };
    default:
      return state;
  }
}


export default rootReducer;