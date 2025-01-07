import { useState, useEffect } from "react";

import api from "../lib/api";
import PostCard from "./PostCard";
import Dropdown from "./Dropdown";

import routeStyles from "../routes/route.module.css";
import compStyles from "./components.module.css";
import { SearchBar } from "./InputTypes";

const sortOptions = ["Newest", "Oldest"];
const typeOptions = ["All", "Saved", "Following"];
const PostDisplay = ({ forUserId }) => {
  const [typeOption, setTypeOption] = useState(0);
  const [sortOption, setSortOption] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPosts = (type) => {
    if (type === "All") {
      let promise;

      if (forUserId) {
        promise = api.post.getUserPosts(forUserId);
      } else {
        promise = api.post.getAll();
      }

      promise.then(result => {
        if (result.ok) {
          setPosts(result.posts);
          setIsLoading(false);
        }
      });
    } else if (type === "Saved") {
      const promise = api.post.getSaves(forUserId);
      promise.then(result => {
        if (result.ok) {
          setPosts(result.posts);
          setIsLoading(false);
        }
      });
    } else if (type === "Following") {
      const promise = api.post.getFollowing(forUserId);
      promise.then(result => {
        if (result.ok) {
          setPosts(result.posts);
          setIsLoading(false);
        }
      });
    }
  };

  const handleSelectType = (idx) => {
    setTypeOption(idx);
    getPosts(typeOptions[idx]);
  };

  useEffect(() => {
    setIsLoading(true);
    setSortOption(0);
    setTypeOption(0);
    setSearchValue("");
    getPosts("All");
  }, [forUserId]);

  const showSearch = !!searchValue;

  let sortedPosts = [...posts];
  if (showSearch) {
    sortedPosts = sortedPosts.filter(post => {
      const sv = searchValue.toLowerCase();
      const an = post.author_name.toLowerCase();
      const cap = post.caption.toLowerCase();
      const tags = post.tags;
      const loc = post.location.toLowerCase();

      if (an.indexOf(sv) !== -1) {
        return true;
      }

      if (cap.indexOf(sv) !== -1) {
        return true;
      }

      if (tags.some(tag => tag.toLowerCase().indexOf(sv) !== -1)) {
        return true;
      }

      if (loc.indexOf(sv) !== -1) {
        return true;
      }

      return false;
    })
  }
  sortedPosts.sort((a, b) => {
    let comp;
    if (sortOptions[sortOption] === "Newest") {
      comp = new Date(a.created_at_ts) > new Date(b.created_at_ts);
    } else {
      comp = new Date(a.created_at_ts) < new Date(b.created_at_ts);
    }
    if (comp) {
      return -1;
    } else {
      return 1;
    }
  });
  return (
    <div className={compStyles.postDisplay}>
    	<section className={`${compStyles.search}`}>
  	   <div className={compStyles.inner}>
  	     <SearchBar
  	       placeholder="Search a tag, caption, username, or location ..."
  	       searchValue={searchValue}
  	       setSearchValue={setSearchValue}
  	      />
  	    </div>

  	    <div className={compStyles.top}>
  	      <h3 className={compStyles.title}>Posts</h3>

  	      <div className={compStyles.dropDowns}>
  	        <Dropdown options={typeOptions} selectedIdx={typeOption} setSelectedIdx={handleSelectType} />
  	        <Dropdown options={sortOptions} selectedIdx={sortOption} setSelectedIdx={setSortOption} />
  	      </div>
  	    </div>
  	  </section>
  	  {isLoading ? (
        <div className={compStyles.loader}></div>
      ) : (
        <ul className={compStyles.postList}>
          {sortedPosts.map(post => (
            <PostCard post={post} key={post.id} />
          ))}
        </ul>
      )}
    </div>
  )
};

export default PostDisplay;
