import { useEffect, useState, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { dbService } from '../../lib/dbService';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import styles from './TeamsPreview.module.css';

export default function TeamsPreview() {
  const { t, lang } = useTranslation();
  const [teams, setTeams] = useState([]);
  const [memberCounts, setMemberCounts] = useState({});
  const cardsRef = useRef([]);

  useEffect(() => {
    Promise.all([
      dbService.getTeams(lang),
      dbService.getMembers(lang)
    ]).then(([teamsData, membersData]) => {
      setTeams(teamsData);
      
      // Calculate member counts per team
      const counts = {};
      teamsData.forEach(team => {
        counts[team.id] = membersData.filter(m => m.team_id === team.id).length;
      });
      setMemberCounts(counts);
    }).catch(err => console.error("Error loading teams preview", err));
  }, [lang]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [teams]);

  return (
    <section className={styles.section} aria-label={t('statTeams') || 'Research Teams'}>
      {/* TODO: Replace with real LDREAS lab photo — see /docs/photo-brief.md */}
      <div className={styles.container}>
        <SectionTitle
          title={t('statTeams') || 'Research Teams'}
          subtitle={lang === 'ar' ? 'الفرق العلمية المعتمدة ومحاورها الاستراتيجية' : 'Accredited research teams and their strategic focus area'}
          centered
        />
        <div className={`${styles.grid} flex-row-reverse-rtl`}>
          {teams.map((team, i) => (
            <div
              key={team.id}
              className={`${styles.card} fade-in-up`}
              ref={el => cardsRef.current[i] = el}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.acronym}>{team.acronym}</span>
                <span className={styles.memberCount}>
                  {memberCounts[team.id] || 0} {lang === 'ar' ? 'أعضاء' : (lang === 'fr' ? 'membres' : 'members')}
                </span>
              </div>
              <h3 className={styles.teamName}>{team.name}</h3>
              <p className={styles.description}>{team.description}</p>
              <Link to={`/teams/${team.id}`} className={styles.link}>
                {lang === 'ar' ? 'عرض تفاصيل الفريق ➔' : (lang === 'fr' ? 'Voir l\'équipe ➔' : 'View Team Details ➔')}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
