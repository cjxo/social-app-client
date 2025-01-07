import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import PostStats from "./PostStats";

import compStyles from "./components.module.css";
import { timeAgo } from "../lib/util";

const PostCard = ({ post }) => {
  const auth = useAuth();

  return (
    <li className={compStyles.postCard}>
      <div className={compStyles.postHeader}>
        <div className={compStyles.postBar}>
          <Link to={`/profile/${post.author_id}`}>
            <img
              src={"/icons/profile-placeholder.svg"}
              alt="profile"
              className={compStyles.profilePic}
            />
          </Link>
        
          <div className={compStyles.postDetail}>
            <p>{post.author_name}</p>
            <div>
              <p>{timeAgo(post.created_at_ts)}</p>
              -
              <p>{post.location}</p>
            </div>
          </div> 
        </div>

        <Link
          to={`/update-post/${post.id}`}
          state={{ post }}
          className={(auth.user.id !== post.author_id) ? compStyles.hideEditLink : ""}
        >
          <img
            src={"./svgrepo/edit.svg"}
            alt={"edit"}
            width={20}
          />
        </Link>
      </div>
      <Link
        to={`/posts/${post.id}`}
        className={compStyles.linkToPost}
      >
        <div className={compStyles.quickPost}>
          <p>{post.caption}</p>
          <ul>
            {post.tags.map(tag => (
              <li key={tag}>
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      
        <img
          src={post.image_data}
          className={compStyles.postImage}
        />
      </Link>

      <PostStats post={post} userId={auth.user.id} />
    </li>
  );
};

export default PostCard;
