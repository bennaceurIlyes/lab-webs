import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Repeating triangular wireframe grid SVG background */}
      <div className={styles.gridBackground} aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footerTriGrid" width="100" height="50" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 100 0 M 0 50 L 100 50 M 0 0 L 50 50 L 100 0 M 50 0 L 50 50 M 50 0 L 0 50 M 50 0 L 100 50" stroke="#eaeef5" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerTriGrid)" />
        </svg>
      </div>

      <div className={styles.inner}>
        {/* Partner Logos Row */}
        <div className={styles.logosRow}>
          {/* CNRS Logo SVG */}
          <div className={styles.logoItem} title="CNRS">
            <svg width="60" height="60" viewBox="0 0 100 100" className={styles.partnerSvg}>
              <circle cx="50" cy="50" r="45" fill="#002957" />
              <text x="50" y="58" textAnchor="middle" fontFamily="Montserrat" fontSize="24" fontWeight="800" fill="#ffffff">cnrs</text>
            </svg>
          </div>

          {/* AMU Logo SVG */}
          <div className={styles.logoItem} title="Aix-Marseille Université">
            <svg width="90" height="40" viewBox="0 0 150 60" className={styles.partnerSvg}>
              <text x="10" y="32" fontFamily="Montserrat" fontSize="36" fontWeight="700" fill="#000000" letterSpacing="-2">amu</text>
              <text x="95" y="24" fontFamily="Montserrat" fontSize="12" fontWeight="700" fill="#000000">Aix</text>
              <text x="95" y="36" fontFamily="Montserrat" fontSize="10" fontWeight="500" fill="#666666">Marseille</text>
              <text x="95" y="46" fontFamily="Montserrat" fontSize="10" fontWeight="500" fill="#666666">Université</text>
            </svg>
          </div>

          {/* Université de Toulon Logo SVG */}
          <div className={styles.logoItem} title="Université de Toulon">
            <svg width="120" height="40" viewBox="0 0 200 60" className={styles.partnerSvg}>
              <rect x="10" y="15" width="25" height="5" fill="#009fe3" />
              <rect x="10" y="25" width="25" height="5" fill="#002d62" />
              <rect x="10" y="35" width="25" height="5" fill="#009fe3" />
              <text x="45" y="26" fontFamily="Montserrat" fontSize="11" fontWeight="800" fill="#002d62">UNIVERSITÉ DE</text>
              <text x="45" y="44" fontFamily="Montserrat" fontSize="18" fontWeight="800" fill="#002d62" letterSpacing="1">TOULON</text>
            </svg>
          </div>

          {/* ISEN Logo SVG */}
          <div className={styles.logoItem} title="ISEN">
            <svg width="80" height="40" viewBox="0 0 120 50" className={styles.partnerSvg}>
              <text x="10" y="38" fontFamily="Montserrat" fontSize="32" fontWeight="800" fill="#e30613">ISEN</text>
            </svg>
          </div>

          {/* Yncréa Logo SVG */}
          <div className={styles.logoItem} title="Yncréa">
            <svg width="70" height="40" viewBox="0 0 100 50" className={styles.partnerSvg}>
              <circle cx="25" cy="25" r="15" fill="#111111" />
              <text x="25" y="31" textAnchor="middle" fontFamily="Montserrat" fontSize="18" fontWeight="700" fill="#ffffff">y</text>
              <text x="48" y="28" fontFamily="Montserrat" fontSize="10" fontWeight="800" fill="#111111">yncréa</text>
            </svg>
          </div>
        </div>

        {/* Legal and Copyright Centered Info */}
        <div className={styles.copyrightBar}>
          <span>© Copyright LMNP - Design by e-frogg.fr | </span>
          <a href="#legal" className={styles.footerLink}>Mentions légales</a>
          <span> | </span>
          <a href="mailto:webmaster@lmnp.fr" className={styles.footerLink}>webmaster@lmnp.fr</a>
        </div>
      </div>
    </footer>
  );
}
