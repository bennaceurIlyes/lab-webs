import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import Tag from '../components/ui/Tag';
import styles from './TeamDetail.module.css';

export default function TeamDetail() {
  const { id } = useParams();
  const { t, lang } = useTranslation();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dbService.getTeamById(id, lang).then(teamData => {
      if (!teamData) {
        setLoading(false);
        return;
      }
      setTeam(teamData);

      const fetchMembers = dbService.getMembersByTeam(id, lang);
      const fetchProjects = dbService.getProjectsByTeam(id, lang);

      return Promise.all([fetchMembers, fetchProjects]).then(([membersData, projectsData]) => {
        setMembers(membersData);
        setProjects(projectsData);
        setLoading(false);
      });
    }).catch(err => {
      console.error("Error loading team details", err);
      setLoading(false);
    });
  }, [id, lang]);

  const teamLeader = members.find(m => m.id === team?.team_leader_id) || members.find(m => m.role === 'team_leader');
  const regularMembers = members.filter(m => m.id !== teamLeader?.id);

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : (lang === 'fr' ? 'fr-FR' : 'en-US'), {
      year: 'numeric', month: 'short'
    });
  }

  function getProjectStateColor(state) {
    switch(state) {
      case 'completed': return 'success';
      case 'ongoing': return 'warning';
      case 'planned': return 'neutral';
      default: return 'neutral';
    }
  }

  function getProjectStateLabel(state) {
    switch(state) {
      case 'completed': return t('projectStateCompleted') || 'Completed';
      case 'ongoing': return t('projectStateOngoing') || 'Ongoing';
      case 'planned': return t('projectStatePlanned') || 'Planned';
      default: return state;
    }
  }

  if (loading) {
    return (
      <main className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </main>
    );
  }

  if (!team) {
    return (
      <main className={styles.container}>
        <div className={styles.errorCard}>
          <h2>{lang === 'ar' ? 'فرقة البحث غير موجودة' : (lang === 'fr' ? 'Équipe non trouvée' : 'Team not found')}</h2>
          <Link to="/teams" className={styles.backBtn}>
            {lang === 'ar' ? '← العودة للفرق' : (lang === 'fr' ? '← Retour aux équipes' : '← Back to Teams')}
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
            <Link to="/">{t('navHome')}</Link> / <Link to="/teams">{t('navTeam') || 'Teams'}</Link> / {team.acronym}
          </nav>
          <span className={styles.teamTag}>{lang === 'ar' ? 'فرقة بحثية معتمدة' : (lang === 'fr' ? 'Équipe de Recherche' : 'Accredited Research Team')}</span>
          <h1 className={styles.heroTitle}>{team.name} ({team.acronym})</h1>
        </div>
      </section>

      {/* Details section */}
      <section className={styles.section}>
        <div className={styles.container}>
          
          {/* Intro Description */}
          <div className={styles.introCard}>
            <p className={styles.descriptionText}>{team.description}</p>
          </div>

          <div className={styles.layoutGrid}>
            
            {/* Left/Right content: Members directory */}
            <div className={styles.directoryCol}>
              
              {/* Leader Highlight */}
              {teamLeader && (
                <div className={styles.leaderCardBlock}>
                  <h2 className={styles.sectionHeading}>
                    {lang === 'ar' ? 'رئيس فرقة البحث' : (lang === 'fr' ? 'Chef de l\'équipe' : 'Team Leader')}
                  </h2>
                  <div className={`${styles.leaderCard} flex-row-reverse-rtl`}>
                    {teamLeader.photo_url && (
                      <div className={styles.leaderPhotoWrap}>
                        <img src={teamLeader.photo_url} alt={teamLeader.full_name} className={styles.leaderPhoto} />
                      </div>
                    )}
                    <div className={styles.leaderInfo}>
                      <span className={styles.gradeBadge}>{teamLeader.grade}</span>
                      <Link to={`/members/${teamLeader.id}`} className={styles.memberNameLink}>
                        <h3 className={styles.leaderName}>{teamLeader.full_name}</h3>
                      </Link>
                      <p className={styles.specialty}><strong>{t('specialtyLabel')}:</strong> {teamLeader.specialty}</p>
                      <p className={styles.degree}><strong>{t('degreeLabel')}:</strong> {teamLeader.degree}</p>
                      {teamLeader.bio && <p className={styles.bioExcerpt}>{teamLeader.bio}</p>}
                      <a href={`mailto:${teamLeader.email}`} className={styles.emailLink}>✉️ {teamLeader.email}</a>
                    </div>
                  </div>
                </div>
              )}

              {/* Members Grid */}
              <div className={styles.membersGridBlock}>
                <h2 className={styles.sectionHeading}>
                  {lang === 'ar' ? 'أعضاء فرقة البحث' : (lang === 'fr' ? 'Membres de l\'équipe' : 'Team Members')}
                </h2>
                {regularMembers.length > 0 ? (
                  <div className={styles.membersGrid}>
                    {regularMembers.map(m => (
                      <div key={m.id} className={styles.memberCard}>
                        {m.photo_url && (
                          <div className={styles.memberPhotoWrap}>
                            <img src={m.photo_url} alt={m.full_name} className={styles.memberPhoto} />
                          </div>
                        )}
                        <span className={styles.memberGrade}>{m.grade}</span>
                        <Link to={`/members/${m.id}`} className={styles.memberNameLink}>
                          <h4 className={styles.memberName}>{m.full_name}</h4>
                        </Link>
                        <p className={styles.memberSpecialty}>{m.specialty}</p>
                        <a href={`mailto:${m.email}`} className={styles.memberEmail}>✉️ {m.email}</a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noMembers}>
                    {lang === 'ar' ? 'لا يوجد أعضاء آخرين مسجلين.' : 'No other members registered.'}
                  </p>
                )}
              </div>

            </div>

            {/* Side column: Projects info */}
            <div className={styles.projectsCol}>
              <h2 className={styles.sectionHeading}>
                {lang === 'ar' ? 'المشاريع البحثية للفرقة' : (lang === 'fr' ? 'Projets de recherche' : 'Team Research Projects')}
              </h2>
              
              {projects.length > 0 ? (
                <div className={styles.projectsList}>
                  {projects.map(p => (
                    <div key={p.id} className={styles.projectCard}>
                      <div className={styles.projectHeader}>
                        <Tag label={getProjectStateLabel(p.state)} type={getProjectStateColor(p.state)} />
                        <span className={styles.timeline}>
                          📅 {formatDate(p.started_at)} - {formatDate(p.expected_end_date)}
                        </span>
                      </div>
                      
                      <h3 className={styles.projectName}>{p.name}</h3>
                      <p className={styles.projectDesc}>{p.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noProjectsCard}>
                  <p>{lang === 'ar' ? 'لا توجد مشاريع بحثية مسجلة حالياً لهذه الفرقة.' : 'No research projects recorded for this team yet.'}</p>
                </div>
              )}
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
