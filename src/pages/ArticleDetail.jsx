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

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} ${lang === 'ar' ? 'تم نسخه بنجاح!' : 'copied successfully!'}`);
    });
  };

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
              <Tag label={article.article_type === 'journal' ? (lang === 'ar' ? 'مقال مجلة' : 'Journal Article') : (lang === 'ar' ? 'مقال مؤتمر' : 'Conference Paper')} />
              <span className={styles.date}>{formatDate(article.published_at)}</span>
              {article.doi && (
                <span 
                  onClick={() => copyToClipboard(article.doi, 'DOI')} 
                  className={styles.date} 
                  style={{cursor: 'pointer', marginLeft: 'auto', textDecoration: 'underline', color: 'var(--color-primary)'}}
                  title="Click to copy DOI"
                >
                  DOI: {article.doi} ⚙️
                </span>
              )}
            </div>

            {/* Metrics cards grid */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--color-border)', borderBottom: '1px solid var(--color-border)'}}>
              <div style={{background: 'var(--color-bg-card)', padding: '20px', textAlign: 'center'}}>
                <div style={{fontSize: '12px', color: 'var(--color-slate-600)', textTransform: 'uppercase', marginBottom: '4px'}}>{lang === 'ar' ? 'الاقتباسات (Scopus)' : 'Citations (Scopus)'}</div>
                <div style={{fontSize: '28px', fontWeight: '700', color: 'var(--color-primary)'}}>{article.citations_count || 0}</div>
              </div>
              <div style={{background: 'var(--color-bg-card)', padding: '20px', textAlign: 'center'}}>
                <div style={{fontSize: '12px', color: 'var(--color-slate-600)', textTransform: 'uppercase', marginBottom: '4px'}}>{lang === 'ar' ? 'التحميلات (Vercel)' : 'Downloads (Vercel)'}</div>
                <div style={{fontSize: '28px', fontWeight: '700', color: 'var(--color-secondary)'}}>{article.downloads_count || 0}</div>
              </div>
              <div style={{background: 'var(--color-bg-card)', padding: '20px', textAlign: 'center'}}>
                <div style={{fontSize: '12px', color: 'var(--color-slate-600)', textTransform: 'uppercase', marginBottom: '4px'}}>{lang === 'ar' ? 'مؤشر Altmetric' : 'Altmetric Score'}</div>
                <div style={{fontSize: '28px', fontWeight: '700', color: 'var(--color-accent)'}}>{article.altmetric_score || 0}</div>
              </div>
            </div>

            {/* Abstract Section */}
            <div className={styles.contentSection}>
              <h2 className={styles.subHeading}>{lang === 'ar' ? 'ملخص المقال' : (lang === 'fr' ? "Résumé de l'article" : 'Abstract / Description')}</h2>
              <p className={styles.descriptionText}>
                {article.description || (lang === 'ar' ? 'لا يوجد وصف متاح.' : 'No description available.')}
              </p>
            </div>

            {/* Academic Metadata Table */}
            <div className={styles.contentSection}>
              <h2 className={styles.subHeading}>{lang === 'ar' ? 'معلومات النشر والمصادر' : 'Publication & Context'}</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', marginTop: '16px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)', paddingBottom: '6px'}}>
                  <span style={{color: 'var(--color-slate-600)'}}>{lang === 'ar' ? 'المجلة العلمية:' : 'Journal:'}</span>
                  <span style={{fontWeight: '600', color: 'var(--color-text-dark)'}}>{article.journal_name || 'Saharan Renewable Energy'}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)', paddingBottom: '6px'}}>
                  <span style={{color: 'var(--color-slate-600)'}}>{lang === 'ar' ? 'المجلد / العدد:' : 'Volume / Issue:'}</span>
                  <span style={{fontWeight: '600', color: 'var(--color-text-dark)'}}>{article.volume || '1'} / {article.issue || '1'}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)', paddingBottom: '6px'}}>
                  <span style={{color: 'var(--color-slate-600)'}}>{lang === 'ar' ? 'الصفحات:' : 'Pages:'}</span>
                  <span style={{fontWeight: '600', color: 'var(--color-text-dark)'}}>{article.pages || '1-10'}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)', paddingBottom: '6px'}}>
                  <span style={{color: 'var(--color-slate-600)'}}>{lang === 'ar' ? 'الرقم التسلسلي ISSN:' : 'ISSN:'}</span>
                  <span style={{fontWeight: '600', color: 'var(--color-text-dark)'}}>{article.issn || 'N/A'}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '6px'}}>
                  <span style={{color: 'var(--color-slate-600)'}}>{lang === 'ar' ? 'مصدر التمويل:' : 'Funding Source:'}</span>
                  <span style={{fontWeight: '600', color: 'var(--color-text-dark)'}}>{article.funding_source || 'University of Bechar'}</span>
                </div>
              </div>
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
                    {primaryAuthor.orcid && (
                      <a href={`https://orcid.org/${primaryAuthor.orcid}`} target="_blank" rel="noopener noreferrer" style={{fontSize: '12px', color: '#A3E635', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px'}}>
                        💚 ORCID: {primaryAuthor.orcid}
                      </a>
                    )}
                  </div>
                )}
                {coAuthors.map(co => (
                  <div key={co.id} className={styles.authorCard}>
                    <div className={styles.coAuthorBadge}>{lang === 'ar' ? 'مشارك' : 'Co-Author'}</div>
                    <Link to={`/members/${co.id}`} className={styles.authorName}>
                      {co.full_name}
                    </Link>
                    <span className={styles.authorMeta}>{co.grade} — {co.specialty}</span>
                    {co.orcid && (
                      <a href={`https://orcid.org/${co.orcid}`} target="_blank" rel="noopener noreferrer" style={{fontSize: '12px', color: '#A3E635', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px'}}>
                        💚 ORCID: {co.orcid}
                      </a>
                    )}
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
