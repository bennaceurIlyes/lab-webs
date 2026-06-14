import { useTranslation } from '../../hooks/useTranslation';
import styles from './PartnersStrip.module.css';

const partners = [
  { name: 'MESRS Algeria', id: 'mesrs' },
  { name: 'DGRSDT', id: 'dgrsdt' },
  { name: 'Univ. Béchar', id: 'utmb' },
  { name: 'CDER', id: 'cder' },
  { name: 'APRUE', id: 'aprue' },
];

export default function PartnersStrip() {
  const { t } = useTranslation();

  return (
    <section className={styles.section} aria-label={t('partnerLogos')}>
      <div className={styles.inner}>
        <span className={styles.label}>{t('partnerLogos')}</span>
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
