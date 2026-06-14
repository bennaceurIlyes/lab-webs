import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Header() {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <header className="bg-secondary/40 border-b border-border py-2 text-xs" role="banner">
      <div className="container-custom flex items-center justify-between flex-row-reverse-rtl">
        {/* Left: University Name */}
        <div>
          <span className="text-muted-foreground font-medium">
            {lang === 'ar' ? 'جامعة طاهري محمد، بشار' : (lang === 'fr' ? 'Université TAHRI Mohammed, Béchar' : 'Tahri Mohammed University, Béchar')}
          </span>
        </div>

        {/* Right: Language, Portal */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold">
            <button
              className={`hover:text-primary transition-colors px-1 ${lang === 'ar' ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setLang('ar')}
              aria-label="Arabic"
            >
              AR
            </button>
            <span className="text-border select-none">|</span>
            <button
              className={`hover:text-primary transition-colors px-1 ${lang === 'fr' ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setLang('fr')}
              aria-label="French"
            >
              FR
            </button>
            <span className="text-border select-none">|</span>
            <button
              className={`hover:text-primary transition-colors px-1 ${lang === 'en' ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setLang('en')}
              aria-label="English"
            >
              EN
            </button>
          </div>
          
          <span className="text-border select-none">|</span>
          
          {user ? (
            <Link
              to="/dashboard"
              className="text-primary hover:underline font-bold transition-colors"
            >
              {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'} ({user.full_name.split(' ').slice(-1)[0]})
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-muted-foreground hover:text-primary font-medium transition-colors"
            >
              {lang === 'ar' ? 'بوابة الدخول' : (lang === 'fr' ? 'Portail' : 'Portal Login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
