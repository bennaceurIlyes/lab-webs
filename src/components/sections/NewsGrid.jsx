import { useEffect, useState, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { dbService } from '../../lib/dbService';
import { Link } from 'react-router-dom';
import Tag from '../ui/Tag';
import styles from './NewsGrid.module.css';

export default function NewsGrid() {
  const { t, lang } = useTranslation();
  const [newsItems, setNewsItems] = useState([]);
  const cardsRef = useRef([]);

  useEffect(() => {
    dbService.getNews(lang).then(data => {
      // Top 3 news for homepage
      setNewsItems(data.slice(0, 3));
    });

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
  }, [lang, newsItems.length]);

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : (lang === 'fr' ? 'fr-FR' : 'en-US'), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className={styles.newsColumn}>
      {newsItems.map((item, i) => (
        <article
          key={item.id}
          className={`${styles.card} fade-in-up`}
          ref={el => cardsRef.current[i] = el}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {item.photo_url && (
            <div className={styles.imageWrap}>
              <img
                src={item.photo_url}
                alt=""
                className={styles.image}
                loading="lazy"
              />
            </div>
          )}
          <div className={styles.content}>
            <div className={styles.meta}>
              <Tag label={lang === 'ar' ? 'مستجدات' : (lang === 'fr' ? 'Actualité' : 'News')} />
              <span className={styles.date}>{formatDate(item.published_at || item.created_at)}</span>
            </div>
            <h3 className={styles.title}>
              {item.title}
            </h3>
            <p className={styles.excerpt}>
              {item.description}
            </p>
            <Link to={`/news/${item.id}`} className={styles.readMore}>
              {t('readMore')}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
