import { useEffect, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { dbService } from '../../lib/dbService';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import styles from './TeamsPreview.module.css';

export default function TeamsPreview() {
  const { t, lang } = useTranslation();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    dbService.getTeams(lang).then(setTeams).catch(err => console.error('Error loading teams', err));
  }, [lang]);

  const sectionTitle = lang === 'ar'
    ? 'مجالات البحث'
    : (lang === 'fr' ? 'Axes de Recherche' : 'Research Areas');

  const sectionSubtitle = lang === 'ar'
    ? 'الفرق العلمية TER، PVES و WEAS'
    : (lang === 'fr'
      ? 'Équipes TER, PVES et WEAS'
      : 'TER, PVES and WEAS research teams');

  return (
    <section className={styles.section} aria-label={sectionTitle}>
      <div className={styles.container}>
        <SectionTitle title={sectionTitle} subtitle={sectionSubtitle} />
        <div className={`${styles.grid} flex-row-reverse-rtl`}>
          {teams.map(team => (
            <article key={team.id} className={styles.card}>
              <p className={styles.acronym}>{team.acronym}</p>
              <h3 className={styles.teamName}>{team.name}</h3>
              <p className={styles.description}>{team.description}</p>
              <Link to={`/teams/${team.id}`} className={styles.link}>
                {lang === 'ar' ? 'عرض الفريق →' : (lang === 'fr' ? 'Voir l\'équipe →' : 'View team →')}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
