import { useTranslation } from '../hooks/useTranslation';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/sections/HeroBanner';
import TeamsPreview from '../components/sections/TeamsPreview';
import PublicationsList from '../components/sections/PublicationsList';
import SectionTitle from '../components/ui/SectionTitle';
import NewsGrid from '../components/sections/NewsGrid';
import EventsList from '../components/sections/EventsList';
import LeadershipPreview from '../components/sections/LeadershipPreview';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main id="main-content">
      <HeroBanner />

      {/* Brief Presentation Section */}
      <section className="py-16 bg-background border-b border-border animate-fade-in" aria-labelledby="home-about-title">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch flex-row-reverse-rtl">
            {/* Presentation Text */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6 text-start">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">
                  {t('navAbout')}
                </span>
                <h2 id="home-about-title" className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-serif text-foreground tracking-tight leading-tight mb-4">
                  {t('homeAboutTitle')}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                  {t('homeAboutText')}
                </p>
                <div className="border-l-4 border-primary pl-4 py-2 italic text-xs sm:text-sm text-foreground bg-secondary/30 rounded-r-[var(--radius)] rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4 rtl:rounded-l-[var(--radius)] rtl:rounded-r-none mb-6">
                  <p className="font-semibold text-primary not-italic mb-1">{t('missionTitle')}</p>
                  <p>"{t('missionText')}"</p>
                </div>
              </div>
              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-md hover:bg-primary/95 transition-all hover:-translate-y-0.5 duration-150 rounded-[var(--radius)]"
                >
                  {t('btnMore')}
                </Link>
              </div>
            </div>

            {/* Identification Card */}
            <div className="lg:col-span-5 flex items-center">
              <div className="w-full bg-secondary/20 border border-border p-6 sm:p-8 space-y-5 rounded-[var(--radius)] text-start relative overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/5 blur-xl pointer-events-none" />
                <h3 className="font-serif font-bold text-lg text-foreground border-b border-border pb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {t('idTitle')}
                </h3>
                
                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">{t('idEstablishment')}</span>
                    <span className="text-foreground font-medium">{t('universityLabel')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">{t('idCreated')}</span>
                      <span className="text-foreground font-medium">10 Février 2020</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">{t('idDecree')}</span>
                      <span className="text-foreground font-medium">N° 05</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">{t('idDirector')}</span>
                    <span className="text-foreground font-semibold text-primary">Pr. NOURI Abdelkader</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TeamsPreview />
      <PublicationsList />

      <section className="py-16 bg-secondary/10 border-b border-border" aria-label={t('newsTitle')}>
        <div className="container-custom">
          <SectionTitle title={t('newsTitle')} subtitle={t('newsSubtitle')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-row-reverse-rtl">
            <NewsGrid />
            <EventsList />
          </div>
        </div>
      </section>

      <LeadershipPreview />
    </main>
  );
}
