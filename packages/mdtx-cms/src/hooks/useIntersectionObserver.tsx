import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [inView, setInView] = useState(false);
  const [wasInViewOnce, setWasInViewOnce] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current == null) return;
    const observer = new IntersectionObserver((entries) => {
      setInView(entries[0].isIntersecting);
      if (entries[0].isIntersecting) setWasInViewOnce(true);
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, inView, wasInViewOnce] as const;
};
