import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import React, { Fragment } from "react";

interface IProp {
  favorited: boolean;
}

function FavoriteButton({ favorited }: IProp) {
  return (
    <div className="FavoriteButton">
      { favorited ?
      <Fragment>
        <FontAwesomeIcon icon={faHeart} size="1x" />
        <span> Remove from favorites</span>
      </Fragment>
        : 
        <Fragment>
        <FontAwesomeIcon icon={farHeart} size="1x" />
        <span> Add to favorites</span>
        </Fragment>
        }
    </div>
  );
};

export default FavoriteButton;