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
        </Fragment>
        :
        <Fragment>
          <FontAwesomeIcon icon={farHeart} size="1x" />
        </Fragment>
      }
    </div>
  );
};

export default FavoriteButton;