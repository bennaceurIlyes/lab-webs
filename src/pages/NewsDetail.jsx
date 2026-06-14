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
  const [author, setAuthor] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive UI state
  const [scrollPercent, setScrollPercent] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    dbService.getNewsById(id, lang)
      .then(data => {
        setNewsItem(data);
        if (data && data.author_id) {
          dbService.getMemberById(data.author_id, lang).then(member => setAuthor(member));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, lang]);

  // Fetch related publications based on keyword matching or default to recent ones
  useEffect(() => {
    if (newsItem) {
      dbService.getArticles(lang).then(articles => {
        // Simple keyword filter matching
        const newsKeywords = [newsItem.category, ...(newsItem.description?.split(/\s+/) || [])];
        const matched = articles.filter(art => 
          art.keywords?.some(kw => 
            newsItem.title?.toLowerCase().includes(kw.toLowerCase()) || 
            newsItem.content?.toLowerCase().includes(kw.toLowerCase())
          )
        );
        // Fallback to recent articles if no keyword overlaps
        setRelatedArticles(matched.length > 0 ? matched.slice(0, 2) : articles.slice(0, 2));
      });
    }
  }, [newsItem, lang]);

  // Reading scroll progress indicator hook
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : (lang === 'fr' ? 'fr-FR' : 'en-US'), {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(newsItem?.title || '');

  if (loading) {
    return (
      <main className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </main>
    );
  }

  if (!newsItem) {
    return (
      <main className={styles.errorContainer}>
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
    <main id="main-content" className={styles.main}>
      {/* Scroll Progress Bar Indicator */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} style={{ width: `${scrollPercent}%` }}></div>
      </div>

      {/* Page Hero */}
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">{t('navHome')}</Link> 
            <span className={styles.bcDivider}>/</span> 
            <Link to="/news">{t('navNews')}</Link> 
            <span className={styles.bcDivider}>/</span> 
            <span className={styles.bcActive}>{lang === 'ar' ? 'تفاصيل الخبر' : (lang === 'fr' ? 'Détails' : 'Detail')}</span>
          </nav>
          <div className={styles.categoryLabel}>
            <Tag label={newsItem.category === 'breakthrough' ? (lang === 'ar' ? 'إنجاز علمي' : 'Breakthrough') : (lang === 'ar' ? 'فعالية' : 'Event')} />
          </div>
          <h1 className={styles.heroTitle}>{newsItem.title}</h1>
          
          <div className={styles.heroMeta}>
            <span className={styles.date}>{formatDate(newsItem.published_at || newsItem.created_at)}</span>
            {newsItem.view_count && (
              <>
                <span className={styles.metaDivider}>•</span>
                <span className={styles.viewsCount}>
                  {newsItem.view_count} {lang === 'ar' ? 'مشاهدة' : (lang === 'fr' ? 'vues' : 'views')}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Grid: Body Content + Sidebar widgets */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.layoutContainer}>
            
            {/* Article Column */}
            <article className={styles.articleBody}>
              {newsItem.photo_url && (
                <div className={styles.photoWrap}>
                  <img src={newsItem.photo_url} alt="" className={styles.photo} />
                  <div className={styles.photoOverlay}></div>
                </div>
              )}

              <div className={styles.articleContent}>
                <p className={styles.excerpt}>{newsItem.description}</p>
                
                <div 
                  className={styles.bodyText} 
                  dangerouslySetInnerHTML={{
                    __html: newsItem.content.replace(/\n/g, '<br /><br />')
                  }} 
                />
              </div>

              {/* Author Biography Section */}
              {author && (
                <div className={styles.authorCard}>
                  <img src={author.photo_url} alt={author.full_name} className={styles.authorPhoto} />
                  <div className={styles.authorInfo}>
                    <div className={styles.authorHeader}>
                      <span className={styles.authorLabel}>{lang === 'ar' ? 'كاتب المقال' : (lang === 'fr' ? 'Rédigé par' : 'Written by')}</span>
                      <h4 className={styles.authorName}>
                        <Link to={`/team/${author.id}`}>{author.full_name}</Link>
                      </h4>
                      <span className={styles.authorGrade}>{author.grade} • {author.specialty}</span>
                    </div>
                    {author.bio && <p className={styles.authorBio}>{author.bio}</p>}
                  </div>
                </div>
              )}

              {/* Footer Back action */}
              <div className={styles.footerActions}>
                <Link to="/news" className={styles.backBtn}>
                  {lang === 'ar' ? '← العودة للأخبار' : (lang === 'fr' ? '← Retour aux actualités' : '← Back to News')}
                </Link>
              </div>
            </article>

            {/* Sidebar Column: Floating Sharing & Related Publications */}
            <aside className={styles.sidebarColumn}>
              {/* Sharing widget */}
              <div className={styles.sidebarCard}>
                <h4 className={styles.sidebarTitle}>{lang === 'ar' ? 'مشاركة الخبر' : (lang === 'fr' ? 'Partager l\'article' : 'Share Article')}</h4>
                <div className={styles.shareButtons}>
                  <button 
                    onClick={handleCopyLink} 
                    className={`${styles.shareBtn} ${copied ? styles.shareBtnCopied : ''}`}
                    title="Copy Link"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الرابط' : 'Copy Link')}</span>
                  </button>

                  <a 
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.shareBtn}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                    <span>Twitter / X</span>
                  </a>

                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.shareBtn}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Related Publications widget */}
              {relatedArticles.length > 0 && (
                <div className={styles.sidebarCard}>
                  <h4 className={styles.sidebarTitle}>
                    {lang === 'ar' ? 'منشورات ذات صلة' : (lang === 'fr' ? 'Publications associées' : 'Related Research')}
                  </h4>
                  <div className={styles.relatedList}>
                    {relatedArticles.map(art => (
                      <div key={art.id} className={styles.relatedItem}>
                        <span className={styles.relatedType}>
                          {art.article_type === 'journal' ? (lang === 'ar' ? 'مقال دوري' : 'Journal') : (lang === 'ar' ? 'مؤتمر' : 'Conference')}
                        </span>
                        <h5 className={styles.relatedName}>
                          <Link to={`/publications/${art.id}`}>{art.name}</Link>
                        </h5>
                        {art.doi && <span className={styles.relatedDoi}>DOI: {art.doi}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}
