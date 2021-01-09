import React, { Fragment, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import CommentList from "../../CommentList";
import { BASE_URL } from "../../config";
import FavoriteButton from "../../FavoriteButton";
import "./PostDetails.css";
import { Post, Comment } from "../../custom";

// if post id is in user's favorite list...
function PostDetails() {
  const { postId } = useParams<{ postId: string, postTitle: string }>();
  const favorites = useSelector((st: any) => st.favorites);
  const [post, setPost] = useState<Post>();
  const [favorite, setFavorite] = useState<boolean>(false);
  const [comments, setComments] = useState<Array<Comment>>([]);

  useEffect(function handleGetPost() {
    async function getPost() {
      const postRes = await fetch(`${BASE_URL}/posts/${postId}`);
      const postData = await postRes.json();
      setPost(postData.post);
      // find whether the post id is in the user's favorites list.
      if (favorites.indexOf(postData.post.id) !== -1) {
        setFavorite(true);
      }
      const commentsRes = await fetch(`${BASE_URL}/comments/${postId}`);
      const commentsData = await commentsRes.json();
      setComments(commentsData.comments);

    }
    getPost();
  }, []);

  return (
    <div className="PostDetails mt-5">
      { post ?
        <Fragment>
          <Container className="PostDetails-post text-left">
            <div className="d-flex align-items-center">
              <h2 className="PostDetails-title">{post.title} </h2>
              <FavoriteButton favorited={favorite} />
            </div>
            <div className="text-muted">{post.description}</div>
            <div className="text-muted">Posted by <span className="App-author">{post.author_name}</span> {new Date(post.created_at).toString()}</div>
            <div className="PostDetails-body">{post.body}</div>
          </Container>
          <CommentList comments={comments} />
        </Fragment>
        : <div>loading this page...</div>
      }
    </div>
  );
};

export default PostDetails;