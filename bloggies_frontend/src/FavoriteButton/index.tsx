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

function FavoriteButton({ post }: IProp) {
  const dispatch = useDispatch();
  const favorites = useSelector((st: CustomReduxState) => st.favorites);
  const [favorited, setFavorited] = useState<boolean>(false);
  const posts = useSelector((st: CustomReduxState) => st.posts);

  useEffect(function handleFavoriteStatus() {
    if (isFavorited(post.id, favorites)) {
      setFavorited(true);
    }
  }, []);

  const handleFavorites = async (type: string) => {
    if (!localStorage.getItem("token")) {
      alert("Must be signed in to favorite.");
    } else {
      let currFavCount = parseInt(post.favorite_count);
      switch (type) {
        case "ADD":
          setFavorited(true);
          dispatch(addFavoriteToAPI(post));
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