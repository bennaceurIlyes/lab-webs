/* PublicationsList — recent publications in a table-style list */
import { useEffect, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import { publications } from '../../data/publications';
import SectionTitle from '../ui/SectionTitle';
import styles from './PublicationsList.module.css';

export default function PublicationsList() {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const rowsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    rowsRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} aria-label={t('pubTitle')}>
      <div className={styles.inner}>
        <SectionTitle
          title={t('pubTitle')}
          rightLink="#hal"
          rightLinkText={t('pubViewHal')}
        />
        <div className={styles.list}>
          {publications.map((pub, i) => (
            <div
              key={pub.id}
              className={`${styles.row} ${i % 2 === 1 ? styles.altRow : ''} fade-in-up`}
              ref={el => rowsRef.current[i] = el}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <p className={styles.authors}>{pub.authors}</p>
              <a href={`https://doi.org/${pub.doi}`} className={styles.title} target="_blank" rel="noopener noreferrer">
                {lang === 'en' && pub.titleEn ? pub.titleEn : pub.title}
              </a>
              <p className={styles.journal}>{pub.journal}</p>
              <div className={styles.meta}>
                <span className={styles.year}>{pub.year}</span>
                <a href={`https://doi.org/${pub.doi}`} className={styles.doi} target="_blank" rel="noopener noreferrer">
                  DOI: {pub.doi}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
