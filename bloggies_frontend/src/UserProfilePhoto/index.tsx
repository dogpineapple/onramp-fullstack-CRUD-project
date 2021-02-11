import React from "react";
import { DEFAULT_PROFILE_PHOTO } from "../config";
import "./UserProfilePhoto.css";

interface IProps {
  username: string,
  photoUrl: string,
  handlePhotoClick: Function,
  width: string
}

function UserProfilePhoto({ username, photoUrl, handlePhotoClick, width }: IProps) {
  const style = {
    width,
    height: width
  }

  return (
    <div className="UserProfilePhoto">
      <div className="UserProfilePhoto-wrapper" style={style}>
        <img src={photoUrl || DEFAULT_PROFILE_PHOTO} alt={username} onClick={() => handlePhotoClick()}/>
      </div>
    </div>
  );
};

export default UserProfilePhoto;