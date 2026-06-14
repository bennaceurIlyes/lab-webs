import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useNews } from '../hooks/useNews';
import { useTeams } from '../hooks/useTeams';
import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Search, Mail, Check, ExternalLink } from 'lucide-react';

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
  const { news, loading } = useNews();
  const { members } = useTeams();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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
  const filteredNews = news.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isDefaultView = activeCategory === 'all' && searchQuery.trim() === '';
  const featuredItem = isDefaultView && filteredNews.length > 0 ? filteredNews[0] : null;
  const gridNews = featuredItem ? filteredNews.slice(1) : filteredNews;

  function getAuthorName(authorId) {
    const author = members.find(m => m.id === authorId);
    return author ? author.full_name : ui.editorial;
  }

  return (
    <main id="main-content">
      <PageHero title={t('newsPageTitle')} subtitle={t('newsSubtitle')}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <span>{t('navNews')}</span>
      </PageHero>

      <section className="py-16 bg-background">
        <div className="container-custom space-y-12">
          
          {/* Featured Hero Article */}
          {featuredItem && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary">{ui.featured}</h2>
              <Card className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden border-border bg-card shadow-none flex-row-reverse-rtl">
                {featuredItem.photo_url && (
                  <div className="h-64 lg:h-auto overflow-hidden relative shrink-0">
                    <img src={featuredItem.photo_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground flex-row-reverse-rtl">
                      <Badge className="text-[10px] font-semibold">
                        {featuredItem.category === 'breakthrough' ? ui.breakthrough : ui.event}
                      </Badge>
                      <span>{formatDate(featuredItem.published_at || featuredItem.created_at)}</span>
                      <span>•</span>
                      <span>{calculateReadingTime(featuredItem.content)} {ui.readTime}</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold font-serif text-foreground hover:text-primary transition-colors leading-tight mb-4">
                      <Link to={`/news/${featuredItem.id}`}>{featuredItem.title}</Link>
                    </h3>

                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {featuredItem.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4 flex-row-reverse-rtl">
                    <div className="text-xs">
                      <span className="text-muted-foreground">{lang === 'ar' ? 'بواسطة' : (lang === 'fr' ? 'Par' : 'By')}{" "}</span>
                      <span className="font-semibold text-foreground">{getAuthorName(featuredItem.author_id)}</span>
                    </div>
                    <Link to={`/news/${featuredItem.id}`} className="text-xs font-semibold text-primary hover:underline">
                      {t('readMore')}
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Grid list and Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start flex-row-reverse-rtl">
            {/* Feed Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Category Filter Tabs and Search */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-border pb-4">
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
                  <TabsList className="bg-transparent p-0 h-auto gap-2">
                    <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">{ui.all}</TabsTrigger>
                    <TabsTrigger value="breakthrough" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">{ui.breakthrough}</TabsTrigger>
                    <TabsTrigger value="event" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">{ui.event}</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="relative w-full md:w-64">
                  <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder={ui.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-border bg-background pl-9 pr-8 py-1.5 text-xs w-full focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground text-xs" aria-label="Clear search">
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Feed Grid of cards */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent" />
                </div>
              ) : gridNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-row-reverse-rtl">
                  {gridNews.map(item => (
                    <Card key={item.id} className="flex flex-col h-full hover:border-primary/50 transition-colors duration-150 overflow-hidden shadow-none">
                      {item.photo_url && (
                        <div className="h-48 overflow-hidden relative shrink-0">
                          <img src={item.photo_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2 text-[10px] text-muted-foreground flex-row-reverse-rtl">
                            <Badge variant="secondary" className="text-[9px] font-semibold py-0.5">
                              {item.category === 'breakthrough' ? (lang === 'ar' ? 'إنجاز' : 'Breakthrough') : (lang === 'ar' ? 'فعالية' : 'Event')}
                            </Badge>
                            <span>{formatDate(item.published_at || item.created_at)}</span>
                            <span>•</span>
                            <span>{calculateReadingTime(item.content)} {ui.readTime}</span>
                          </div>

                          <h4 className="font-serif font-bold text-sm text-foreground hover:text-primary transition-colors leading-snug line-clamp-2">
                            <Link to={`/news/${item.id}`}>{item.title}</Link>
                          </h4>

                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mt-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-border pt-3 text-[10px] flex-row-reverse-rtl">
                          <span className="text-muted-foreground font-medium">{getAuthorName(item.author_id)}</span>
                          <Link to={`/news/${item.id}`} className="font-semibold text-primary hover:underline">
                            {t('readMore')}
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground text-sm border border-dashed border-border">
                  {ui.noNews}
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <aside className="space-y-6 w-full">
              
              {/* Newsletter card */}
              <Card className="p-6 bg-secondary/20 shadow-none border-border">
                <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center mb-4 rounded-none">
                  <Mail className="h-5 w-5" />
                </div>
                <h4 className="font-serif font-bold text-sm text-foreground mb-1">{ui.newsletterTitle}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{ui.newsletterDesc}</p>

                {subscribed ? (
                  <div className="flex items-center gap-2 p-2.5 bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>{ui.thanks}</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-2">
                    <input
                      type="email"
                      required
                      placeholder={ui.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-border bg-background px-3 py-1.5 text-xs w-full focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <Button type="submit" size="sm" className="w-full text-xs font-semibold">
                      {ui.subscribe}
                    </Button>
                  </form>
                )}
              </Card>

              {/* Outreach links */}
              <Card className="p-6 shadow-none border-border">
                <h4 className="font-serif font-bold text-sm text-foreground mb-1">{ui.outreachTitle}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{ui.outreachDesc}</p>
                <div className="divide-y divide-border border-y border-border text-xs">
                  {[
                    { label: "Google Scholar", url: "https://scholar.google.com" },
                    { label: "ResearchGate", url: "https://www.researchgate.net" },
                    { label: "DGRSDT Portal", url: "https://dgrsdt.dz" }
                  ].map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 flex justify-between items-center text-muted-foreground hover:text-primary transition-colors font-medium flex-row-reverse-rtl"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </Card>
            </aside>
          </div>

        </div>
      </section>
    </main>
  );
}
