import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';

export default function HeroBanner() {
  const { t } = useTranslation();

  return (
    <section className="bg-background border-b border-border py-20 md:py-28" aria-labelledby="hero-title">
      <div className="container-custom">
        <div className="max-w-3xl flex flex-col space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {t('heroTag')}
          </span>
          <h1 id="hero-title" className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-serif text-foreground tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
            {t('heroSubtitle')}
          </p>
          
          <div className="flex items-center gap-4 text-sm font-semibold pt-4 flex-row-reverse-rtl">
            <Link to="/about" className="text-primary hover:underline">
              {t('heroCta1')}
            </Link>
            <span className="text-border select-none">/</span>
            <Link to="/news" className="text-primary hover:underline">
              {t('heroCta2')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
