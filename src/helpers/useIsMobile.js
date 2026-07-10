import { useEffect, useState } from 'react';

// Reactive, SSR-safe media-query hook. Returns true while the viewport width
// is below `breakpoint` (px). Replaces the ad-hoc window.innerWidth + resize
// listeners that were duplicated across components.
export default function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint - 1}px)`;

  const getMatch = () =>
    typeof window !== 'undefined' && window.matchMedia(query).matches;

  const [isMobile, setIsMobile] = useState(getMatch);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return isMobile;
}
