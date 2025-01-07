import { useState } from "react";
import compStyles from "./components.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignInForm = () => {
  const auth = useAuth();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    const username = fd.get("username");
    const password = fd.get("password");

    setIsLoading(true);
    auth
      .signIn(username, password)
      .then((result) => {
        setIsLoading(false);
        setIsError(!result.ok);
        setMessage(result.message);
        if (result.ok) {
          e.target.reset();
          navigate("/");
        }
      });
  };
  
  const handleAnonSignIn = () => {
    auth.anon().then(result => {
      setIsLoading(false);
      setIsError(!result.ok);
      setMessage(result.message);
      if (result.ok) {
        navigate("/");
      }
    });
  };
  
  return (
    <>
      <div className={compStyles.authLogo}>
        <h1>Social App</h1>
        <h2>Sign In to Your Account</h2>
        <p>Welcome back. Please enter your details.</p>
        <p
          style={{ display: message ? "block" : "none" }}
          className={`${compStyles.message} ${!isError ? compStyles.success : ""}`}>
          {message}
        </p>
        <form
          className={compStyles.authForm}
          onSubmit={onSubmit}
        >
          <div className={compStyles.textLabelPair}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>

          <div className={compStyles.textLabelPair}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          
          <button disabled={isLoading} type="submit">
            {
              isLoading ? (
                <>
                  <div className={compStyles.loader}>
                  </div>
                  Loading...
                </>
              ) : (
                "Submit"
              )
            }
          </button>

          <div className={compStyles.bottom}>
            <p>
              Do not have an account? <Link to="/sign-up">Sign Up</Link>
            </p>
            
            <div className={compStyles.or}>
              <div></div><p><em>Or</em></p><div></div>
            </div>
            
            <button type="button" onClick={handleAnonSignIn}>Anonymous Sign In</button>
          </div>
        </form>
      </div>
    </>
  )
};

export default SignInForm;
