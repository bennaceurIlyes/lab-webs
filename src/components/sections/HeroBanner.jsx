import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/hero.png';

export default function HeroBanner() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-secondary/30 border-b border-border py-16 md:py-24" aria-labelledby="hero-title">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-start">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#EA580C] animate-pulse" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {t('heroTag')}
              </span>
            </div>
            
            <h1 id="hero-title" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-serif text-foreground tracking-tight leading-tight">
              {t('heroTitle')}
            </h1>
            
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
              {t('heroSubtitle')}
            </p>
            
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
