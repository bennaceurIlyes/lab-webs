import { useEffect, useState, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { dbService } from '../../lib/dbService';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import styles from './PublicationsList.module.css';

export default function PublicationsList() {
  const { t, lang } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [members, setMembers] = useState([]);
  const rowsRef = useRef([]);

  useEffect(() => {
    Promise.all([
      dbService.getArticles(lang),
      dbService.getMembers(lang)
    ]).then(([articlesData, membersData]) => {
      // Show top 3 recent publications on homepage
      setArticles(articlesData.slice(0, 3));
      setMembers(membersData);
    });
  }, [lang]);

  const getAuthorName = (authorId) => {
    const member = members.find(m => m.id === authorId);
    return member ? member.full_name : '';
  };

  return (
    <section className={styles.section} aria-label={t('latestArticles')}>
      <div className={styles.inner}>
        <SectionTitle
          title={t('latestArticles')}
          rightLink="/articles"
          rightLinkText={t('pubViewHal') || 'View All Publications →'}
        />
        <div className={styles.list}>
          {articles.map((pub, i) => (
            <div
              key={pub.id}
              className={`${styles.row} ${i % 2 === 1 ? styles.altRow : ''} fade-in-up flex-row-reverse-rtl`}
              ref={el => rowsRef.current[i] = el}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <p className={styles.authors}>
                {pub.primary_author_id ? (
                  <Link to={`/members/${pub.primary_author_id}`} className={styles.authorLink}>
                    {getAuthorName(pub.primary_author_id)}
                  </Link>
                ) : (
                  ''
                )}
              </p>
              <Link to={`/articles/${pub.id}`} className={styles.title}>
                {pub.name}
              </Link>
              <p className={styles.journal}>{t('pubJournal')}: {pub.journal_link ? 'Scientific Journal' : 'Journal Paper'}</p>
              <div className={styles.meta}>
                <span className={styles.year}>{new Date(pub.published_at).getFullYear()}</span>
                {pub.pdf_link && pub.pdf_link !== '#' && (
                  <a href={pub.pdf_link} className={styles.doi} target="_blank" rel="noopener noreferrer">
                    PDF 💾
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
