import React, { useEffect, useState, Fragment } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router";
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

/**
 * `PostDetails` renders a post's data in full and a `FavoriteButton` and a
 * `CommentList` components.
 *  Holds logic for creating API calls to...
 * - GET post by post id
 * - GET comment by post id
 * - PATCH post by post id (requires login and user is author)
 * - DELETE post by post id (requires login and user is author)
 */
function PostDetails() {
  const { postId } = useParams<{ postId: string, postTitle: string }>();
  const currUser = useSelector((st: CustomReduxState) => st.user);
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
    // retrieve the post from the API.
    async function getPost() {
      try {
        const postRes = await fetch(`${BASE_URL}/posts/${postId}`);
        const postData = await postRes.json();
        setPost(postData.post);
        setIsAuthor(postData.post.author_id === currUser.id);
      } catch (err) {
        setServerErr("This post either has been deleted or does not exist.");
      }
    }

    // retrieve the comments to the current post from API.
    async function getComments() {
      const commentsRes = await fetch(`${BASE_URL}/comments/${postId}`);
      const commentsData = await commentsRes.json();
      const commentsSortedByCreateDate = commentsData.comments.sort((a: Comment, b: Comment) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setComments(commentsSortedByCreateDate);
    }

    // search for the post in the current redux store's `posts` state
    let foundPost = posts.filter((p: Post) => {
      return p.id === parseInt(postId);
    })[0];

    if (!foundPost) {
      // if the post is not in the current redux store's `posts` state, call getPost()
      getPost();
    } else {
      setIsAuthor(foundPost.author_id === currUser.id);
      setPost(foundPost);
    }
    // retrieve comments for the post.
    getComments();
  }, [postId]);

  const updatePost = async (data: Post) => {
    setServerErr("");
    // requires user login to update a post
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
        // set the updatedPost to the `post` state.
        let updatedPost = { ...post, ...data, ...resData }
        setPost(updatedPost);
        // send dispatch to update the current post in the redux store `posts` state.
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
  
  const postComment = async (postId: number, commentId: number | undefined, isReply: boolean, comment: string) => {
    // requires user login to create a post.
    if (post && _token) {
      const newComment = {
        body: comment,
        post_id: postId,
        reply_to_comment_id: commentId,
        author_id: currUser.id,
        is_reply: isReply
      };
      
      setServerErr("");
      
      try {
        const res = await fetch(`${BASE_URL}/comments`, {
          method: "POST",
          body: JSON.stringify(newComment),
          headers: {
            "Content-type": "application/json"
          }
        });
        const commentData = await res.json();
        if (res.status === 201) {
          // if the comment made is not a reply,
          //   add comment to the current `comment` state
          if (!isReply) {
            setComments((currComments) => [...currComments,
              {
                ...newComment,
                created_at: commentData.created_at,
                id: commentData.id,
                author_name: currUser.display_name,
                reply_count: "0"
              }]);
            }
          } else {
            setServerErr(commentData.error.message);
          }
        } catch (err) {
          setServerErr("Something went wrong with posting a comment");
        }
      }
    }
    
    const handleShowEdit = () => setShowEditForm(true);
    const handleCloseEdit = () => setShowEditForm(false);
    const handleCloseDel = () => setShowDelConf(false);
    const handleShowDel = () => setShowDelConf(true);

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
            <CommentList comments={comments} postId={post.id} postComment={postComment} />
          </Fragment>
        }
      </Container>
    </div>
  );
};

export default PostDetails;