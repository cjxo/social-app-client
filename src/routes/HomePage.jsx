import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import LeftBar from "../components/LeftBar";
import BottomBar from "../components/BottomBar";
import routeStyles from "./route.module.css";
import compStyles from "../components/components.module.css";

const HomePage = () => {
  const [maxHeightDisplay, setMaxHeightDisplay] = useState("0px");
  
  useEffect(() => {
    const updateMaxHeight = () => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerHeight
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight
      const topBar = document.querySelector(`.${compStyles.topBar}`);
      const bottomBar = document.querySelector(`.${compStyles.bottombar}`);
      if (bottomBar && topBar) {
        const viewportHeight = window.innerHeight;
        const maxHeight = viewportHeight - topBar.offsetHeight - bottomBar.offsetHeight;
        setMaxHeightDisplay(maxHeight + "px");
        return true;
      } else if (document.querySelector(`.${compStyles.leftbar}`)) {
        setMaxHeightDisplay("100vh");
        return true;
      }

      return false;
    };

    const observer = new MutationObserver(() => {
      if (updateMaxHeight()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('resize', updateMaxHeight);

    return () => {
      window.removeEventListener('resize', updateMaxHeight);
    };

  }, []);
  
  console.log(maxHeightDisplay);

  return (
    <section className={routeStyles.homepage}>
      <TopBar />
      <LeftBar />

      <section
        className={routeStyles.mainDisplay}
        style={{ maxHeight: maxHeightDisplay }}
      >
        <Outlet />
      </section>

      <BottomBar />
    </section>
  );
};

export default HomePage;
