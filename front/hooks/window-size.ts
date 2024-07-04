import { useLayoutEffect, useState } from "react";

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return {
    screenWidth: size[0],
    screenHeight: size[1],
    isMobile: size[0] < 768,
    isDesktop: size[0] >= 768,
  };
}

export { useWindowSize };
