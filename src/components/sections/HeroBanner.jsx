import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { news } from '../../data/news';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  // Slice first 4 news articles for the homepage slider row
  const topNews = news.slice(0, 4);

  return (
    <section className={styles.heroNews} aria-label={t('newsTitle')}>
      <div className={styles.inner}>
        <h2 className={styles.sectionTitle}>{t('newsTitle')}</h2>
        
        <Link to="/news" className={styles.viewAllLink}>
          &gt; {lang === 'fr' ? 'Consulter Toutes Nos Actualités' : 'View All Our News'}
        </Link>

        <div className={styles.grid}>
          {topNews.map(item => (
            <Link to="/news" key={item.id} className={styles.card} aria-label={lang === 'en' ? item.titleEn : item.title}>
              {/* Thumbnail Image */}
              <div className={styles.cardImageWrap}>
                <img
                  src={item.image}
                  alt=""
                  className={styles.cardImage}
                  loading="lazy"
                />
              </div>

              {/* Blue title footer */}
              <div className={styles.cardFooter}>
                <h3 className={styles.cardTitle}>
                  {lang === 'en' && item.titleEn ? item.titleEn : item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
