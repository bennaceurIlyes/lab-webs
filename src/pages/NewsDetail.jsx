import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import Tag from '../components/ui/Tag';
import styles from './NewsDetail.module.css';

export default function NewsDetail() {
  const { id } = useParams();
  const { t, lang } = useTranslation();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dbService.getNewsById(id, lang).then(data => {
      setNewsItem(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id, lang]);

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : (lang === 'fr' ? 'fr-FR' : 'en-US'), {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  if (loading) {
    return (
      <main className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </main>
    );
  }

  if (!newsItem) {
    return (
      <main className={styles.container}>
        <div className={styles.errorCard}>
          <h2>{lang === 'ar' ? 'المستجد غير موجود' : (lang === 'fr' ? 'Actualité non trouvée' : 'News item not found')}</h2>
          <Link to="/news" className={styles.backBtn}>
            {lang === 'ar' ? '← العودة للأخبار' : (lang === 'fr' ? '← Retour aux actualités' : '← Back to News')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      {/* Page Hero */}
      <section className="pageHero">
        <div className="heroInner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{t('navHome')}</Link> / <Link to="/news">{t('navNews')}</Link> / {lang === 'ar' ? 'تفاصيل الخبر' : (lang === 'fr' ? 'Détails' : 'Detail')}
          </nav>
          <h1 className="heroTitle">{newsItem.title}</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.detailCard}>
            <div className={`${styles.detailMeta} flex-row-reverse-rtl`}>
              <Tag label={lang === 'ar' ? 'مستجدات' : (lang === 'fr' ? 'Actualité' : 'News')} />
              <span className={styles.date}>{formatDate(newsItem.published_at || newsItem.created_at)}</span>
            </div>

            {newsItem.photo_url && (
              <div className={styles.detailPhotoWrap}>
                <img src={newsItem.photo_url} alt="" className={styles.detailPhoto} />
              </div>
            )}

            <div className={styles.bodyWrapper}>
              <p className={styles.detailDesc}>{newsItem.description}</p>
              <div 
                className={styles.detailContent} 
                dangerouslySetInnerHTML={{
                  __html: newsItem.content.replace(/\n/g, '<br />')
                }} 
              />
            </div>

            <div className={styles.footerActions}>
              <Link to="/news" className={styles.backBtn}>
                {lang === 'ar' ? '← العودة للأخبار' : (lang === 'fr' ? '← Retour aux actualités' : '← Back to News')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
