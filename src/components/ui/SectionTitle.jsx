/* SectionTitle — section heading with left blue accent border */
import styles from './SectionTitle.module.css';

export default function SectionTitle({ title, subtitle, centered = false, rightLink, rightLinkText }) {
  return (
    <div className={`${styles.wrapper} ${centered ? styles.centered : ''}`}>
      <div className={styles.titleRow}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {rightLink && (
          <a href={rightLink} className={styles.rightLink}>
            {rightLinkText}
          </a>
        )}
      </div>
    </div>
  );
}
