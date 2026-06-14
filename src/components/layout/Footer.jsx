import { useTranslation } from '../../hooks/useTranslation';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Repeating triangular wireframe grid SVG background */}
      <div className={styles.gridBackground} aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footerTriGrid" width="100" height="50" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 100 0 M 0 50 L 100 50 M 0 0 L 50 50 L 100 0 M 50 0 L 50 50 M 50 0 L 0 50 M 50 0 L 100 50" stroke="rgba(201, 122, 52, 0.04)" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerTriGrid)" />
        </svg>
      </div>

      <div className={`${styles.inner} flex-row-reverse-rtl`}>
        {/* Lab Contact Info Column */}
        <div className={styles.contactColumn}>
          <h3 className={styles.footerHeading}>{t('instituteAcronym')}</h3>
          <p className={styles.footerLabName}>{t('instituteName')}</p>
          <p className={styles.director}>{t('directorLabel')}</p>
          <p className={styles.univ}>{t('universityLabel')}</p>
        </div>

        {/* Lab Address details Column */}
        <div className={styles.detailsColumn}>
          <p><strong>{t('contactDetailsTitle')}:</strong></p>
          <p className={styles.address}>{t('addressLabel')}</p>
          <p className={styles.phone}>{t('phoneLabel')}</p>
          <p className={styles.fax}>{t('faxLabel')}</p>
        </div>
      </div>

      {/* Legal and Copyright Centered Info */}
      <div className={styles.copyrightBar}>
        <div className={styles.containerBar}>
          <span>© {new Date().getFullYear()} {t('instituteAcronym')} – UMR. </span>
          <a href="#legal" className={styles.footerLink}>{t('footerLegal') || 'Mentions légales'}</a>
          <span> | </span>
          <a href="mailto:ldreas@univ-bechar.dz" className={styles.footerLink}>ldreas@univ-bechar.dz</a>
        </div>
      </div>
    </footer>
  );
}
