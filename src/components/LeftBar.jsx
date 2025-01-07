import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import compStyles from "./components.module.css";

export const sidebarLinks = [
  {
    imgURL: "./svgrepo/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "./svgrepo/people.svg",
    route: "/all-users",
    label: "People",
  },
  {
    imgURL: "./svgrepo/plus.svg",
    route: "/create-post",
    label: "Create Post",
  },
];

const LeftBar = () => {
  const loc  = useLocation();
  const auth = useAuth();

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <nav className={compStyles.leftbar}>
      <Link to="/">
        <h1>Social App</h1>
      </Link>

      <ul>
        {sidebarLinks.map(link => {
          const isActive = loc.pathname === link.route;
          return (
            <li
              key={link.label}
            >
              <Link to={link.route} className={isActive ? compStyles.active : ""}>
                <img 
                  src={link.imgURL}
                  alt={link.label}
                />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

     <Link
        to={`/profile/${auth.user.id}`}
        state={auth.user}
        className={compStyles.profile}>
        <img
          src={auth.profileBuffer || "./icons/profile-placeholder.svg"}
          alt="profile picture"
        />
        <div className={compStyles.nameAndHandle}>
          <p className={compStyles.name}>{auth.user.username}</p>
          <p className={compStyles.handle}>@{auth.user.handle}</p>
        </div>
      </Link>
      <button className={compStyles.signOutBtn} onClick={handleSignOut}>
        <img 
          src={"./svgrepo/signout.svg"}
          alt={"Sign Out"}
        />
        Sign Out
      </button>
    </nav>
  );
};

export default LeftBar;
