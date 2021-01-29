import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import React, { useEffect, useState } from "react";
import "./FavoriteButton.css";
import { useDispatch, useSelector } from "react-redux";
import { addFavoriteToAPI, deleteFavoriteFromAPI } from "../redux/actionCreators";
import { CustomReduxState, Post } from "../custom";
import { isFavorited } from "../helpers";

interface IProp {
  post: Post
}

/**
 * `FavoriteButton` renders a Heart icon and displays the number of favorites for a post.
 *  *Only logged in users may use the button*
 * `FavoriteButton` handles the logic for dispatching `addFavoriteToAPI` and `deleteFavoriteFromAPI`
 */
function FavoriteButton({ post }: IProp) {
  const dispatch = useDispatch();
  const favorites = useSelector((st: CustomReduxState) => st.favorites);
  const [favorited, setFavorited] = useState<boolean>(false);
  const posts = useSelector((st: CustomReduxState) => st.posts);

  //**FIXED**: Fix issue where the setFavorited doesn't change when a user clicks "unfavorite"
  // on the same post, but different card. 
  // ex. User clicks the FavoriteButton to unfavorite their published post: `post id 1` from the `Favorites List`.
  // The `post id 1` card in their published post list is still solid.

  // If the post is found in the redux store's `favorites` state, 
  // set favorited to true.
  useEffect(function handleFavoriteStatus() {
    if (isFavorited(post.id, favorites)) {
      setFavorited(true);
    } else {
      // POST-SUBMISSION UPDATE: Add an else statement to setFavorited to false.
      setFavorited(false);
    }
    // POST-SUBMISSION UPDATE: Add `favorites` to the dependency array to rerender when favorites changes.
  }, [favorites]);

  /**
   * Dispatches action creators depending on `type` input.
   * (Only allows logged in users to invoke dispatch)
   */
  const handleFavorites = async (type: string) => {
    if (!localStorage.getItem("token")) {
      alert("Must be signed in to favorite.");
    } else {
      let currFavCount = parseInt(post.favorite_count);
      switch (type) {
        case "ADD":
          setFavorited(true);
          dispatch(addFavoriteToAPI(post));
          // if the redux store's `posts` state is empty, 
          //    the component need to manually update the favCount to display.
          if (posts.length === 0) {
            post.favorite_count = (currFavCount + 1).toString();
          }
          break;
        case "DELETE":
          setFavorited(false);
          dispatch(deleteFavoriteFromAPI(post.id));
          if (posts.length === 0) {
            post.favorite_count = (currFavCount - 1).toString();
          }
          break;
        default:
          break;
      }
    }
  }

  return (
    <div className="FavoriteButton d-flex align-items-center">
      { favorited ?
        <FontAwesomeIcon className="FavoriteButton-btn" icon={faHeart} size="1x" onClick={() => handleFavorites("DELETE")} />
        :
        <FontAwesomeIcon className="FavoriteButton-btn" icon={farHeart} size="1x" onClick={() => handleFavorites("ADD")} />
      }
      <span>{post.favorite_count}</span>
    </div>
  );
};

export default FavoriteButton;