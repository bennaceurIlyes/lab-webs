import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Header() {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="w-full flex flex-col">
      {/* 1. Utility Top Bar with Saharan Sand Accent Border */}
      <div className="bg-slate-50 border-b border-[#d5a153] py-2 text-[11px]" role="navigation" aria-label="Utility navigation">
        <div className="container-custom flex flex-row-reverse-rtl items-center justify-between">
          {/* Left: Official Tag */}
          <div>
            <span className="text-muted-foreground font-bold uppercase tracking-wider font-sans">
              {lang === 'ar' ? 'البوابة الرسمية للمختبر' : (lang === 'fr' ? 'PORTAIL OFFICIEL DU LABORATOIRE' : 'OFFICIAL LABORATORY PORTAL')}
            </span>
          </div>

          {/* Right: Language Selector & Portal */}
          <div className="flex items-center gap-3 font-sans font-semibold">
            <div className="flex items-center gap-1.5">
              <button
                className={`hover:text-[#1a2b4a] transition-colors px-1 ${lang === 'ar' ? 'text-[#1a2b4a] font-bold' : 'text-slate-500'}`}
                onClick={() => setLang('ar')}
                aria-label="Arabic"
              >
                AR
              </button>
              <span className="text-slate-300 select-none">|</span>
              <button
                className={`hover:text-[#1a2b4a] transition-colors px-1 ${lang === 'fr' ? 'text-[#1a2b4a] font-bold' : 'text-slate-500'}`}
                onClick={() => setLang('fr')}
                aria-label="French"
              >
                FR
              </button>
              <span className="text-slate-300 select-none">|</span>
              <button
                className={`hover:text-[#1a2b4a] transition-colors px-1 ${lang === 'en' ? 'text-[#1a2b4a] font-bold' : 'text-slate-500'}`}
                onClick={() => setLang('en')}
                aria-label="English"
              >
                EN
              </button>
            </div>
            
            <span className="text-slate-300 select-none">|</span>
            
            {user ? (
              <Link
                to="/dashboard"
                className="text-[#1a2b4a] hover:underline font-bold transition-colors"
              >
                {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'} ({user.full_name.split(' ').slice(-1)[0]})
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-slate-500 hover:text-[#1a2b4a] font-medium transition-colors"
              >
                {lang === 'ar' ? 'بوابة الدخول' : (lang === 'fr' ? 'Portail' : 'Portal Login')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Centered Institutional Title Header (Above Nav Bar) */}
      <header className="bg-white py-8 border-b border-slate-100 text-center" role="banner">
        <div className="container-custom flex flex-col items-center justify-center space-y-3">
          {/* University Name */}
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#1a2b4a]/80 leading-none font-sans">
            {lang === 'ar' ? 'جامعة طاهري محمد، بشار' : (lang === 'fr' ? 'UNIVERSITÉ TAHRI MOHAMMED, BÉCHAR' : 'TAHRI MOHAMMED UNIVERSITY, BÉCHAR')}
          </div>
          {/* Department/Faculty */}
          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none font-sans">
            {lang === 'ar' ? 'كلية العلوم الدقيقة • قسم الفيزياء' : (lang === 'fr' ? 'FACULTÉ DES SCIENCES EXACTES • DÉPARTEMENT DE PHYSIQUE' : 'FACULTY OF EXACT SCIENCES • DEPARTMENT OF PHYSICS')}
          </div>
          
          {/* Laboratory Name - Dominant Visual Element */}
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-extrabold text-[#1a2b4a] tracking-tight leading-snug max-w-4xl px-4">
            {t('instituteName')} <span className="font-sans font-bold text-[#1a2b4a]">({t('instituteAcronym')})</span>
          </h1>
        </div>
      </header>
    </div>
  );
}
