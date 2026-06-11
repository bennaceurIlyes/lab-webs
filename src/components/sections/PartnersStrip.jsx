/* PartnersStrip — horizontal row of partner logo placeholders */
import { useTranslation } from '../../hooks/useTranslation';
import styles from './PartnersStrip.module.css';

const partners = [
  { name: 'CNRS', id: 'cnrs' },
  { name: 'AMU', id: 'amu' },
  { name: 'Univ. Toulon', id: 'toulon' },
  { name: 'ANR', id: 'anr' },
  { name: 'Europe', id: 'europe' },
  { name: 'PACA', id: 'paca' },
];

export default function PartnersStrip() {
  const { t } = useTranslation();

  return (
    <section className={styles.section} aria-label={t('partnersLabel')}>
      <div className={styles.inner}>
        <span className={styles.label}>{t('partnersLabel')}</span>
        <div className={styles.row}>
          {partners.map(p => (
            <div key={p.id} className={styles.logo} title={p.name}>
              <span className={styles.logoText}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
