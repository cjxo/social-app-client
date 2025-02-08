import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import PropTypes from "prop-types";
import compStyles from "./components.module.css";
import { TextArea, TextInput } from "./InputTypes";
import api from "../lib/api";

const FileUploader = ({ post }) => {
  const [files, setFiles] = useState(post ? [post.image_data] : []);
  const inpRef = useRef(null);

  const onClick = () => {
    inpRef.current.click();
  };

  const onChange = (e) => {
    console.log(e.target.files);

    // for now, single file.
    /*
    const newFiles = [...files];
    for (const file of e.target.files) {
      newFiles.push(URL.createObjectURL(file));
    }*/

    setFiles([URL.createObjectURL(e.target.files[0])]);
  };

  return (
    <div
      className={compStyles.fileUploader}
    >
      <input
        id="file"
        name="file"
        type="file"
        accept=".svg, .png, .jpg"
        ref={inpRef}
        onChange={onChange}
      />

      {files.length ? (
        <>
          <div className={compStyles.fileHolder}>
            <img src={files[0]} />
          </div>

          <div className={compStyles.divider}></div>
          <button type="button" onClick={onClick}>Change File</button>
        </>
      ) : (
        <>
          <div>
            <img
              src="./icons/file-upload.svg"
              width={96}
              alt="Upload File"
            />
            <p>SVG, PNG, JPG</p>
          </div>

          <button type="button" onClick={onClick}>Select File</button>
        </>
    )} 
    </div>
  );
};

const PostForm = ({ post }) => {
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData(e.target);
    const caption = fd.get("caption");
    const file = fd.get("file");
    const location = fd.get("location");
    const tags = fd.get("tags");

    const buf = await file.arrayBuffer();

    if (!post) {
      api
        .post
        .insert(caption, tags ? tags.split(",").map(item => item.trim()) : [], file.name, file.type, location, buf)
        .then((result) => {
          if (result.ok) {
            navigate("/");
          }
        });
    } else {
      console.log(file);
      api
        .post
        .update(post, caption, tags ? tags.split(",").map(item => item.trim()) : [], file.name || post.image_name, file.name ? file.type : post.image_type, location, buf)
        .then((result) => {
          if (result.ok) {
            navigate("/");
          }
        });
    }
  };

  return (
    <form className={compStyles.postForm} onSubmit={onSubmit}>
      <div className={compStyles.labelInputPair}>
        <label htmlFor="caption">Caption</label>
        <TextArea
          id="caption"
          name="caption"
          rows="6"
          defaultValue={post?.caption}
          required
        ></TextArea>
      </div>
      
      <div className={compStyles.labelInputPair}>
        <label htmlFor="file">Add Photos</label>
        <FileUploader post={post} />
      </div>

      <div className={compStyles.labelInputPair}>
        <label htmlFor="location">Add Location</label>
        <TextInput 
          id="location"
          name="location"
          defaultValue={post?.location}
          required
        />
      </div>

      <div className={compStyles.labelInputPair}>
        <label htmlFor="tags">Add Tags (separated by comma ' , ')</label>
        <TextInput
          id="tags"
          name="tags"
          defaultValue={post?.tags.join(", ")}
          placeholder="Art, Learn, ..."
        />
      </div>

      <div className={compStyles.buttons}>
        <button type="button">Cancel</button>
        <button>Submit</button>
      </div>
    </form>
  );
};

export default PostForm;

PostForm.propTypes = FileUploader.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author_id: PropTypes.number.isRequired,
    author_name: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    image_name: PropTypes.string.isRequired,
    image_type: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    created_at_ts: PropTypes.string.isRequired,
  }).isRequired,
};