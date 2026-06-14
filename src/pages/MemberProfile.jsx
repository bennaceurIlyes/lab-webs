import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import styles from './MemberProfile.module.css';

export default function MemberProfile() {
  const { id } = useParams();
  const { t, lang } = useTranslation();
  const [member, setMember] = useState(null);
  const [team, setTeam] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dbService.getMemberById(id, lang).then(memberData => {
      if (!memberData) {
        setLoading(false);
        return;
      }
      setMember(memberData);

      const fetchTeam = memberData.team_id 
        ? dbService.getTeamById(memberData.team_id, lang)
        : Promise.resolve(null);
      const fetchArticles = dbService.getArticlesByMember(id, lang);

      return Promise.all([fetchTeam, fetchArticles]).then(([teamData, articlesData]) => {
        setTeam(teamData);
        setArticles(articlesData);
        setLoading(false);
      });
    }).catch(err => {
      console.error("Error loading member profile", err);
      setLoading(false);
    });
  }, [id, lang]);

  function getRoleLabel(role) {
    switch(role) {
      case 'lab_leader': return t('roleLabLeader') || 'Lab Director';
      case 'team_leader': return t('roleTeamLeader') || 'Team Leader';
      case 'member': return t('roleMember') || 'Researcher';
      default: return role;
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : (lang === 'fr' ? 'fr-FR' : 'en-US'), {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  if (loading) {
    return (
      <main className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </main>
    );
  }

  if (!member) {
    return (
      <main className={styles.container}>
        <div className={styles.errorCard}>
          <h2>{lang === 'ar' ? 'الباحث غير موجود' : (lang === 'fr' ? 'Chercheur non trouvé' : 'Researcher not found')}</h2>
          <Link to="/" className={styles.backBtn}>
            {lang === 'ar' ? '← العودة للرئيسية' : (lang === 'fr' ? '← Retour à l\'accueil' : '← Back to Home')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">{t('navHome')}</Link> / {lang === 'ar' ? 'ملف الباحث' : (lang === 'fr' ? 'Profil du chercheur' : 'Researcher Profile')}
          </nav>
          <span className={styles.roleTag}>{getRoleLabel(member.role)}</span>
          <h1 className={styles.heroTitle}>{member.full_name}</h1>
        </div>
      </section>

      {/* Profile Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.layoutGrid}>
            
            {/* Left Card: Member Info */}
            <div className={styles.infoCol}>
              <div className={styles.profileCard}>
                {member.photo_url && (
                  <div className={styles.photoWrap}>
                    <img src={member.photo_url} alt={member.full_name} className={styles.photo} />
                  </div>
                )}
                
                <div className={styles.infoDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>{t('gradeLabel')}:</span>
                    <span className={styles.value}>{member.grade} ({member.degree})</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>{t('specialtyLabel')}:</span>
                    <span className={styles.value}>{member.specialty}</span>
                  </div>
                  {team && (
                    <div className={styles.detailRow}>
                      <span className={styles.label}>{lang === 'ar' ? 'فرقة البحث' : (lang === 'fr' ? 'Équipe' : 'Team')}:</span>
                      <span className={styles.value}>
                        <Link to={`/teams/${team.id}`} className={styles.teamLink}>
                          {team.name} ({team.acronym})
                        </Link>
                      </span>
                    </div>
                  )}
                  <div className={styles.detailRow}>
                    <span className={styles.label}>{lang === 'ar' ? 'تاريخ الانضمام' : (lang === 'fr' ? 'Membre depuis' : 'Joined Lab')}:</span>
                    <span className={styles.value}>{formatDate(member.joined_at)}</span>
                  </div>
                </div>

                <div className={styles.divider} />
                
                <a href={`mailto:${member.email}`} className={styles.emailCta}>
                  ✉️ {lang === 'ar' ? 'إرسال بريد إلكتروني' : (lang === 'fr' ? 'Contacter par email' : 'Contact by Email')}
                </a>
              </div>
            </div>

            {/* Right Card: Bio and Publications list */}
            <div className={styles.contentCol}>
              
              {/* Bio block */}
              <div className={styles.bioCard}>
                <h2 className={styles.sectionHeading}>{lang === 'ar' ? 'السيرة العلمية' : (lang === 'fr' ? 'Biographie' : 'Scientific Biography')}</h2>
                <p className={styles.bioText}>
                  {member.bio || (lang === 'ar' ? 'لا توجد سيرة ذاتية مسجلة.' : 'No scientific biography recorded.')}
                </p>
              </div>

              {/* Publications block */}
              <div className={styles.publicationsBlock}>
                <h2 className={styles.sectionHeading}>
                  {lang === 'ar' ? 'المنشورات والأبحاث' : (lang === 'fr' ? 'Publications & Travaux' : 'Publications & Articles')}
                </h2>
                
                {articles.length > 0 ? (
                  <div className={styles.pubList}>
                    {articles.map(art => (
                      <div key={art.id} className={styles.pubCard}>
                        <div className={styles.pubHeader}>
                          <span className={styles.pubDate}>
                            📅 {art.published_at ? new Date(art.published_at).getFullYear() : ''}
                          </span>
                        </div>
                        <h3 className={styles.pubTitle}>
                          <Link to={`/articles/${art.id}`} className={styles.pubTitleLink}>
                            {art.name}
                          </Link>
                        </h3>
                        <p className={styles.pubDesc}>{art.description}</p>
                        
                        <div className={styles.pubActions}>
                          <Link to={`/articles/${art.id}`} className={styles.pubDetailBtn}>
                            ℹ️ {lang === 'ar' ? 'التفاصيل' : 'Details'}
                          </Link>
                          {art.journal_link && (
                            <a href={art.journal_link} target="_blank" rel="noopener noreferrer" className={styles.pubJournalBtn}>
                              🌐 {t('pubViewJournal')}
                            </a>
                          )}
                          {art.pdf_link && art.pdf_link !== '#' && (
                            <a href={art.pdf_link} target="_blank" rel="noopener noreferrer" className={styles.pubPdfBtn}>
                              📥 PDF
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noPubsCard}>
                    <p>{lang === 'ar' ? 'لم يتم تسجيل منشورات علمية بعد.' : 'No scientific publications recorded yet.'}</p>
                  </div>
                )}
              </div>

            </div>

          </div>

          <div className={styles.footerActions}>
            <button onClick={() => window.history.back()} className={styles.backBtn}>
              {lang === 'ar' ? '← العودة للخلف' : (lang === 'fr' ? '← Retour' : '← Back')}
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}
