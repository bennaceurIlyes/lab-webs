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

  function getInitials(fullName) {
    const cleanName = fullName.replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.)\s+/i, '');
    const parts = cleanName.trim().split(/\s+/);
    return ((parts[0] ? parts[0][0] : '') + (parts[1] ? parts[1][0] : '')).toUpperCase();
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
      <section className="pageHero">
        <div className="heroInner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{t('navHome')}</Link> / {lang === 'ar' ? 'ملف الباحث' : (lang === 'fr' ? 'Profil du chercheur' : 'Researcher Profile')}
          </nav>
          <span className={styles.roleTag}>{getRoleLabel(member.role)}</span>
          <h1 className="heroTitle">{member.full_name}</h1>
        </div>
      </section>

      {/* Profile Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.layoutGrid}>
            
            {/* Left Card: Member Info */}
            <div className={styles.infoCol}>
              <div className={styles.profileCard}>
                {member.photo_url ? (
                  <div className={styles.photoWrap}>
                    <img src={member.photo_url} alt={member.full_name} className={styles.photo} />
                  </div>
                ) : (
                  <div className={styles.photoPlaceholder} aria-hidden="true">
                    <span>{getInitials(member.full_name)}</span>
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

                  {/* Research Interests / Topics */}
                  {member.research_topics && member.research_topics.length > 0 && (
                    <div className={styles.detailRowWithMargin}>
                      <span className={styles.label}>{lang === 'ar' ? 'الاهتمامات البحثية:' : 'Research Areas:'}</span>
                      <div className={styles.topicContainer}>
                        {member.research_topics.map(topic => (
                          <span key={topic} className={styles.topicBadge}>
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Academic External Links */}
                  {(member.orcid || member.google_scholar_url || member.research_gate_url) && (
                    <div className={styles.detailRowWithMargin}>
                      <span className={styles.label}>{lang === 'ar' ? 'معرفات أكاديمية:' : 'Identifiers:'}</span>
                      <div className={styles.linksContainer}>
                        {member.orcid && (
                          <a href={`https://orcid.org/${member.orcid}`} target="_blank" rel="noopener noreferrer" className={styles.digitalLink}>
                            ORCID: {member.orcid}
                          </a>
                        )}
                        {member.google_scholar_url && (
                          <a href={member.google_scholar_url} target="_blank" rel="noopener noreferrer" className={styles.digitalLink}>
                            Google Scholar
                          </a>
                        )}
                        {member.research_gate_url && (
                          <a href={member.research_gate_url} target="_blank" rel="noopener noreferrer" className={styles.digitalLink}>
                            ResearchGate
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.divider} />
                
                <a href={`mailto:${member.email}`} className={styles.emailCta}>
                  {lang === 'ar' ? 'إرسال بريد إلكتروني' : (lang === 'fr' ? 'Contacter par email' : 'Send Message')}
                </a>
              </div>
            </div>

            {/* Right Card: Bio, Metrics dashboard & Publications list */}
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
                        <h3 className={styles.pubTitle}>
                          <Link to={`/articles/${art.id}`} className={styles.pubTitleLink}>
                            {art.name}
                          </Link>
                        </h3>
                        
                        <div className={styles.pubMetaLine}>
                          <span className={styles.pubYear}>
                            {art.published_at ? new Date(art.published_at).getFullYear() : ''}
                          </span>
                          {art.journal_name && (
                            <>
                              <span className={styles.pubDivider}>/</span>
                              <span className={styles.pubJournal}>{art.journal_name}</span>
                            </>
                          )}
                          {art.doi && (
                            <>
                              <span className={styles.pubDivider}>/</span>
                              <span className={styles.pubDoi}>DOI: {art.doi}</span>
                            </>
                          )}
                        </div>

                        <p className={styles.pubDesc}>{art.description}</p>
                        
                        <div className={styles.pubActions}>
                          <Link to={`/articles/${art.id}`} className={styles.pubDetailBtn}>
                            {lang === 'ar' ? 'التفاصيل' : 'Details'}
                          </Link>
                          {art.journal_link && (
                            <a href={art.journal_link} target="_blank" rel="noopener noreferrer" className={styles.pubJournalBtn}>
                              {t('pubViewJournal') || 'View Journal'}
                            </a>
                          )}
                          {art.pdf_link && art.pdf_link !== '#' && (
                            <a href={art.pdf_link} target="_blank" rel="noopener noreferrer" className={styles.pubPdfBtn}>
                              PDF
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
            <Link to="/teams" className={styles.backBtn}>
              {lang === 'ar' ? '← العودة للفرق' : (lang === 'fr' ? '← Retour aux équipes' : '← Back to Teams')}
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
