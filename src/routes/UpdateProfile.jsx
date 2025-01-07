import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import routeStyles from "./route.module.css";
import compStyles from "../components/components.module.css";
import { LinkButton, Button, TextArea, TextInput } from "../components/InputTypes";
import { useAuth } from "../context/AuthContext";
import sb from "../lib/supabase";
import api from "../lib/api";

const errUsername = 0;
const errHandle = 1;
const errEmail = 2;
const errBio = 3;
const errPassword = 4;

const UpdateProfile = () => {
  const fileInpRef = useRef(null);
  const [profilePic, setProfilePic] = useState();
  const navigate = useNavigate();
  const auth = useAuth();
  const [errorMessages, setErrorMessages] = useState(Array(5).fill(""));

  const user = auth.user;
  console.log(auth);
  useEffect(() => {
    setProfilePic(auth.profileBuffer);
  }, [auth.isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fd = new FormData(e.target);
    
    const username = fd.get("username");
    const handle = fd.get("handle");
    const email = fd.get("email");
    const bio = fd.get("bio");
    const file = fd.get("file");
    const password = fd.get("password");
    const confirmPassword = fd.get("confirm_password");
    
    const newErrorMessages = Array(5).fill("");
 
    if (password !== confirmPassword) {
      newErrorMessages[errPassword] = "Passwords do not match.";
      setErrorMessages(newErrorMessages);
      return;
    }

    const buf = await file.arrayBuffer();
    
    auth
      .update(username, handle, email, bio, password, file.name, file.type, buf)
      .then(result => {
        if (result.ok) {
          navigate(`/profile/${user.id}`);
          setErrorMessages(newErrorMessages);
        } else {
          setErrorMessages(result.errMessages);
        }
      });
  };

  const handleAddFile = (e) => {
    const url = URL.createObjectURL(e.target.files[0]);
    setProfilePic(url);
  };

  return (
    <section className={`${routeStyles.updateProfile} ${routeStyles.containerThatCanBeReused}`}>
      <div className={routeStyles.header}>
        <img
          src="./svgrepo/edit.svg"
          alt="edit"
          width={40}
          height={40}
        />
        <h2 className={routeStyles.title}>Update Profile</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className={routeStyles.top}>
          <img
            src={profilePic || "./icons/profile-placeholder.svg"}
            alt="profile picture"
            className={routeStyles.profilePic}
          />
          <div className={routeStyles.options}>
            <input
              id="file"
              name="file"
              type="file"
              accept=".svg, .png, .jpg"
              ref={fileInpRef}
              onChange={handleAddFile}
            />
            <Button
              submit={false}
              onClick={() => fileInpRef.current.click()}
            >
              Pick
            </Button>
            <Button
              type="button1"
              submit={false}
              onClick={() => setProfilePic("")}
            >
              Remove
            </Button>
          </div>
        </div>
        
        <div className={routeStyles.middle}>
          <div
            className={`${routeStyles.errorMsg} ${errorMessages[errUsername] ? routeStyles.visible : ""}`}
          >
            {errorMessages[errUsername]}
          </div>
          <div className={routeStyles.labelInputPair}>
            <label htmlFor="username">Username</label>
            <TextInput
              id="username"
              name="username"
              defaultValue={user.username}
            />
          </div>
          
          <div
            className={`${routeStyles.errorMsg} ${errorMessages[errHandle] ? routeStyles.visible : ""}`}
          >
            {errorMessages[errHandle]}
          </div>
          <div className={routeStyles.labelInputPair}>
            <label htmlFor="handle">Handle</label>
            <TextInput
              id="handle"
              name="handle"
              defaultValue={user.handle}
            />
          </div>

          <div
            className={`${routeStyles.errorMsg} ${errorMessages[errEmail] ? routeStyles.visible : ""}`}
          >
            {errorMessages[errEmail]}
          </div>
          <div className={routeStyles.labelInputPair}>
            <label htmlFor="email">Email</label>
            <TextInput
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
            />
          </div>
          
          { /* not likely... */ }
          <div
            className={`${routeStyles.errorMsg} ${errorMessages[errBio] ? routeStyles.visible : ""}`}
          >
            {errorMessages[errBio]}
          </div>
          <div className={routeStyles.labelInputPair}>
            <label htmlFor="bio">Bio</label>
            <TextArea
              id="bio"
              name="bio"
              rows="5"
              defaultValue={user.bio}
            ></TextArea>
          </div>
          
          <div
            className={`${routeStyles.errorMsg} ${errorMessages[errPassword] ? routeStyles.visible : ""}`}
          >
            {errorMessages[errPassword]}
          </div>
          <div className={routeStyles.labelInputPair}>
            <label htmlFor="password">Password</label>
            <TextInput
              id="password"
              name="password"
              type="password"
            />
          </div>
          <div className={routeStyles.labelInputPair}>
            <label htmlFor="confirm_password">Confirm Password</label>
            <TextInput
              id="confirm_password"
              name="confirm_password"
              type="password"
            />
          </div>
        </div>
        
        <div className={routeStyles.bottom}>
          <LinkButton
            className={routeStyles.submit}
            submit={false}
            to={`/profile/${user.id}`}
          >
            Cancel
          </LinkButton>
          <Button
            className={routeStyles.submit}
          >
            Update
          </Button>
        </div>
      </form>
    </section>
  );
};

export default UpdateProfile;
