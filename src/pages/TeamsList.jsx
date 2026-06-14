import { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero';
import styles from './TeamsList.module.css';

export default function TeamsList() {
  const { t, lang } = useTranslation();
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberCounts, setMemberCounts] = useState({});

  useEffect(() => {
    Promise.all([
      dbService.getTeams(lang),
      dbService.getMembers(lang)
    ]).then(([teamsData, membersData]) => {
      setTeams(teamsData);
      setMembers(membersData);
      
      const counts = {};
      teamsData.forEach(team => {
        counts[team.id] = membersData.filter(m => m.team_id === team.id).length;
      });
      setMemberCounts(counts);
    }).catch(err => console.error("Error loading teams list", err));
  }, [lang]);

  const getLeaderName = (leaderId) => {
    const leader = members.find(m => m.id === leaderId);
    return leader ? leader.full_name : '';
  };

  return (
    <main id="main-content">
      <PageHero title={t('projectsTitle')} subtitle={t('projectsSubtitle')}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true"> / </span>
        <span>{t('navTeam')}</span>
      </PageHero>

      {/* Grid List */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.grid} flex-row-reverse-rtl`}>
            {teams.map(team => (
              <div key={team.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.acronym}>{team.acronym}</span>
                  <span className={styles.count}>
                    {memberCounts[team.id] || 0} {lang === 'ar' ? 'أعضاء' : (lang === 'fr' ? 'membres' : 'members')}
                  </span>
                </div>
                
                <h2 className={styles.teamTitle}>
                  <Link to={`/teams/${team.id}`} className={styles.titleLink}>
                    {team.name}
                  </Link>
                </h2>
                
                <p className={styles.description}>{team.description}</p>
                
                {team.team_leader_id && (
                  <div className={styles.leaderInfo}>
                    <span className={styles.leaderLabel}>{lang === 'ar' ? 'رئيس فرقة البحث' : (lang === 'fr' ? 'Chef d\'équipe' : 'Team Leader')}:</span>
                    <Link to={`/members/${team.team_leader_id}`} className={styles.leaderName}>
                      {getLeaderName(team.team_leader_id)}
                    </Link>
                  </div>
                )}
                
                <div className={styles.cardFooter}>
                  <Link to={`/teams/${team.id}`} className={styles.viewBtn}>
                    {lang === 'ar' ? 'عرض الفريق →' : (lang === 'fr' ? 'Voir l\'équipe →' : 'View team →')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
