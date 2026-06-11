/* EventsList — sidebar list of upcoming events with date blocks */
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import { events } from '../../data/events';
import Tag from '../ui/Tag';
import styles from './EventsList.module.css';

export default function EventsList() {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  return (
    <div className={styles.eventsColumn}>
      <div className={styles.header}>
        <h3 className={styles.heading}>{t('eventsTitle')}</h3>
        <a href="#events" className={styles.viewAll}>{t('eventsViewAll')}</a>
      </div>
      <ul className={styles.list}>
        {events.map((ev, i) => (
          <li key={ev.id} className={styles.item}>
            <div className={styles.dateBlock}>
              <span className={styles.day}>{ev.day}</span>
              <span className={styles.month}>{lang === 'en' ? ev.monthEn : ev.month}</span>
            </div>
            <div className={styles.info}>
              <span className={styles.eventTitle}>
                {lang === 'en' && ev.titleEn ? ev.titleEn : ev.title}
              </span>
              <div className={styles.eventMeta}>
                <Tag label={lang === 'en' && ev.typeEn ? ev.typeEn : ev.type} />
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
