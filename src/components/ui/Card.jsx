/* Card — generic white card container with hover effects */
import styles from './Card.module.css';

export default function Card({ children, className = '', onClick }) {
  return (
    <article className={`${styles.card} ${className}`} onClick={onClick}>
      {children}
    </article>
  );
}
