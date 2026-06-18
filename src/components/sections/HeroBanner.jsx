import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/hero.png';

export default function HeroBanner() {
  const { t, lang } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-background border-b border-border py-16 md:py-24" aria-labelledby="hero-title">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-start">
            <div className="flex flex-col space-y-4">
              
              {/* Institutional Header Lockup */}
              <div className="border-b border-border pb-4 mb-2">
                <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  {t('universityLabel')}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1.5">
                  {lang === 'fr' 
                    ? 'Faculté des Sciences Exactes • Département de Physique' 
                    : 'Faculty of Exact Sciences • Department of Physics'
                  }
                </div>
              </div>

              {/* Lab Title Lockup */}
              <div className="space-y-3">
                <h1 id="hero-title" className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] xl:text-[40px] font-extrabold font-serif text-foreground tracking-tight leading-[1.25]">
                  {t('instituteName')}
                </h1>
                
                {/* Lab descriptor */}
                <p className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground leading-relaxed italic font-serif">
                  {lang === 'fr' 
                    ? 'Laboratoire de Recherche Agréé — Énergies Renouvelables et Applications Sahariennes' 
                    : 'Accredited Research Laboratory — Renewable Energies and Saharan Applications'
                  }
                </p>
              </div>
            </div>
            
            {/* Core Mission Abstract Box */}
            <div className="border-l-4 border-primary pl-4 py-2 bg-secondary/30 text-foreground/90 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4">
              <p className="font-bold text-primary not-italic mb-1">{t('heroTitle')}</p>
              <p>{t('heroSubtitle')}</p>
            </div>
            
            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm font-semibold">
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center bg-primary text-primary-foreground border border-primary px-6 py-3 hover:bg-primary/90 transition-all duration-150 rounded-[var(--radius)]"
              >
                {t('heroCta1')}
              </Link>
              <Link 
                to="/news" 
                className="inline-flex items-center justify-center border border-border bg-background text-foreground px-6 py-3 hover:bg-secondary transition-all duration-150 rounded-[var(--radius)]"
              >
                {t('heroCta2')}
              </Link>
            </div>
          </div>

          {/* Visual Content (Academic Frame) */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative p-2 bg-background border border-border w-full max-w-md lg:max-w-none rounded-[var(--radius)] shadow-sm">
              <img 
                src={heroImg} 
                alt="Saharan solar arrays and wind turbines illustration" 
                className="w-full h-auto object-cover aspect-[4/3] rounded-none bg-muted" 
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
