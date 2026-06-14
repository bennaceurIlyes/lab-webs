import { useTranslation } from '../hooks/useTranslation';
import SectionTitle from '../components/ui/SectionTitle';
import HeroBanner from '../components/sections/HeroBanner';
import StatsBar from '../components/sections/StatsBar';
import NewsGrid from '../components/sections/NewsGrid';
import EventsList from '../components/sections/EventsList';
import TeamsPreview from '../components/sections/TeamsPreview';
import PartnersStrip from '../components/sections/PartnersStrip';
import PublicationsList from '../components/sections/PublicationsList';
import styles from './Home.module.css';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main id="main-content">
      <HeroBanner />
      <StatsBar />

      {/* Lab Mission Statement Section */}
      <section className={styles.missionSection} aria-label={t('missionTitle')}>
        <div className={styles.container}>
          <div className={styles.missionCard}>
            <h2 className={styles.missionTitle}>{t('missionTitle')}</h2>
            <p className={styles.missionText}>{t('missionText')}</p>
          </div>
        </div>
      </section>

      <section className={styles.newsEventsSection} aria-label={t('newsTitle')}>
        <div className={styles.container}>
          <SectionTitle title={t('newsTitle')} subtitle={t('newsSubtitle')} />
          <div className={`${styles.newsEventsGrid} flex-row-reverse-rtl`}>
            <NewsGrid />
            <EventsList />
          </div>
        </div>
      </section>

      <TeamsPreview />
      <PartnersStrip />
      <PublicationsList />
    </main>
  );
}
