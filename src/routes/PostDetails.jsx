import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import routeStyles from "./route.module.css";
import compStyles from "../components/components.module.css";
import { TextArea, TextInput, Button } from "../components/InputTypes";

import { timeAgo } from "../lib/util";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import PostDetailCard from "../components/PostDetailCard";

const PostDetails = () => {
  const auth = useAuth();
  const [post, setPost] = useState(null);
  // the like state by the current user
  const [likeStates, setLikeStates] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    api
      .post
      .get(id)
      .then(result => {
        if (!result.ok) {
          throw new Error(result.message);
        }
        
        setPost(result.post);
        
        return api.post.getComments(id);
      })
      .then(result => {
        if (!result.ok) {
          throw new Error(result.message);
        }
        
        setComments(result.comments);
        
        return api.post.getCommentsLikeState(id);
      })
      .then(result => {
        if (!result.ok) {
          throw new Error(result.message);
        }
        
        setLikeStates(result.likeStates);
        
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  
  console.log(likeStates)
  
  const handleAddComment = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    
    const comment = fd.get("comment");
    
    console.log(id);
    api
      .post
      .addComment(id, comment)
      .then(result => {
        if (result.ok) {
          setComments([...comments, { ...result.comment, username: auth.user.username }]);
        } else {
          console.error(result.message);
        }
      });
      
    e.target.reset();
  };
  
  const handleLikeComment = (commentId) => {
    api
      .post
      .likeComment(id, commentId, true)
      .then(result => {
        if (result.ok) {
          const newState = [...likeStates];
          const newComments = [...comments];
          
          if (newState[commentId - 1].state === "disliked") {
            newComments[comments.length - commentId].dislikes -= 1;
          }
          newState[commentId - 1].state = result.liked ? "liked" : "";
          newComments[comments.length - commentId].likes += result.liked ? 1 : -1;
          setLikeStates(newState);
          setComments(newComments);
        } else {
          console.error(result.message);
        }
      });
  };
  
  const handleDislikeComment = (commentId) => {
    api
      .post
      .likeComment(id, commentId, false)
      .then(result => {
        if (result.ok) {
          const newState = [...likeStates];
          const newComments = [...comments];
          if (newState[commentId - 1].state === "liked") {
            newComments[comments.length - commentId].likes -= 1;
          }
          newState[commentId - 1].state = result.disliked ? "disliked" : "";
          newComments[comments.length - commentId].dislikes += result.disliked ? 1 : -1;
          setLikeStates(newState);
          setComments(newComments);
        } else {
          console.error(result.message);
        }
      });
  };
  
  console.log(comments);
  return (
    <section
      className={`${routeStyles.containerThatCanBeReused} ${routeStyles.postDetails}`}>
      {isLoading ? (
        <div className={compStyles.loader}></div>
      ) : (
        <>
          <PostDetailCard post={post} />
          <div className={routeStyles.commentsSection}>
            <div className={routeStyles.header}>
              <h2>Comments</h2>
              <p>{comments.length}</p>
            </div>
            
            <form onSubmit={handleAddComment}>
              <TextArea
                id="comment"
                name="comment"
                rows="4"
                placeholder="Add comment..."
              />
              
              <Button className={routeStyles.submit}>Submit</Button>
            </form>
            
            <ul className={routeStyles.commentList}>
              {comments.map(comment => (
                <li key={comment.id}>
                  <div className={routeStyles.left}>
                    <img
                      src="./icons/profile-placeholder.svg"
                      alt="profile pic"
                      width={48}
                    />
                  </div>
                  <div className={routeStyles.right}>
                    <div className={routeStyles.detail}>
                      <p className={routeStyles.username}>{comment.username}</p>
                      <p>{timeAgo(comment.created_at_ts)}</p>
                    </div>
                    <p className={routeStyles.comment}>{comment.comment}</p>
                    
                    <div className={routeStyles.buttons}>
                      <div>
                        <button
                          className={routeStyles.thumbsUp}
                          onClick={() => handleLikeComment(comment.id)}
                        >
                          <img
                            src={likeStates[comment.id - 1].state === "liked" ? "./svgrepo/thumbs-up-filled.svg" : "./svgrepo/thumbs-up.svg"}
                            width={32}
                          />
                        </button>
                        <p>{comment.likes}</p>
                      </div>
                      
                      <div>
                        <button
                          className={routeStyles.thumbsDown}
                          onClick={() => handleDislikeComment(comment.id)}
                        >
                          <img
                            src={likeStates[comment.id - 1].state === "disliked" ? "./svgrepo/thumbs-down-filled.svg" : "./svgrepo/thumbs-down.svg"}
                            width={32}
                          />
                        </button>
                        <p>{comment.dislikes}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
};

export default PostDetails;
