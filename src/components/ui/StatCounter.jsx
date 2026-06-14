/* StatCounter — animated number counter triggered by IntersectionObserver */
import { useState, useEffect, useRef } from 'react';

export default function StatCounter({ value, label, icon }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount(value);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  function animateCount(target) {
    const duration = 1800;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(step);
  }

  return (
    <div className="flex flex-col items-center gap-2 text-white" ref={ref}>
      <div className="w-10 h-10">{icon}</div>
      <span className="text-3xl md:text-4xl font-bold">{count}</span>
      <span className="text-xs md:text-sm font-medium opacity-90 uppercase tracking-wider">{label}</span>
    </div>
  );
}
