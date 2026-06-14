import { useTranslation } from '../hooks/useTranslation';
import HeroBanner from '../components/sections/HeroBanner';
import TeamsPreview from '../components/sections/TeamsPreview';
import PublicationsList from '../components/sections/PublicationsList';
import SectionTitle from '../components/ui/SectionTitle';
import NewsGrid from '../components/sections/NewsGrid';
import EventsList from '../components/sections/EventsList';
import LeadershipPreview from '../components/sections/LeadershipPreview';
import styles from './Home.module.css';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main id="main-content">
      <HeroBanner />
      <TeamsPreview />
      <PublicationsList />

      <section className={styles.newsEventsSection} aria-label={t('newsTitle')}>
        <div className={styles.container}>
          <SectionTitle title={t('newsTitle')} subtitle={t('newsSubtitle')} />
          <div className={`${styles.newsEventsGrid} flex-row-reverse-rtl`}>
            <NewsGrid />
            <EventsList />
          </div>
        </div>
      </section>

      <LeadershipPreview />
    </main>
  );
}
