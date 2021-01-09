import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router";
import { BASE_URL } from "../../config";
import FavoriteButton from "../../FavoriteButton";
import SearchBar from "../../SearchBar";
import "./PostDetails.css";
// if post id is in user's favorite list...
interface Post {
  id: number,
  title: string,
  description: string,
  body: string,
  author_id: number,
  author_name: string,
  created_at: Date,
  last_updated_at: Date
}

function PostDetails() {
  const { postId } = useParams<{ postId: string, postTitle: string }>();
  const [post, setPost] = useState<Post>();

  useEffect(function handleGetPost() {
    async function getPost() {
      const res = await fetch(`${BASE_URL}/posts/${postId}`);
      const postRes = await res.json();
      setPost(postRes.post);
    }
    getPost();
  }, []);

  return (
    <div className="PostDetails mt-5">
      { post ?
        <Container className="PostDetails-post text-left">
          <h2 className="PostDetails-title">{post.title}</h2>
          <div className="text-muted">{post.description}</div>
          <div className="text-muted">Posted by <span className="PostDetails-author">{post.author_name}</span> {new Date(post.created_at).toString()}</div>
          <div className="PostDetails-body">{post.body}</div>
          <FavoriteButton favorited={true}/>
        </Container>
        : <div>loading this page...</div>
      }
    </div>
  );
};

export default PostDetails;