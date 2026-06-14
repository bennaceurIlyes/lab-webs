import { useEffect, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { dbService } from '../../lib/dbService';
import StatCounter from '../ui/StatCounter';
import styles from './StatsBar.module.css';

const icons = {
  teams: (
    <svg viewBox="0 0 40 40" fill="none" stroke="#fff" strokeWidth="1.5">
      <circle cx="14" cy="12" r="4" />
      <circle cx="26" cy="12" r="4" />
      <circle cx="20" cy="24" r="4" />
      <path d="M8 28c0-3.3 2.7-6 6-6M26 28c0-3.3 2.7-6 6-6" />
    </svg>
  ),
  members: (
    <svg viewBox="0 0 40 40" fill="none" stroke="#fff" strokeWidth="1.5">
      <circle cx="20" cy="12" r="5" />
      <path d="M10 32c0-5.5 4.5-10 10-10s10 4.5 10 10" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 40 40" fill="none" stroke="#fff" strokeWidth="1.5">
      <rect x="6" y="6" width="28" height="28" rx="3" />
      <path d="M6 14h28M14 14v20" />
      <circle cx="24" cy="24" r="4" />
    </svg>
  ),
  publications: (
    <svg viewBox="0 0 40 40" fill="none" stroke="#fff" strokeWidth="1.5">
      <path d="M12 6h16a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z" />
      <path d="M14 12h12M14 18h12M14 24h8" />
    </svg>
  ),
};

export default function StatsBar() {
  const { t, lang } = useTranslation();
  const [counts, setCounts] = useState({
    teams: 0,
    members: 0,
    projects: 0,
    publications: 0
  });

  useEffect(() => {
    Promise.all([
      dbService.getTeams(lang),
      dbService.getMembers(lang),
      dbService.getProjects(lang),
      dbService.getArticles(lang)
    ]).then(([teamsData, membersData, projectsData, articlesData]) => {
      setCounts({
        teams: teamsData.length,
        members: membersData.length,
        projects: projectsData.length,
        publications: articlesData.length
      });
    }).catch(err => console.error("Error loading stats", err));
  }, [lang]);

  const stats = [
    { value: counts.teams || 3, label: t('statTeams'), icon: icons.teams },
    { value: counts.members || 6, label: t('statMembers'), icon: icons.members },
    { value: counts.projects || 3, label: t('statProjects'), icon: icons.projects },
    { value: counts.publications || 3, label: t('navPublications'), icon: icons.publications },
  ];

  return (
    <section className={styles.statsBar} aria-label="Key statistics">
      <div className={`${styles.inner} flex-row-reverse-rtl`}>
        {stats.map((stat, i) => (
          <div key={stat.label} className={styles.item}>
            <StatCounter value={stat.value} label={stat.label} icon={stat.icon} />
            {i < stats.length - 1 && <div className={styles.divider} />}
          </div>
        ))}
      </div>
    </section>
  );
}
