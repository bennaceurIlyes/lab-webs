import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import Tag from '../components/ui/Tag';
import styles from './ArticleDetail.module.css';

export default function ArticleDetail() {
  const { id } = useParams();
  const { t, lang } = useTranslation();
  const [article, setArticle] = useState(null);
  const [primaryAuthor, setPrimaryAuthor] = useState(null);
  const [coAuthors, setCoAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dbService.getArticleById(id, lang).then(artData => {
      if (!artData) {
        setLoading(false);
        return;
      }
      setArticle(artData);

      const fetchAuthorInfo = artData.primary_author_id 
        ? dbService.getMemberById(artData.primary_author_id, lang) 
        : Promise.resolve(null);
        
      const fetchCoAuthorsInfo = dbService.getArticleCoAuthors(id, lang);

      return Promise.all([fetchAuthorInfo, fetchCoAuthorsInfo]).then(([author, coAuths]) => {
        setPrimaryAuthor(author);
        setCoAuthors(coAuths);
        setLoading(false);
      });
    }).catch(err => {
      console.error("Error loading article detail", err);
      setLoading(false);
    });
  }, [id, lang]);

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : (lang === 'fr' ? 'fr-FR' : 'en-US'), {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  if (loading) {
    return (
      <main className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className={styles.container}>
        <div className={styles.errorCard}>
          <h2>{lang === 'ar' ? 'المقال غير موجود' : (lang === 'fr' ? 'Article non trouvé' : 'Article not found')}</h2>
          <Link to="/articles" className={styles.backBtn}>
            {lang === 'ar' ? '← العودة للمنشورات' : (lang === 'fr' ? '← Retour aux publications' : '← Back to Publications')}
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
            <Link to="/">{t('navHome')}</Link> / <Link to="/articles">{t('navPublications')}</Link> / {lang === 'ar' ? 'تفاصيل المقال' : (lang === 'fr' ? 'Détails de l\'article' : 'Article Details')}
          </nav>
          <h1 className="heroTitle">{article.name}</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.detailCard}>
            <div className={`${styles.detailMeta} flex-row-reverse-rtl`}>
              <Tag label={lang === 'ar' ? 'منشور علمي' : (lang === 'fr' ? 'Publication' : 'Publication')} />
              <span className={styles.date}>{formatDate(article.published_at)}</span>
            </div>

            <div className={styles.contentSection}>
              <h2 className={styles.subHeading}>{lang === 'ar' ? 'ملخص المقال' : (lang === 'fr' ? "Résumé de l'article" : 'Abstract / Description')}</h2>
              <p className={styles.descriptionText}>
                {article.description || (lang === 'ar' ? 'لا يوجد وصف متاح.' : 'No description available.')}
              </p>
            </div>

            {/* Authors Section */}
            <div className={styles.authorsSection}>
              <h2 className={styles.authorsHeading}>{lang === 'ar' ? 'المؤلفون' : (lang === 'fr' ? 'Auteurs' : 'Authors')}</h2>
              <div className={styles.authorList}>
                {primaryAuthor && (
                  <div className={styles.authorCard}>
                    <div className={styles.authorBadge}>{lang === 'ar' ? 'الكاتب الرئيسي' : 'Primary Author'}</div>
                    <Link to={`/members/${primaryAuthor.id}`} className={styles.authorName}>
                      {primaryAuthor.full_name}
                    </Link>
                    <span className={styles.authorMeta}>{primaryAuthor.grade} — {primaryAuthor.specialty}</span>
                  </div>
                )}
                {coAuthors.map(co => (
                  <div key={co.id} className={styles.authorCard}>
                    <div className={styles.coAuthorBadge}>{lang === 'ar' ? 'مشارك' : 'Co-Author'}</div>
                    <Link to={`/members/${co.id}`} className={styles.authorName}>
                      {co.full_name}
                    </Link>
                    <span className={styles.authorMeta}>{co.grade} — {co.specialty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links and Downloads */}
            {(article.journal_link || (article.pdf_link && article.pdf_link !== '#')) && (
              <div className={styles.linksSection}>
                <h2 className={styles.linksHeading}>{lang === 'ar' ? 'الروابط والتحميل' : (lang === 'fr' ? 'Liens & Téléchargements' : 'Links & Downloads')}</h2>
                <div className={styles.linksRow}>
                  {article.journal_link && (
                    <a href={article.journal_link} target="_blank" rel="noopener noreferrer" className={styles.journalCta}>
                      {t('pubViewJournal')}
                    </a>
                  )}
                  {article.pdf_link && article.pdf_link !== '#' && (
                    <a href={article.pdf_link} target="_blank" rel="noopener noreferrer" className={styles.pdfCta}>
                      {t('pubDownloadPdf')}
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className={styles.footerActions}>
              <Link to="/articles" className={styles.backBtn}>
                {lang === 'ar' ? '← العودة للمنشورات' : (lang === 'fr' ? '← Retour aux publications' : '← Back to Publications')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
