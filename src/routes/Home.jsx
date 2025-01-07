import { useState, useEffect } from "react";

import PostDisplay from "../components/PostDisplay";
import routeStyles from "./route.module.css";
import compStyles from "../components/components.module.css";

const Home = () => {
  return (
    <div className={`${routeStyles.home} ${routeStyles.containerThatCanBeReused}`}>
      <div className={routeStyles.header}>
        <h2>Home Page</h2>
      </div>
    
      <PostDisplay />
    </div>
  );
};

export default Home;
