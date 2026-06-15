import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import LdreasLogo from '../ui/LdreasLogo';

export default function Footer() {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t border-border mt-auto py-12 text-sm" role="contentinfo">
      <div className="container-custom grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 flex-row-reverse-rtl">
        {/* Identity Section */}
        <div className="flex flex-col space-y-3">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold">
            <LdreasLogo variant="dark" className="h-10 w-auto text-primary" />
          </Link>
          <div>
            <h3 className="font-semibold text-foreground">{t('instituteAcronym')}</h3>
            <p className="text-foreground/80 text-xs mt-1 leading-relaxed">{t('instituteName')}</p>
          </div>
          <p className="text-foreground/80 text-xs leading-relaxed">{t('addressLabel')}</p>
          <p className="text-foreground/80 text-xs leading-relaxed font-medium">{t('universityLabel')}</p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-3">
          <h4 className="font-semibold text-foreground">{lang === 'ar' ? 'روابط سريعة' : (lang === 'fr' ? 'Liens Rapides' : 'Quick Links')}</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="text-foreground/70 hover:text-primary transition-colors">{t('navHome')}</Link></li>
            <li><Link to="/about" className="text-foreground/70 hover:text-primary transition-colors">{t('navAbout')}</Link></li>
            <li><Link to="/news" className="text-foreground/70 hover:text-primary transition-colors">{t('navNews')}</Link></li>
            <li><Link to="/articles" className="text-foreground/70 hover:text-primary transition-colors">{t('navPublications')}</Link></li>
            <li><Link to="/teams" className="text-foreground/70 hover:text-primary transition-colors">{t('navTeam')}</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-3 text-xs">
          <h4 className="font-semibold text-foreground text-sm">{t('contactDetailsTitle') || 'Contact'}</h4>
          <p className="text-foreground/80">{t('phoneLabel')}</p>
          <p className="text-foreground/80">{t('faxLabel')}</p>
          <p className="text-foreground/80">
            <a href="mailto:contact@lderas.dz" className="hover:text-primary transition-colors">contact@lderas.dz</a>
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-6 mt-6">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-foreground/70">
          <div>
            <span>© {new Date().getFullYear()} {t('instituteAcronym')} — {t('universityLabel')}</span>
            <span className="mx-2 select-none text-border">|</span>
            <a href="#legal" className="hover:text-primary transition-colors">{t('footerLegal')}</a>
          </div>

          <div className="flex items-center gap-1.5 font-semibold">
            <button className={`hover:text-primary transition-colors px-1 ${lang === 'ar' ? 'text-primary' : ''}`} onClick={() => setLang('ar')} aria-label="AR">AR</button>
            <span className="text-border select-none">|</span>
            <button className={`hover:text-primary transition-colors px-1 ${lang === 'fr' ? 'text-primary' : ''}`} onClick={() => setLang('fr')} aria-label="FR">FR</button>
            <span className="text-border select-none">|</span>
            <button className={`hover:text-primary transition-colors px-1 ${lang === 'en' ? 'text-primary' : ''}`} onClick={() => setLang('en')} aria-label="EN">EN</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
