import PostForm from "../components/PostForm";
import routeStyles from "./route.module.css";

const CreatePost = () => {
  return (
    <div className={routeStyles.createPost}>
      <div className={routeStyles.containerThatCanBeReused}>
        <div className={routeStyles.header}>
          <img
            src="./svgrepo/plus.svg"
            alt="add post"
            width={36}
            height={36}
          />

          <h2>Create Post</h2>
        </div>

        <PostForm />
      </div>
    </div>
  );
};

export default CreatePost;
