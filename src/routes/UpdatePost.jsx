import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PostForm from "../components/PostForm";
import routeStyles from "./route.module.css";
import compStyles from "../components/components.module.css";
import api from "../lib/api";

const UpdatePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const promise = api.post.get(id);
    promise.then((result) => {
      if (result.ok) {
        setPost(result.post);
        console.log(result.post);
      }
    });
  }, []);

  return (
    <div className={routeStyles.createPost}>
      <div className={routeStyles.containerThatCanBeReused}>
        <div className={routeStyles.header}>
          <img
            src="./icons/add-post.svg"
            alt="add post"
            width={36}
            height={36}
          />

          <h2>Edit Post</h2>
        </div>

        {!post ? (
          <div className={compStyles.loader}></div>
        ) : (
          <PostForm action={"update"} post={post} />
        )}

      </div>
    </div>
  );
};

export default UpdatePost;
