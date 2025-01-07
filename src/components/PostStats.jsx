import { useState } from "react";
import compStyles from "./components.module.css";

import api from "../lib/api";

const PostStats = ({ post, userId }) => {
  const [userLikes, setUserLikes] = useState([]);
  const [savedByUser, setSavedByUser] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useState(() => {
    const likePromise = api.post.getLikes(post.id);
    likePromise.then((result) => {
      if (result.ok) {
        setUserLikes(result.likes);
      } else {
        console.error(result.message);
      }
    });

    const savePromise = api.post.isSaved(post.id);
    savePromise.then((result) => {
      if (result.ok) {
        setSavedByUser(result.saved);
      } else {
        console.error(result.message);
      }
    });
  }, []);

  console.log(userLikes);
  const likedByUser = userLikes.find(user => user.id === userId) !== undefined;

  const handleLikePost = (e) => {
    setIsLiking(true);
    const promise = api.post.like(post.id);
    promise.then((result) => {
      if (result.ok) {
        let newLikes = [...userLikes];
        if (likedByUser) {
          newLikes = newLikes.filter(user => user.id !== userId);
        } else {
          newLikes.push({ id: userId });
        }

        setUserLikes(newLikes);
      }
      setIsLiking(false);
    });
  };

  const handleSavePost = (e) => {
    const promise = api.post.save(post.id);
    setIsSaving(true);
    promise.then((result) => {
      if (result.ok) {
        setSavedByUser(!savedByUser);
      }
      setIsSaving(false);
    });
  };

  return (
    <div className={compStyles.postStats}>
      <div className={compStyles.stat}>
        <button
          className={compStyles.statBtn}
          onClick={handleLikePost}
        >
          {isLiking ? (
            <div className={compStyles.loader}></div>
          ) : (
            <img
              src={likedByUser ? "./svgrepo/heart-filled.svg" : "./svgrepo/heart.svg"}
              alt="like"
              width={20}
            />
          )} 
        </button>
        <p>{userLikes.length}</p>
      </div>

      <div className={compStyles.stat}>
        <button
          className={compStyles.statBtn}
          onClick={handleSavePost}
        >
          {isSaving ? (
            <div className={compStyles.loader}></div>
          ) : (
            <img
              src={savedByUser ? "./svgrepo/bookmark-filled.svg" : "./svgrepo/bookmark.svg"}
              alt="save"
              width={20}
            />
          )} 
        </button>
      </div>
    </div>
  );
};

export default PostStats;
