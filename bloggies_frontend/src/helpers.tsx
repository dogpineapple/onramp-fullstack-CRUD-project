import { Post } from "./custom";

export function isFavorited(postId: number, favorites: Array<Post>) {
  // find whether the post id is in the user's favorites list.
  let favorited = false;
  favorites.forEach((fav: any) => {
    if (fav.id === postId) {
      favorited = true;
    }
  });
  return favorited;
}