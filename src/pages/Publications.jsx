import { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero';
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
      <PageHero title={t('publicationsTitle')} subtitle={t('latestArticles')}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true"> / </span>
        <span>{t('navPublications')}</span>
      </PageHero>

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
                  <p className={styles.authorLine}>
                    {art.primary_author_id ? (
                      <Link to={`/members/${art.primary_author_id}`} className={styles.authorLink}>
                        {getAuthorName(art.primary_author_id)}
                      </Link>
                    ) : (
                      'LDREAS'
                    )}
                  </p>
                  <h3 className={styles.articleTitle}>
                    <Link to={`/articles/${art.id}`} className={styles.articleTitleLink}>
                      {art.name}
                    </Link>
                  </h3>
                  {art.published_at && (
                    <span className={styles.dateBlock}>
                      {new Date(art.published_at).getFullYear()}
                    </span>
                  )}
                  <div className={styles.actionsRow}>
                    {art.journal_link && (
                      <a href={art.journal_link} target="_blank" rel="noopener noreferrer" className={styles.journalLink}>
                        {t('pubViewJournal')}
                      </a>
                    )}
                    {art.pdf_link && art.pdf_link !== '#' && (
                      <a href={art.pdf_link} target="_blank" rel="noopener noreferrer" className={styles.pdfLink}>
                        {t('pubDownloadPdf')}
                      </a>
                    )}
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
