import { useTranslation } from '../../hooks/useTranslation';
import Tag from '../ui/Tag';
import styles from './EventsList.module.css';

export default function EventsList() {
  const { t, lang } = useTranslation();

  const events = [
    {
      id: 'ev_1',
      day: '15',
      month: lang === 'ar' ? 'أكتوبر' : (lang === 'fr' ? 'Octobre' : 'October'),
      title: lang === 'ar' ? 'ندوة الطاقة الشمسية المركزة' : (lang === 'fr' ? 'Séminaire Solaire Concentré' : 'Concentrated Solar Seminar'),
      type: lang === 'ar' ? 'ندوة' : 'Seminar',
      location: 'Auditorium, Béchar'
    },
    {
      id: 'ev_2',
      day: '08',
      month: lang === 'ar' ? 'نوفمبر' : (lang === 'fr' ? 'Novembre' : 'November'),
      title: lang === 'ar' ? 'مناقشة دكتوراه: تخزين الطاقة الحرارية' : (lang === 'fr' ? 'Soutenance de Thèse: PCM' : 'PhD Defense: PCM Storage'),
      type: lang === 'ar' ? 'مناقشة' : 'Defense',
      location: 'Block C, Room 14'
    },
    {
      id: 'ev_3',
      day: '12',
      month: lang === 'ar' ? 'ديسمبر' : (lang === 'fr' ? 'Décembre' : 'December'),
      title: lang === 'ar' ? 'يوم دراسي: طاقة الرياح بالجنوب' : (lang === 'fr' ? 'Journée d\'étude Éolienne' : 'Saharan Wind Study Day'),
      type: lang === 'ar' ? 'ورشة عمل' : 'Workshop',
      location: 'Lab Room 05, University of Béchar'
    }
  ];

  return (
    <div className={styles.eventsColumn}>
      <div className={`${styles.header} flex-row-reverse-rtl`}>
        <h3 className={styles.heading}>{t('eventsTitle')}</h3>
        <Link to="/news" className={styles.viewAll}>{t('eventsViewAll')}</Link>
      </div>
      <ul className={styles.list}>
        {events.map((ev, i) => (
          <li key={ev.id} className={`${styles.item} flex-row-reverse-rtl`}>
            <div className={styles.dateBlock}>
              <span className={styles.day}>{ev.day}</span>
              <span className={styles.month}>{ev.month}</span>
            </div>
            <div className={styles.info}>
              <span className={styles.eventTitle}>
                {ev.title}
              </span>
              <div className={styles.eventMeta}>
                <Tag label={ev.type} />
                <span className={styles.location}>{ev.location}</span>
              </div>
            </div>
            {i < events.length - 1 && <div className={styles.divider} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Simple link helper in case react-router Link is missing
import { Link } from 'react-router-dom';
