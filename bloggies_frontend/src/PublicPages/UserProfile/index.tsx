import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { BASE_URL } from "../../config";
import { Post } from "../../custom";
import FavoritesList from "../../FavoritesList";
import "./UserProfile.css";

function UserProfile() {
  const currUserId = useSelector((st: any) => st.user.id); 
  const { userId, displayName } = useParams<{ userId: string, displayName: string }>();
  const [ isCurrUserProfile , setIsCurrUserProfile ] = useState<boolean>(false);
  const currUserFavs = useSelector((st: any) => st.favorites);
  const [ userFavs, setUserFavs ] = useState<Array<Post>>([]);

  useEffect(function checkProfileOwner() {
    async function getAltUserFavorites() {
      const res = await fetch(`${BASE_URL}/favorites/${userId}`);
      const resData = await res.json();
      setUserFavs(resData.posts);
    }

    // if profile belongs to the current user, use redux data.
    if (parseInt(userId) === currUserId) {
      setIsCurrUserProfile(true);
    } else { 
      // if not current user's profile, fetch the data from backend.
      getAltUserFavorites();
    }
  }, []);

  return (
    <div className="UserProfile">
      <h1 className="mt-4">{displayName.replaceAll("-", " ")}'s profile</h1>
      <FavoritesList displayName={displayName} favorites={isCurrUserProfile ? currUserFavs : userFavs}/>
    </div>
  );
};

export default UserProfile;