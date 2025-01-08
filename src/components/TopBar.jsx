import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import compStyles from "./components.module.css";

const TopBar = () => {
  const auth = useAuth();

  const handleSignOut = () => {
    auth.signOut();
  };
  
  return (
    <section className={compStyles.topBar}>
      <div>
        <Link to="/">
          Social App
        </Link>
        <div>
          <button onClick={handleSignOut}>
            <img
              src="./svgrepo/signout.svg"
              alt="Sign Out"
            />
          </button>

          <Link to={`/profile/${auth.user.id}`}>
            <img
              src={auth.profileBuffer || "./icons/profile-placeholder.svg"}
              alt="profile picture"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopBar;