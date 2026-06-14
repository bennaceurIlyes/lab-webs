import { useEffect, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { dbService } from '../../lib/dbService';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import styles from './LeadershipPreview.module.css';

export default function LeadershipPreview() {
  const { t, lang } = useTranslation();
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    dbService.getMembers(lang).then(members => {
      const leadership = members.filter(m =>
        m.role === 'lab_leader' || m.role === 'team_leader'
      ).slice(0, 4);
      setLeaders(leadership);
    }).catch(err => console.error('Error loading leadership', err));
  }, [lang]);

  const roleLabel = (role) => {
    if (role === 'lab_leader') {
      return lang === 'ar' ? 'مدير المختبر' : (lang === 'fr' ? 'Directeur du laboratoire' : 'Laboratory Director');
    }
    return lang === 'ar' ? 'رئيس فريق بحث' : (lang === 'fr' ? 'Chef d\'équipe' : 'Team Leader');
  };

  return (
    <section className={styles.section} aria-label={t('directorTitle')}>
      <div className={styles.container}>
        <SectionTitle
          title={lang === 'ar' ? 'القيادة العلمية' : (lang === 'fr' ? 'Direction & Leadership' : 'Leadership')}
          subtitle={t('teamSubtitle')}
        />
        <div className={`${styles.grid} flex-row-reverse-rtl`}>
          {leaders.map(leader => (
            <article key={leader.id} className={styles.card}>
              {leader.photo_url && (
                <img
                  src={leader.photo_url}
                  alt=""
                  className={styles.photo}
                  loading="lazy"
                />
              )}
              <div className={styles.body}>
                <p className={styles.role}>{roleLabel(leader.role)}</p>
                <h3 className={styles.name}>
                  <Link to={`/members/${leader.id}`} className={styles.nameLink}>
                    {leader.full_name}
                  </Link>
                </h3>
                <p className={styles.specialty}>{leader.specialty}</p>
                <p className={styles.bio}>{leader.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
