/* StatCounter — animated number counter triggered by IntersectionObserver */
import { useState, useEffect, useRef } from 'react';
import styles from './StatCounter.module.css';

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
    <div className={styles.stat} ref={ref}>
      <div className={styles.icon}>{icon}</div>
      <span className={styles.number}>{count}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
