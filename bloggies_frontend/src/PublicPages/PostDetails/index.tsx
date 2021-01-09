import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router";
import moment from "moment";
import CommentList from "../../CommentList";
import { BASE_URL } from "../../config";
import FavoriteButton from "../../FavoriteButton";
import "./PostDetails.css";
import { Post, Comment } from "../../custom";

// if post id is in user's favorite list...
function PostDetails() {
  const { postId } = useParams<{ postId: string, postTitle: string }>();
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Array<Comment>>([]);

  useEffect(function handleGetPost() {
    async function getPost() {
      const postRes = await fetch(`${BASE_URL}/posts/${postId}`);
      const postData = await postRes.json();
      setPost(postData.post);
      const commentsRes = await fetch(`${BASE_URL}/comments/${postId}`);
      const commentsData = await commentsRes.json();
      setComments(commentsData.comments);
    }
    getPost();
  }, []);

  return (
    <div className="PostDetails mt-5">
      { post ?
          <Container >
            <div className="PostDetails-post text-left">
              <div className="d-flex align-items-center">
                <h2 className="PostDetails-title">{post.title} </h2>
                <FavoriteButton post={post} />
              </div>
              <div className="text-muted">{post.description}</div>
              <div className="text-muted">Posted by <span className="App-author">{post.author_name}</span> {moment(post.created_at).fromNow()}</div>
              <div className="PostDetails-body">{post.body}</div>
            </div>
            <CommentList comments={comments} postId={post.id}/>
          </Container>
        : <div>loading this page...</div>
      }
    </div>
  );
};

export default PostDetails;