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
    // POST-SUBMISSION UPDATE: replace .replaceAll with .replace to allow more browser capability.
    return str.replace(/ /g, "-").toLowerCase();
  } 
  return 'no-displayname';
}

/**
 * Returns a new string. 
 * Replaces all "-" for " ".
 */
export function removeStrDashes(str: string) {
  if (str) {
    // POST-SUBMISSION UPDATE: replace .replaceAll with .replace to allow more browser capability.
    return str.replace(/-/g, " ");
  } 
  return 'no displayname';
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

/**
 * Returns cookie value
 * Retrieves the value of a cookie by cookie's key.
 * Credit: https://stackoverflow.com/questions/10730362/get-cookie-by-name
 */
export function getCookie(name: string) {
  let cookie: any = {};
  document.cookie.split(';').forEach(function(el) {
    let [k,v] = el.split('=');
    cookie[k.trim()] = v;
  })
  return cookie[name];
}