import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import BlogList from "../../BlogList";
import { BASE_URL } from "../../config";
import { Post } from "../../custom";
import FavoritesList from "../../FavoritesList";
import "./UserProfile.css";

function UserProfile() {
  const currUserId = useSelector((st: any) => st.user.id);
  const { userId, displayName } = useParams<{ userId: string, displayName: string }>();
  const [isCurrUserProfile, setIsCurrUserProfile] = useState<boolean>(false);
  const currUserFavs = useSelector((st: any) => st.favorites);
  const [userFavs, setUserFavs] = useState<Array<Post>>([]);
  const [userPosts, setUserPosts] = useState<Array<Post>>([]);
  const [serverErr, setServerErr] = useState("");

  useEffect(function checkProfileOwner() {
    async function getAltUserFavorites() {
      try {
        const favRes = await fetch(`${BASE_URL}/favorites/${userId}`);
        const favData = await favRes.json();
        setUserFavs(favData.posts);
        const userPostsRes = await fetch(`${BASE_URL}/posts/user/${userId}`);
        const userPostsData = await userPostsRes.json();
        setUserPosts(userPostsData.posts);
      } catch (err) {
        setServerErr("This user does not exist.");
      }
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
    <Container className="UserProfile">
      <h1 className="mt-4">{displayName.replaceAll("-", " ")}'s profile</h1>
      { serverErr && <Alert>{serverErr}</Alert>}
      <Row>
        <Col md={6}>
          <Container>
            <Row>
              <h3 className="mt-4">Publications</h3>
            </Row>
            <Row>
              <BlogList posts={userPosts} />
            </Row>
          </Container>
        </Col>
        <Col md={6}>
          <FavoritesList favorites={isCurrUserProfile ? currUserFavs : userFavs} />
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;