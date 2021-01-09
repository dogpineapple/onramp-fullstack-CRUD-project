import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import React from "react";
import "./FavoriteButton.css";
import { useDispatch } from "react-redux";

interface IProp {
  favorited: boolean;
}

function FavoriteButton({ favorited }: IProp) {
  const dispatch = useDispatch();
  const handleFavorites = async (type: string) => {
    switch (type) {
      case "ADD": 
      case "DELETE":
      default:
        break;
    }
  }
  return (
    <div className="FavoriteButton">
      { favorited ?
        <FontAwesomeIcon className="FavoriteButton-btn" icon={faHeart} size="1x" onClick={() => handleFavorites("ADD")} />
        :
        <FontAwesomeIcon className="FavoriteButton-btn" icon={farHeart} size="1x" onClick={() => handleFavorites("DELETE")} />
      }
    </div>
  );
};

export default FavoriteButton;