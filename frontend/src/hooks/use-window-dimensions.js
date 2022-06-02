import { useState, useEffect } from "react";

// return window's width and height
const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

/* Custom hook in order to get displayed window's dimensions and handle window's resize
 *
 * Returns:
 * width (float): window's width
 * height (float): window's height
 */
const useWindowDimensions = () => {
  // current dimensions of the window
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    // handle resize - get window's new dimensions and change <windowDimensions> state accordingly
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    // on window resize, call <handleResize> function
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
