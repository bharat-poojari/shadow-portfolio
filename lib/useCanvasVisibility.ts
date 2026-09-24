import { useEffect, useRef, useState } from 'react';

export function useCanvasVisibility<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = elementRef.current;

    if (!element || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [elementRef, visible] as const;
}
