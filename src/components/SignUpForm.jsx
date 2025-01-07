import { useState } from "react";
import compStyles from "./components.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignUpForm = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    const username = fd.get("username");
    const handle = fd.get("handle");
    const email = fd.get("email");
    const password = fd.get("password");
    const conf_password = fd.get("conf_password");

    if (password !== conf_password) {
      setIsError(true);
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    auth
      .signUp(username, handle, email, password)
      .then((result) => {
        setIsLoading(false);
        setIsError(!result.ok);
        setMessage(result.message);
        if (result.ok) {
          e.target.reset();
          navigate("/sign-in");
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

  return(
    <>
      <div className={compStyles.authLogo}>
        <h1>Social App</h1>
        <h2>Create new account</h2>
        <p>To use your Snapgram, enter your account details</p>
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
            <label htmlFor="handle">Handle</label>
            <input type="text" id="handle" name="handle" required />
          </div>

          <div className={compStyles.textLabelPair}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className={compStyles.textLabelPair}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>

          <div className={compStyles.textLabelPair}>
            <label htmlFor="conf_password">Confirm Password</label>
            <input type="password" id="conf_password" name="conf_password" required />
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
              Already have an account? <Link to="/sign-in">Sign In</Link>
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

export default SignUpForm;
