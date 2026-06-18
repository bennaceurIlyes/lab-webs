import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import LdreasLogo from '../ui/LdreasLogo';
import univLogo from '../../assets/univ logo.jpg';

export default function Header() {
  const { lang } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col">
      {/* 1. Dual-Logo Header Strip — No Text */}
      <header className="bg-white py-6 border-b border-[#d5a153]" role="banner">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 sm:gap-8">
          {/* Left: Laboratory Logo */}
          <div className="flex flex-col items-center sm:items-start">
            <LdreasLogo variant="dark" className="h-16 sm:h-20 md:h-24 w-auto" />
          </div>

          {/* Right: University Logo */}
          <div className="flex flex-col items-center sm:items-end">
            <img
              src={univLogo}
              alt={t('universityLabel')}
              className="h-12 sm:h-16 md:h-20 w-auto opacity-80"
            />
          </div>
        </div>
      </header>
    </div>
  );
}
