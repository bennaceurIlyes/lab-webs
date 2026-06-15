import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/hero.png';

export default function HeroBanner() {
  const { t, lang } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-background border-b border-border py-16 md:py-24" aria-labelledby="hero-title">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-start">
            <div className="flex flex-col space-y-4">
              {/* Simple Clean University Tag */}
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#c2410c] animate-pulse" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-primary">
                  {t('universityLabel')}
                </span>
              </div>

              {/* Lab Title Lockup */}
              <div className="space-y-3">
                <h1 id="hero-title" className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] xl:text-[40px] font-extrabold font-serif text-foreground tracking-tight leading-[1.25]">
                  {lang === 'ar' ? (
                    t('instituteName')
                  ) : (
                    <>
                      {t('instituteName')}{' '}
                      <span className="text-[#ea580c] font-sans font-bold">({t('instituteAcronym')})</span>
                    </>
                  )}
                </h1>
                
                {/* Bilingual subtitle for high prestige */}
                <p className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground leading-relaxed italic font-serif">
                  {lang === 'ar' 
                    ? 'Laboratoire de Développement des Energies Renouvelables et Leurs Applications dans les Zones Sahariennes' 
                    : 'مخبر تطوير الطاقات المتجددة وتطبيقاتها في المناطق الصحراوية'
                  }
                </p>
              </div>
            </div>
            
            <div className="border-l-4 border-[#c2410c] pl-4 py-1.5 italic text-foreground/85 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4">
              <p className="font-bold text-primary not-italic mb-1">{t('heroTitle')}</p>
              <p>{t('heroSubtitle')}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-4 text-sm font-semibold">
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 shadow-md hover:bg-primary/95 transition-all hover:-translate-y-0.5 duration-150 rounded-[var(--radius)]"
              >
                {t('heroCta1')}
              </Link>
              <Link 
                to="/news" 
                className="inline-flex items-center justify-center border border-border bg-background text-foreground px-6 py-3 hover:bg-secondary transition-all hover:-translate-y-0.5 duration-150 rounded-[var(--radius)]"
              >
                {t('heroCta2')}
              </Link>
            </div>
          </div>

          {/* Visual Content (Image Container) */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative p-2.5 bg-background border border-border shadow-[0_10px_40px_-15px_rgba(7,76,112,0.18)] hover:shadow-[0_15px_50px_-10px_rgba(234,88,12,0.22)] transition-shadow duration-300 w-full max-w-md lg:max-w-none rounded-[var(--radius)] overflow-hidden">
              <img 
                src={heroImg} 
                alt="Saharan solar arrays and wind turbines illustration" 
                className="w-full h-auto object-cover aspect-[4/3] rounded-[calc(var(--radius)-2px)] bg-muted" 
                loading="eager"
              />
              {/* Subtle solar flare glow overlay */}
              <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-[var(--radius)] bg-gradient-to-tr from-primary/10 via-transparent to-accent/15 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
