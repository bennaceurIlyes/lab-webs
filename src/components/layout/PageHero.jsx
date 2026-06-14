import styles from './PageHero.module.css';

export default function PageHero({ title, subtitle, children }) {
  return (
    <section className={styles.hero} aria-labelledby="page-hero-title">
      <div className={styles.inner}>
        {children && (
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            {children}
          </nav>
        )}
        <h1 id="page-hero-title" className={styles.title}>
          {title}
        </h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </section>
  );
}
