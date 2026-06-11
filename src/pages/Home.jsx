/* Home page — assembles all main sections of the lab website */
import { useTranslation } from '../hooks/useTranslation';
import SectionTitle from '../components/ui/SectionTitle';
import HeroBanner from '../components/sections/HeroBanner';
import StatsBar from '../components/sections/StatsBar';
import NewsGrid from '../components/sections/NewsGrid';
import EventsList from '../components/sections/EventsList';
import DepartmentsGrid from '../components/sections/DepartmentsGrid';
import PartnersStrip from '../components/sections/PartnersStrip';
import PublicationsList from '../components/sections/PublicationsList';
import styles from './Home.module.css';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main id="main-content">
      <HeroBanner />
      <StatsBar />

      <section className={styles.newsEventsSection} aria-label={t('newsTitle')}>
        <div className={styles.container}>
          <SectionTitle title={t('newsTitle')} subtitle={t('newsSubtitle')} />
          <div className={styles.newsEventsGrid}>
            <NewsGrid />
            <EventsList />
          </div>
        </div>
      </section>

      <DepartmentsGrid />
      <PartnersStrip />
      <PublicationsList />
    </main>
  );
}
