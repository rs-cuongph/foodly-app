import { useScreen } from "usehooks-ts";

function useWindowSize() {
  const screen = useScreen();

  return {
    screenWidth: screen.width,
    screenHeight: screen.height,
    isMobile: screen.width < 768,
    isDesktop: screen.width >= 768,
  };
}

export { useWindowSize };
