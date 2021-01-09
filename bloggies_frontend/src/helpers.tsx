import { Post } from "./custom";

// find whether the post id is in the user's favorites list.
// returns boolean
export function isFavorited(postId: number, favorites: Array<Post>) {
  let favorited = false;
  favorites.forEach((fav: any) => {
    if (fav.id === postId) {
      favorited = true;
    }
  });
  return favorited;
}

// replaces all spaces for "-" and lowercases entire string.
// returns a new string
export function changeToURLFriendly(str: string) {
  return str.replaceAll(" ", "-").toLowerCase();
}