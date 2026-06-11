/* News page — filterable news grid with pagination */
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { news } from '../data/news';
import Tag from '../components/ui/Tag';
import styles from './News.module.css';

const ITEMS_PER_PAGE = 5;

const categoryMapEn = {
  'Tous': 'All',
  'Séminaires': 'Seminars',
  'Soutenances': 'Defenses',
  'Publications': 'Publications',
  'Événements': 'Events',
};

const filterCategories = ['Tous', 'Séminaires', 'Soutenances', 'Publications', 'Événements'];
const filterMap = {
  'Séminaires': 'Séminaire',
  'Soutenances': 'Soutenance',
  'Publications': 'Publication',
  'Événements': 'Événement',
};

export default function News() {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [page, setPage] = useState(1);

  const filtered = activeFilter === 'Tous'
    ? news
    : news.filter(n => n.category === filterMap[activeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function handleFilter(cat) {
    setActiveFilter(cat);
    setPage(1);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  return (
    <main id="main-content">
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <span>{t('newsBreadcrumb')}</span>
          </nav>
          <h1 className={styles.heroTitle}>{t('newsPageTitle')}</h1>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className={styles.section}>
        <div className={styles.container}>
          {/* Filter bar */}
          <div className={styles.filters}>
            {filterCategories.map(cat => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterActive : ''}`}
                onClick={() => handleFilter(cat)}
              >
                {lang === 'en' ? categoryMapEn[cat] : cat}
              </button>
            ))}
          </div>

          {/* News grid */}
          <div className={styles.grid}>
            {paged.map(item => (
              <article key={item.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img src={item.image} alt="" className={styles.image} loading="lazy" />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
