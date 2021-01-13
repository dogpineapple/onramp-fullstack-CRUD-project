import { Post } from "./custom";

/**
 * Returns a boolean.
 * Find whether the post id is in the user's favorites list.
*/
export function isFavorited(postId: number, favorites: Array<Post>) {
  let favorited = false;
  favorites.forEach((fav: Post) => {
    if (fav.id === postId) {
      favorited = true;
    }
  });
  return favorited;
}

/**
 * Returns a new string. 
 * Replaces all spaces for "-" and lowercases entire string.
 */
export function changeToURLFriendly(str: string) {
  if (str) {
    return str.replaceAll(" ", "-").toLowerCase();
  } 
  return 'no-displayname';
}

/**
 * Returns boolean. 
 * Checks whether the data meets the basic length requirements.
 */
export function checkSignUpDataValid(username: string, password: string, repeatPassword: string, display_name: string) {
  return (username.length > 3)
    && (password.length > 5)
    && (display_name.length !== 0)
    && (password === repeatPassword);
}