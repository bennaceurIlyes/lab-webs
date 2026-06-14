import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import { Link } from 'react-router-dom';
import Tag from '../components/ui/Tag';
import PageHero from '../components/layout/PageHero';
import styles from './News.module.css';

// Local translation dictionary for new premium UI elements
const UI_TRANSLATIONS = {
  en: {
    featured: "Featured Story",
    searchPlaceholder: "Search news by keyword...",
    all: "All News",
    breakthrough: "Breakthroughs",
    event: "Events & Workshops",
    announcement: "Announcements",
    newsletterTitle: "Research Bulletin",
    newsletterDesc: "Subscribe to receive the latest scientific breakthroughs, lab updates, and academic event details directly to your inbox.",
    emailPlaceholder: "Enter your email address...",
    subscribe: "Subscribe",
    thanks: "Subscription confirmed! Thank you for staying connected.",
    readTime: "min read",
    views: "views",
    outreachTitle: "Scientific Outreach",
    outreachDesc: "Follow our academic progress, research networks, and joint collaborations worldwide.",
    noNews: "No articles found matching your criteria.",
    editorial: "LDREAS Editorial"
  },
  ar: {
    featured: "خبر مميز",
    searchPlaceholder: "البحث في الأخبار بالكلمات الدلالية...",
    all: "كل الأخبار",
    breakthrough: "إنجازات علمية",
    event: "فعاليات وورش عمل",
    announcement: "إعلانات عامة",
    newsletterTitle: "النشرة البحثية",
    newsletterDesc: "اشترك معنا لتصلك آخر الإنجازات العلمية ومستجدات المخبر والفعاليات الأكاديمية مباشرة إلى بريدك الإلكتروني.",
    emailPlaceholder: "أدخل بريدك الإلكتروني...",
    subscribe: "اشتراك",
    thanks: "تم تأكيد اشتراككم بنجاح! شكراً لتواصلكم معنا.",
    readTime: "دقائق للقراءة",
    views: "مشاهدة",
    outreachTitle: "الترابط العلمي",
    outreachDesc: "تابع منشوراتنا، شبكاتنا الأكاديمية، والتعاون البحثي المشترك دولياً.",
    noNews: "لم يتم العثور على مقالات تطابق معايير البحث الخاصة بك.",
    editorial: "إدارة التحرير LDREAS"
  },
  fr: {
    featured: "À la Une",
    searchPlaceholder: "Rechercher des actualités...",
    all: "Toutes les actualités",
    breakthrough: "Découvertes",
    event: "Événements & Ateliers",
    announcement: "Annonces",
    newsletterTitle: "Bulletin de Recherche",
    newsletterDesc: "Abonnez-vous pour recevoir les dernières découvertes, les mises à jour du labo et les événements universitaires.",
    emailPlaceholder: "Entrez votre adresse e-mail...",
    subscribe: "S'abonner",
    thanks: "Inscription confirmée ! Merci de votre intérêt.",
    readTime: "min de lecture",
    views: "vues",
    outreachTitle: "Rayonnement Scientifique",
    outreachDesc: "Suivez nos progrès académiques, nos réseaux de recherche et nos collaborations internationales.",
    noNews: "Aucun article ne correspond à vos critères de recherche.",
    editorial: "Rédaction LDREAS"
  }
};

export default function News() {
  const { t, lang } = useTranslation();
  const [newsList, setNewsList] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    dbService.getNews(lang).then(data => setNewsList(data));
    dbService.getMembers().then(data => setMembers(data));
  }, [lang]);

  const ui = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : (lang === 'fr' ? 'fr-FR' : 'en-US'), {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  function calculateReadingTime(content) {
    if (!content) return 1;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 180));
  }

  function handleSubscribe(e) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  }

  // Filter logic
  const filteredNews = newsList.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured article: Most recent article overall (only display when category is 'all' and no active search)
  const isDefaultView = activeCategory === 'all' && searchQuery.trim() === '';
  const featuredItem = isDefaultView && filteredNews.length > 0 ? filteredNews[0] : null;
  
  // List of other items to display in grid
  const gridNews = featuredItem ? filteredNews.slice(1) : filteredNews;

  // Resolve author name helper
  function getAuthorName(authorId) {
    const author = members.find(m => m.id === authorId);
    return author ? author.full_name : ui.editorial;
  }

  return (
    <main id="main-content" className={styles.main}>
      <PageHero title={t('newsPageTitle')} subtitle={t('newsSubtitle')}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true"> / </span>
        <span>{t('navNews')}</span>
      </PageHero>

      <section className={styles.section}>
        <div className={styles.container}>
          {/* Featured Hero Article */}
          {featuredItem && (
            <div className={styles.featuredWrapper}>
              <h2 className={styles.sectionLabel}>{ui.featured}</h2>
              <article className={`${styles.featuredCard} flex-row-reverse-rtl`}>
                {featuredItem.photo_url && (
                  <div className={styles.featuredImageWrap}>
                    <img src={featuredItem.photo_url} alt="" className={styles.featuredImage} />
                    <div className={styles.featuredImageOverlay}></div>
                  </div>
                )}
                <div className={styles.featuredContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.categoryTag}>{featuredItem.category === 'breakthrough' ? ui.breakthrough : ui.event}</span>
                    <span className={styles.metaDivider}>•</span>
                    <span className={styles.date}>{formatDate(featuredItem.published_at || featuredItem.created_at)}</span>
                    <span className={styles.metaDivider}>•</span>
                    <span className={styles.readTime}>
                      {calculateReadingTime(featuredItem.content)} {ui.readTime}
                    </span>
                  </div>
                  
                  <h3 className={styles.featuredTitle}>
                    <Link to={`/news/${featuredItem.id}`}>{featuredItem.title}</Link>
                  </h3>
                  
                  <p className={styles.featuredExcerpt}>{featuredItem.description}</p>
                  
                  <div className={styles.featuredFooter}>
                    <div className={styles.authorBadge}>
                      <span className={styles.authorLabel}>{lang === 'ar' ? 'بواسطة' : (lang === 'fr' ? 'Par' : 'By')}</span>
                      <span className={styles.authorName}>{getAuthorName(featuredItem.author_id)}</span>
                    </div>
                    <Link to={`/news/${featuredItem.id}`} className={styles.featuredReadMore}>
                      {t('readMore')}
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* Dual Column Layout: Main Feed & Sidebar */}
          <div className={styles.layoutGrid}>
            {/* Main Content Area */}
            <div className={styles.feedColumn}>
              {/* Filter and Search Bar */}
              <div className={styles.controlsBar}>
                <div className={styles.categoryTabs}>
                  <button 
                    onClick={() => setActiveCategory('all')} 
                    className={`${styles.tabBtn} ${activeCategory === 'all' ? styles.tabActive : ''}`}
                  >
                    {ui.all}
                  </button>
                  <button 
                    onClick={() => setActiveCategory('breakthrough')} 
                    className={`${styles.tabBtn} ${activeCategory === 'breakthrough' ? styles.tabActive : ''}`}
                  >
                    {ui.breakthrough}
                  </button>
                  <button 
                    onClick={() => setActiveCategory('event')} 
                    className={`${styles.tabBtn} ${activeCategory === 'event' ? styles.tabActive : ''}`}
                  >
                    {ui.event}
                  </button>
                </div>

                <div className={styles.searchBox}>
                  <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input 
                    type="text" 
                    placeholder={ui.searchPlaceholder} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className={styles.searchClearBtn} aria-label="Clear search">
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Feed Grid */}
              {gridNews.length > 0 ? (
                <div className={styles.grid}>
                  {gridNews.map(item => (
                    <article key={item.id} className={styles.card}>
                      {item.photo_url && (
                        <div className={styles.imageWrap}>
                          <img src={item.photo_url} alt="" className={styles.image} loading="lazy" />
                          <span className={styles.cardCategoryBadge}>
                            {item.category === 'breakthrough' ? (lang === 'ar' ? 'إنجاز' : 'Breakthrough') : (lang === 'ar' ? 'فعالية' : 'Event')}
                          </span>
                        </div>
                      )}
                      <div className={styles.content}>
                        <div className={styles.cardMeta}>
                          <span className={styles.date}>{formatDate(item.published_at || item.created_at)}</span>
                          <span className={styles.metaDivider}>•</span>
                          <span className={styles.readTime}>
                            {calculateReadingTime(item.content)} {ui.readTime}
                          </span>
                        </div>

                        <h3 className={styles.title}>
                          <Link to={`/news/${item.id}`}>{item.title}</Link>
                        </h3>

                        <p className={styles.excerpt}>{item.description}</p>

                        <div className={styles.cardFooter}>
                          <span className={styles.cardAuthor}>{getAuthorName(item.author_id)}</span>
                          <Link to={`/news/${item.id}`} className={styles.readMoreBtn}>
                            {t('readMore')}
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.noResults}>
                  <svg className={styles.noResultsIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                  <p>{ui.noNews}</p>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <aside className={styles.sidebarColumn}>
              {/* Newsletter Widget */}
              <div className={styles.sidebarCard}>
                <div className={styles.newsletterIconWrap}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <h4 className={styles.sidebarTitle}>{ui.newsletterTitle}</h4>
                <p className={styles.sidebarDesc}>{ui.newsletterDesc}</p>
                
                {subscribed ? (
                  <div className={styles.subscriptionSuccess}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>{ui.thanks}</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                    <input 
                      type="email" 
                      required
                      placeholder={ui.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.newsletterInput}
                    />
                    <button type="submit" className={styles.newsletterBtn}>
                      {ui.subscribe}
                    </button>
                  </form>
                )}
              </div>

              {/* Research Outreach Widget */}
              <div className={styles.sidebarCard}>
                <h4 className={styles.sidebarTitle}>{ui.outreachTitle}</h4>
                <p className={styles.sidebarDesc}>{ui.outreachDesc}</p>
                
                <div className={styles.outreachLinks}>
                  <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className={styles.outreachLink}>
                    <span>Google Scholar</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                  <a href="https://www.researchgate.net" target="_blank" rel="noopener noreferrer" className={styles.outreachLink}>
                    <span>ResearchGate</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                  <a href="https://dgrsdt.dz" target="_blank" rel="noopener noreferrer" className={styles.outreachLink}>
                    <span>DGRSDT Portal</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
