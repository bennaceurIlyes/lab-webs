import { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import { Link } from 'react-router-dom';
import styles from './Publications.module.css';

export default function Publications() {
  const { t, lang } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([
      dbService.getArticles(lang),
      dbService.getMembers(lang)
    ]).then(([articlesData, membersData]) => {
      setArticles(articlesData);
      setMembers(membersData);
    });
  }, [lang]);

  const getAuthorName = (authorId) => {
    const member = members.find(m => m.id === authorId);
    return member ? member.full_name : '';
  };

  // Filter based on search query
  const filteredArticles = articles.filter(art => {
    const title = (art.name || '').toLowerCase();
    const author = getAuthorName(art.primary_author_id).toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || author.includes(query);
  });

  return (
    <main id="main-content">
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">{t('navHome')}</Link> / {t('navPublications')}
          </nav>
          <h1 className={styles.heroTitle}>{t('publicationsTitle')}</h1>
        </div>
      </section>

      {/* Publications list and search */}
      <section className={styles.section}>
        <div className={styles.container}>
          {/* Search bar */}
          <div className={styles.searchBarWrap}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={lang === 'ar' ? 'البحث عن المقالات أو المؤلفين...' : 'Search articles or authors...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* List */}
          <div className={styles.list}>
            {filteredArticles.length > 0 ? (
              filteredArticles.map((art, idx) => (
                <div key={art.id} className={`${styles.row} ${idx % 2 === 1 ? styles.altRow : ''} flex-row-reverse-rtl`}>
                  <div className={styles.metaCol}>
                    <span className={styles.dateBlock}>
                      {art.published_at ? new Date(art.published_at).toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'en-US', {
                        year: 'numeric',
                        month: 'short'
                      }) : ''}
                    </span>
                  </div>
                  
                  <div className={styles.mainCol}>
                    <h3 className={styles.articleTitle}>
                      <Link to={`/articles/${art.id}`} className={styles.articleTitleLink}>
                        {art.name}
                      </Link>
                    </h3>
                    <p className={styles.authorLine}>
                      <strong>{lang === 'ar' ? 'الكاتب الرئيسي' : 'Primary Author'}:</strong>{' '}
                      {art.primary_author_id ? (
                        <Link to={`/members/${art.primary_author_id}`} className={styles.authorLink}>
                          {getAuthorName(art.primary_author_id)}
                        </Link>
                      ) : (
                        'LDREAS'
                      )}
                    </p>
                    
                    <div className={styles.actionsRow}>
                      <Link to={`/articles/${art.id}`} className={styles.detailLink}>
                        ℹ️ {lang === 'ar' ? 'تفاصيل المقال' : (lang === 'fr' ? 'Détails de l\'article' : 'Article Details')}
                      </Link>
                      {art.journal_link && (
                        <a href={art.journal_link} target="_blank" rel="noopener noreferrer" className={styles.journalLink}>
                          🔗 {t('pubViewJournal')}
                        </a>
                      )}
                      {art.pdf_link && art.pdf_link !== '#' && (
                        <a href={art.pdf_link} target="_blank" rel="noopener noreferrer" className={styles.pdfLink}>
                          📄 {t('pubDownloadPdf')}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noPublications}>
                {t('noPublications')}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
