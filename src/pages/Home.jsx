import { useTranslation } from '../hooks/useTranslation';
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
