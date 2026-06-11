/* NewsGrid — 3 news cards with images, categories, excerpts */
import { useEffect, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import { news } from '../../data/news';
import Tag from '../ui/Tag';
import styles from './NewsGrid.module.css';

export default function NewsGrid() {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const cardsRef = useRef([]);

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

    cardsRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const topNews = news.slice(0, 3);

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className={styles.newsColumn}>
      {topNews.map((item, i) => (
        <article
          key={item.id}
          className={`${styles.card} fade-in-up`}
          ref={el => cardsRef.current[i] = el}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className={styles.imageWrap}>
            <img
              src={item.image}
              alt=""
              className={styles.image}
              loading="lazy"
            />
          </div>
          <div className={styles.content}>
            <div className={styles.meta}>
              <Tag label={item.category} />
              <span className={styles.date}>{formatDate(item.date)}</span>
            </div>
            <h3 className={styles.title}>
              {lang === 'en' && item.titleEn ? item.titleEn : item.title}
            </h3>
            <p className={styles.excerpt}>
              {lang === 'en' && item.excerptEn ? item.excerptEn : item.excerpt}
            </p>
            <a href={`#news-${item.id}`} className={styles.readMore}>
              {t('readMore')}
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
