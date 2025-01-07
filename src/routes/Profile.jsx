import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import routeStyles from "./route.module.css";
import compStyles from "../components/components.module.css";
import PostDisplay from "../components/PostDisplay";
import api from "../lib/api";
import sb from "../lib/supabase";
import { Button, LinkButton } from "../components/InputTypes";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { id } = useParams();
  const auth = useAuth();
  const [user, setUser] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileBuffer, setProfileBuffer] = useState(null);

  useEffect(() => {
    let tempUser = null;
    api.user.get(id).then(result => {
      if (!result.ok) {
        throw new Error(result.message);
      }

      tempUser = result.user;
      setUser(result.user);
      return api.user.getStats(id);
    }).then(result => {
      if (!result.ok) {
        throw new Error(result.message);
      }
      
      setUserStats(result.stats);
      return api.user.followed(id);
    }).then(result => {
      if (!result.ok) {
        throw new Error(result.message);
      }

      setIsFollowed(result.followed);
      return sb.storage.getImage("user-" + tempUser.id, tempUser.image_name);
    }).then(result => {
      setProfileBuffer(result);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
    });
  }, [id]);

  const handleFollow = () => {
    if (isFollowed) {
      api
        .user
        .unfollow(id)
        .then(result => {
          if (result.ok) {
            setIsFollowed(false);
            setUserStats({
              ...userStats,
              followers: userStats.followers - 1,
            })
          } else {
            console.error(result.message);
          }
        });
    } else {
      api
        .user
        .follow(id)
        .then(result => {
          if (result.ok) {
            setIsFollowed(true);
            setUserStats({
              ...userStats,
              followers: userStats.followers + 1,
            })
          } else {
            console.error(result.message);
          }
        });
    }
  };

  return (
    <section className={`${routeStyles.profile} ${routeStyles.containerThatCanBeReused}`}>
      <div className={routeStyles.header}>
        <img
          src="./svgrepo/profile.svg"
          alt="profile icon"
          width={40}
          height={40}
        />
        <h2 className={routeStyles.title}>Profile</h2>
      </div>
      {isLoading ? (
        <div className={compStyles.loader}></div>
      ) : (
        <>
          <div className={routeStyles.profileDisplay}>
            <img
              src={profileBuffer || "./icons/profile-placeholder.svg"}
              alt="profile picture"
              width={128}
              height={128}
            />

            <div className={routeStyles.nameAndHandle}>
              <p className={routeStyles.username}>{user.username}</p>
              <p className={routeStyles.handle}>@{user.handle}</p>
            </div>
            
            <p className={`${routeStyles.bio} ${user.bio ? routeStyles.visible : ""}`}>{user.bio}</p>

            <div className={routeStyles.stats}>
              <div className={routeStyles.stat}>
                <p className={routeStyles.value}>{userStats.followers}</p>
                <p className={routeStyles.label}>Followers</p>
              </div>

              <div className={routeStyles.stat}>
                <p className={routeStyles.value}>{userStats.posts}</p>
                <p className={routeStyles.label}>Posts</p>
              </div>
            </div>

            {auth.user.id !== user.id ? (
              <div className={routeStyles.interactables}>
                <Button type="button0" onClick={handleFollow}>{!isFollowed ? "Follow" : "Unfollow"}</Button>
                <Button type="button0">Block</Button>
              </div>
            ) : (
              <LinkButton to={`/update-profile/${id}`} type="button0">Edit</LinkButton>
            )}
          </div>

          <PostDisplay forUserId={user.id} />
        </>
      )}
    </section>
  );
};

export default Profile;
