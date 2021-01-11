import React, { useEffect, useState, Fragment } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { Redirect, useHistory, useParams } from "react-router";
import moment from "moment";
import CommentList from "../../CommentList";
import { BASE_URL } from "../../config";
import FavoriteButton from "../../FavoriteButton";
import "./PostDetails.css";
import { Post, Comment, CustomReduxState } from "../../custom";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import EditFormModal from "../../EditFormModal";
import DeleteModal from "../../DeleteModal";
import { deletePostFromAPI, updateCurrentPost } from "../../redux/actionCreators";
import { changeToURLFriendly } from "../../helpers";


function PostDetails() {
  const { postId } = useParams<{ postId: string, postTitle: string }>();
  const currUserId = useSelector((st: CustomReduxState) => st.user.id);
  const posts = useSelector((st: CustomReduxState) => st.posts);
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Array<Comment>>([]);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [serverErr, setServerErr] = useState<string>("");
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showDelConf, setShowDelConf] = useState<boolean>(false);
  const _token = localStorage.getItem("token");
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(function handleGetPost() {
    async function getPost() {
      try {
        const postRes = await fetch(`${BASE_URL}/posts/${postId}`);
        const postData = await postRes.json();
        setPost(postData.post);
        const commentsRes = await fetch(`${BASE_URL}/comments/${postId}`);
        const commentsData = await commentsRes.json();
        setComments(commentsData.comments);
        setIsAuthor(postData.post.author_id === currUserId);
      } catch (err) {
        setServerErr("This post either has been deleted or does not exist.");
      }
    }

    let foundPost = posts.filter((p: Post) => {
      return p.id === parseInt(postId);
    })[0];

    if (!foundPost) {
      getPost();
    } else {
      setIsAuthor(foundPost.author_id === currUserId);
      setPost(foundPost);
    }

  }, []);

  const handleShowEdit = () => setShowEditForm(true);
  const handleCloseEdit = () => setShowEditForm(false);
  const handleCloseDel = () => setShowDelConf(false);
  const handleShowDel = () => setShowDelConf(true);

  const updatePost = async (data: Post) => {
    setServerErr("");
    if (post && _token) {
      const res = await fetch(`${BASE_URL}/posts/${post.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...data, _token }),
        headers: {
          "Content-type": "application/json"
        }
      });
      const resData = await res.json();
      if (res.status === 200) {
        let updatedPost = { ...post, ...data, ...resData }
        setPost(updatedPost);
        dispatch(updateCurrentPost(updatedPost));
      } else {
        setServerErr(resData.message);
      }
    }
  }

  const deletePost = async () => {
    setServerErr("");
    if (post && _token) {
      dispatch(deletePostFromAPI(post.id, _token));
      history.push("/");
    }
  }

  return (
    <div className="PostDetails mt-5">
      { showEditForm && <EditFormModal show={showEditForm} handleClose={handleCloseEdit} item={post} editItem={updatePost} />}
      { showDelConf && <DeleteModal show={showDelConf} handleClose={handleCloseDel} deletePost={deletePost} />}
      <Container >
        {serverErr && <Alert variant="danger">{serverErr}</Alert>}
        {post &&
          <Fragment>
            <div className="PostDetails-post text-left">
              <Row className="d-flex justify-content-between">
                <Col md={9} className="d-flex align-items-center">
                  <h2 className="PostDetails-title">{post.title} </h2>
                  <FavoriteButton post={post} />
                </Col>
                {/** Edit/Delete buttons show only if current user is the author of the post */}
                {isAuthor && <Col md={3} className="d-flex align-items-center justify-content-end">
                  <Button variant="info" onClick={handleShowEdit}><FontAwesomeIcon icon={faEdit} /> Edit</Button>
                  <Button variant="danger" className="ml-3" onClick={handleShowDel}><FontAwesomeIcon icon={faTrash} /> Delete</Button>
                </Col>}
              </Row>
              <div className="text-muted">{post.description}</div>
              <div className="text-muted">
                Posted by <a href={`/users/${post.author_id}/${changeToURLFriendly(post.author_name)}/favorites`}><span className="App-author">{post.author_name}</span></a> {moment(post.created_at).fromNow()}
                {post.last_updated_at !== post.created_at && <span className="App-update"> (last updated {moment(post.last_updated_at).fromNow()})</span>}</div>
              <div className="PostDetails-body">{post.body}</div>
            </div>
            <CommentList comments={comments} postId={post.id} />
          </Fragment>
        }
      </Container>
    </div>
  );
};

export default PostDetails;