import { useEffect, useState } from "react";

export const useUnderMobileWindow = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (only execute this code on the client side)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia("(max-width: 600px)");

    // Set the initial state based on the media query
    setIsMobile(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // Attach the listener to the media query
    mediaQuery.addEventListener("change", handleMediaChange);

    // Clean up the listener on component unmount
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  return { isMobile };
};