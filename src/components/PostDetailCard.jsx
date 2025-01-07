import { Link } from "react-router-dom";
import compStyles from "./components.module.css";

import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../lib/util";
import PostStats from "./PostStats";

const PostDetailCard = ({ post }) => {
  const auth = useAuth();
  
  const handleDeletePost = () => {
  };
  
  return (
    <div className={compStyles.postDetailCard}>
      <img
        src={post?.image_data}
        alt="creator"
        className={compStyles.postImg}
      />
      <div className={compStyles.side}> 
        <div className={compStyles.bottom}>
          <img
            src="./icons/profile-placeholder.svg"
            alt="profile pic"
            className={compStyles.profilePic}
          />
          
          <div className={compStyles.postDetail}>
            <p>{post.author_name}</p>
            <div>
              <p>{timeAgo(post.created_at_ts)}</p>
              -
              <p>{post.location}</p>
            </div>
          </div>
  
          <div className={compStyles.buttons}>
            <Link
              to={`/update-post/${post.id}`}
              className={
                (auth.user.id === post.author_id) ? compStyles.visible : compStyles.hidden
              }
            >
              <img
                src="./svgrepo/edit.svg"
                alt="edit"
                width={24}
                height={24}
              />
            </Link>
  
            <button
              className={`${compStyles.deletePostBtn} ${(auth.user.id === post.author_id) ? compStyles.visible : compStyles.hidden}`}
              onClick={handleDeletePost}
            >
                <img
                  src="./svgrepo/delete.svg"
                  alt="delete"
                />
            </button>
          </div>
        </div>
        <div className={compStyles.divider0}></div>
          
        <div className={compStyles.postDetail}>
          <p>{post.caption}</p>
          <ul>
            {post.tags.map(tag => (
              <li key={tag}>
                #{tag}
              </li>
            ))}
          </ul>
        </div>
  
        <div className={compStyles.stats}>
          <PostStats post={post} userId={auth.user.id} />
        </div>
      </div>
    </div>
  );
};

export default PostDetailCard;