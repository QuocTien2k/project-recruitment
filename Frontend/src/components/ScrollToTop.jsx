import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ duration = 1000 }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const start = window.scrollY;
    const startTime = performance.now();

    function scrollStep(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1); // 0 → 1

      // easing để cuộn mượt
      const easeInOut = 0.5 * (1 - Math.cos(Math.PI * progress));

      window.scrollTo(0, start * (1 - easeInOut));

      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    }

    requestAnimationFrame(scrollStep);
  }, [pathname, duration]);

  return null;
}
