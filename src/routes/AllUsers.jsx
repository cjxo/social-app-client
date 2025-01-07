import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import routeStyles from "./route.module.css";
import compStyles from "../components/components.module.css";
import { Button, SearchBar } from "../components/InputTypes";
import api from "../lib/api";
import sb from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const AllUsers = () => {
  const auth = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [follows, setFollows] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    api.user.getAll().then(result => {
      if (!result.ok) {
        throw new Error(result.message);
      }

      const mapUsers = async () => {
        const m = [];
        for (let idx = 0; idx < result.users.length; ++idx) {
          const user = result.users[idx];
          const profileBuffer = await sb.storage.getImage("user-" + user.id, user.image_name);
          m.push({ ...user, profileBuffer });
        }

        return m;
      };

      return mapUsers();
    }).then(result => {
      setUsers(result);
      return api.user.getAllFollowing();
    }).then(result => {
      if (!result.ok) {
        throw new Error(result.message);
      }

      // console.log(result.following.map(follow => follow.to_follow));
      setFollows(result.following.map(follow => follow.to_follow));
      setIsLoading(false);
    }).catch (err => {
      console.error(err);
    });
  }, []);

  const handleFollow = (id) => {
    const idx = follows.indexOf(id);

    if (idx !== -1) {
      api
        .user
        .unfollow(id)
        .then(result => {
          if (result.ok) {
            setFollows(follows.toSpliced(idx));
          } else {
            console.error(result.message);
          }
        });
    } else {
      api
        .user
        .follow(id)
        .then(result => {
          if (result.ok) {
            setFollows([...follows, id]);
          } else {
            console.error(result.message);
          }
        });
    }
  };
  
  const likeToSearch = !!searchValue;
  
  let filteredUsers = users;
  if (likeToSearch) {
    filteredUsers = users.filter(user => {
      const sv = searchValue.toLowerCase();
      const un = user.username;
      
      if (un.indexOf(sv) !== -1) {
        return true;
      }
        
      return false;
    });
  }

  return (
    <section className={`${routeStyles.allUsers} ${routeStyles.containerThatCanBeReused}`}>
      <div className={routeStyles.header}>
        <img
          src="./svgrepo/people.svg"
          width={40}
          height={40}
          alt="people icon"
        />
        <h2 className={routeStyles.title}>People</h2>
      </div>
      
      <SearchBar
        placeholder="Search a user..."
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />

      {isLoading ? (
        <div className={compStyles.loader}></div>
      ) : (
        <ul className={routeStyles.userList}>
          {filteredUsers.map(user => (
            (user.id === auth.user.id) ? (
              null
            ) : (
              <li key={user.id}>
                <Link to={`/profile/${user.id}`} state={user}>
                  <img
                    src={user.profileBuffer || "./icons/profile-placeholder.svg"}
                    alt="profile pic"
                  />
                </Link>

                <div className={routeStyles.bottom}>
                  <Link to={`/profile/${user.id}`} className={routeStyles.userStuff} state={user}>
                    <p>{user.username}</p>
                    <p className={routeStyles.handle}>@{user.handle}</p>
                  </Link>
                  <Button type="button0" onClick={() => handleFollow(user.id)}>{!follows.includes(user.id) ? "Follow" : "Unfollow"}</Button>
                </div>
              </li>
            )
          ))}
        </ul>
      )}
    </section>
  );
};

export default AllUsers;
