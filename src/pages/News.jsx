import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import { Link } from 'react-router-dom';
import Tag from '../components/ui/Tag';
import styles from './News.module.css';

export default function News() {
  const { t, lang } = useTranslation();
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    dbService.getNews(lang).then(data => setNewsList(data));
  }, [lang]);

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : (lang === 'fr' ? 'fr-FR' : 'en-US'), {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  return (
    <main id="main-content">
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">{t('navHome')}</Link> / {t('navNews')}
          </nav>
          <h1 className={styles.heroTitle}>{t('newsPageTitle')}</h1>
        </div>
      </section>

      {/* Grid */}
      <section className={styles.section}>
        <div className={styles.container}>
          {/* News list */}
          <div className={styles.grid}>
            {newsList.map(item => (
              <article key={item.id} className={`${styles.card} flex-row-reverse-rtl`}>
                {item.photo_url && (
                  <div className={styles.imageWrap}>
                    <img src={item.photo_url} alt="" className={styles.image} loading="lazy" />
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
                  <Link to={`/news/${item.id}`} className={styles.readMoreBtn}>
                    {t('readMore')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
