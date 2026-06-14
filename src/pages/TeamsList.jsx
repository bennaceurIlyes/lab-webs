import { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import { Link } from 'react-router-dom';
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
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">{t('navHome')}</Link> / {t('navTeam') || 'Teams'}
          </nav>
          <h1 className={styles.heroTitle}>{t('projectsTitle') || 'Research Teams'}</h1>
        </div>
      </section>

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
                    {lang === 'ar' ? 'عرض تفاصيل الفرقة ➔' : (lang === 'fr' ? 'Détails de l\'équipe ➔' : 'View Team Details ➔')}
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
