import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { usePublications } from '../hooks/usePublications';
import { useTeams } from '../hooks/useTeams';
import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/Dialog';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';

export default function Publications() {
  const { t, lang } = useTranslation();
  const { publications, loading, getCitationText } = usePublications();
  const { teams, members } = useTeams();
  const [searchQuery, setSearchQuery] = useState('');

  // Advanced filters state
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  // UI states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeCitation, setActiveCitation] = useState(null);
  const [activeTab, setActiveTab] = useState('bibtex');
  const [copied, setCopied] = useState(false);

  const getAuthorName = (authorId) => {
    const member = members.find(m => m.id === authorId);
    return member ? member.full_name : '';
  };

  const getAuthorTeamId = (authorId) => {
    const member = members.find(m => m.id === authorId);
    return member ? member.team_id : '';
  };

  const toggleFilter = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  // Filter logic
  const filteredArticles = publications.filter(art => {
    const title = (art.name || '').toLowerCase();
    const primaryAuthor = getAuthorName(art.primary_author_id).toLowerCase();
    const coAuthorsStr = (art.coAuthors || []).join(' ').toLowerCase();
    const doiStr = (art.doi || '').toLowerCase();
    const keywordsStr = (art.keywords || []).join(' ').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesQuery =
      title.includes(query) ||
      primaryAuthor.includes(query) ||
      coAuthorsStr.includes(query) ||
      doiStr.includes(query) ||
      keywordsStr.includes(query);

    if (!matchesQuery) return false;

    if (selectedYears.length > 0 && art.published_at) {
      const year = new Date(art.published_at).getFullYear().toString();
      if (!selectedYears.includes(year)) return false;
    }

    if (selectedTypes.length > 0) {
      const type = art.article_type || 'journal';
      if (!selectedTypes.includes(type)) return false;
    }

    if (selectedAreas.length > 0) {
      const authorTeam = getAuthorTeamId(art.primary_author_id);
      if (!selectedAreas.includes(authorTeam)) return false;
    }

    return true;
  });

  // Sorting logic
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.published_at) - new Date(a.published_at);
    }
    if (sortBy === 'oldest') {
      return new Date(a.published_at) - new Date(b.published_at);
    }
    if (sortBy === 'citations') {
      return (b.citations_count || 0) - (a.citations_count || 0);
    }
    if (sortBy === 'title') {
      return (a.name || '').localeCompare(b.name || '');
    }
    return 0;
  });

  const handleCopyCitation = () => {
    const primaryName = getAuthorName(activeCitation?.primary_author_id) || 'LDERAS Researchers';
    const text = getCitationText(activeCitation, activeTab, primaryName);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main id="main-content">
      <PageHero title={t('publicationsTitle')} subtitle={lang === 'ar' ? 'تصفح المستودع العلمي وأبحاث المختبر الأكاديمية المعتمدة' : (lang === 'fr' ? 'Explorez les travaux et publications de notre laboratoire' : 'Explore the repository of peer-reviewed articles and research papers')}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <span>{t('navPublications')}</span>
      </PageHero>

      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start flex-row-reverse-rtl">
            
            {/* Sidebar Filters */}
            <aside className={`space-y-6 lg:block ${showMobileFilters ? 'block bg-secondary/30 p-4' : 'hidden'}`}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2">
                {lang === 'ar' ? 'تصفية النتائج' : (lang === 'fr' ? 'Filtres' : 'Filter Results')}
              </h2>

              {/* Year Filter */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{lang === 'ar' ? 'السنة' : 'Year'}</h3>
                <div className="flex flex-col gap-1.5 text-sm">
                  {['2026', '2025', '2024'].map(year => (
                    <label key={year} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                        checked={selectedYears.includes(year)}
                        onChange={() => toggleFilter(year, selectedYears, setSelectedYears)}
                      />
                      <span className="text-muted-foreground hover:text-foreground transition-colors">{year}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Article Type Filter */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{lang === 'ar' ? 'نوع المنشور' : 'Publication Type'}</h3>
                <div className="flex flex-col gap-1.5 text-sm">
                  {[
                    { value: 'journal', label: lang === 'ar' ? 'مقال مجلة' : 'Journal Article' },
                    { value: 'conference', label: lang === 'ar' ? 'مقال مؤتمر' : 'Conference Paper' }
                  ].map(type => (
                    <label key={type.value} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() => toggleFilter(type.value, selectedTypes, setSelectedTypes)}
                      />
                      <span className="text-muted-foreground hover:text-foreground transition-colors">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Research Area Filter */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{lang === 'ar' ? 'الفرقة البحثية' : 'Research Team'}</h3>
                <div className="flex flex-col gap-1.5 text-sm">
                  {teams.map(team => (
                    <label key={team.id} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                        checked={selectedAreas.includes(team.id)}
                        onChange={() => toggleFilter(team.id, selectedAreas, setSelectedAreas)}
                      />
                      <span className="text-muted-foreground hover:text-foreground transition-colors">{team.acronym}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {(selectedYears.length > 0 || selectedTypes.length > 0 || selectedAreas.length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold"
                  onClick={() => {
                    setSelectedYears([]);
                    setSelectedTypes([]);
                    setSelectedAreas([]);
                  }}
                >
                  {lang === 'ar' ? 'إعادة تعيين الفلاتر' : 'Clear Filters'}
                </Button>
              )}
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Search Bar & Mobile toggle / Sorting select */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full md:w-auto md:flex-1">
                  <Button
                    variant="outline"
                    className="lg:hidden shrink-0 text-xs font-semibold"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                  >
                    Filters
                  </Button>
                  <input
                    type="text"
                    className="border border-border bg-background px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder={lang === 'ar' ? 'البحث عن عنوان، مؤلف، كلمة مفتاحية أو معرف DOI...' : 'Search by title, author, keyword or DOI...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-border bg-background p-2 text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none shrink-0 cursor-pointer"
                  aria-label="Sort publications"
                >
                  <option value="newest">{lang === 'ar' ? 'الأحدث أولاً' : 'Newest First'}</option>
                  <option value="oldest">{lang === 'ar' ? 'الأقدم أولاً' : 'Oldest First'}</option>
                  <option value="citations">{lang === 'ar' ? 'الأعلى اقتباساً' : 'Most Cited'}</option>
                  <option value="title">{lang === 'ar' ? 'الترتيب الأبجدي' : 'Alphabetical'}</option>
                </select>
              </div>

              {/* Publications list */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent" />
                </div>
              ) : sortedArticles.length > 0 ? (
                <div className="divide-y divide-border border-y border-border">
                  {sortedArticles.map((art) => {
                    const primaryName = getAuthorName(art.primary_author_id) || 'LDERAS';
                    const secondAuthor = art.coAuthors && art.coAuthors[0];
                    const authorsText = secondAuthor ? `${primaryName}, ${secondAuthor}` : primaryName;

                    return (
                      <article key={art.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-row-reverse-rtl">
                        <div className="space-y-1.5 flex-1 text-start">
                          <h3 className="text-sm font-bold text-foreground font-serif leading-snug">
                            {art.journal_link ? (
                              <a href={art.journal_link} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">
                                {art.name}
                              </a>
                            ) : (
                              art.name
                            )}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">{authorsText}</span>
                          </p>
                        </div>
                        {art.journal_link && (
                          <div className="flex items-center shrink-0">
                            <Button variant="outline" size="sm" asChild>
                              <a href={art.journal_link} target="_blank" rel="noopener noreferrer">
                                {lang === 'ar' ? 'رابط المجلة' : (lang === 'fr' ? 'Lien de la revue' : 'Journal Link')}
                              </a>
                            </Button>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground text-sm border border-dashed border-border">
                  {t('noPublications')}
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* Citation Export Modal utilizing shadcn Dialog */}
      {activeCitation && (
        <Dialog open={!!activeCitation} onOpenChange={() => setActiveCitation(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-serif font-bold text-foreground">
                {lang === 'ar' ? 'تصدير مرجع البحث' : 'Export Citation Reference'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setCopied(false); }}>
                <TabsList className="w-full justify-start border-b border-border mb-3 bg-transparent p-0 h-auto">
                  {['bibtex', 'ris', 'apa', 'chicago'].map(tab => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-wider"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="mt-4">
                  <pre className="bg-secondary p-4 text-xs font-mono overflow-x-auto border border-border max-h-48 whitespace-pre-wrap leading-relaxed">
                    {getCitationText(
                      activeCitation,
                      activeTab,
                      getAuthorName(activeCitation?.primary_author_id) || 'LDERAS Researchers'
                    )}
                  </pre>
                </div>
              </Tabs>

              <div className="flex justify-end gap-2 pt-2 border-t border-border mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveCitation(null)}
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </Button>
                <Button
                  size="sm"
                  onClick={handleCopyCitation}
                >
                  {copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ للمحفظة' : 'Copy to Clipboard')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
