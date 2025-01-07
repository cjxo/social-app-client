import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import compStyles from "./components.module.css";

const bottombarLinks = [
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
    label: "Create",
  },
];

const BottomBar = () => {
  const loc  = useLocation();
  const auth = useAuth();

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <section className={compStyles.bottombar}>
      <ul>
        {bottombarLinks.map(link => {
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
    </section>
  );
};

export default BottomBar;
