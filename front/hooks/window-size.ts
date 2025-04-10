import { useEffect, useMemo, useState } from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const isMobile = useMemo(() => windowSize.width < 768, [windowSize.width]);
  const isTablet = useMemo(
    () => windowSize.width >= 768 && windowSize.width < 1024,
    [windowSize.width],
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowSize,
    isMobile,
    isTablet,
  };
};
