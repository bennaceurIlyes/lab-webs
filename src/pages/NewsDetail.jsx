import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useNews } from '../hooks/useNews';
import { useTeams } from '../hooks/useTeams';
import { usePublications } from '../hooks/usePublications';
import PageHero from '../components/layout/PageHero';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Separator } from '../components/ui/Separator';
import { Link2, Twitter, Linkedin, Eye } from 'lucide-react';

export default function NewsDetail() {
  const { id } = useParams();
  const { t, lang } = useTranslation();
  const { getNewsById } = useNews();
  const { getMemberById } = useTeams();
  const { publications } = usePublications();

  const [newsItem, setNewsItem] = useState(null);
  const [author, setAuthor] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interactive UI state
  const [scrollPercent, setScrollPercent] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    getNewsById(id)
      .then(data => {
        if (!data) {
          setLoading(false);
          return;
        }
        setNewsItem(data);
        if (data.author_id) {
          getMemberById(data.author_id).then(member => setAuthor(member));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, lang, getNewsById, getMemberById]);

  // Fetch related publications based on keyword matching or default to recent ones
  useEffect(() => {
    if (newsItem && publications.length > 0) {
      // Simple keyword filter matching
      const matched = publications.filter(art =>
        art.keywords?.some(kw =>
          newsItem.title?.toLowerCase().includes(kw.toLowerCase()) ||
          newsItem.content?.toLowerCase().includes(kw.toLowerCase())
        )
      );
      // Fallback to recent articles if no keyword overlaps
      setRelatedArticles(matched.length > 0 ? matched.slice(0, 2) : publications.slice(0, 2));
    }
  }, [newsItem, publications]);

  // Reading scroll progress indicator hook
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(newsItem?.title || '');

  if (loading) {
    return (
      <main className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (!newsItem) {
    return (
      <main className="container-custom py-12">
        <div className="max-w-md mx-auto border border-border p-6 bg-card text-center space-y-4">
          <h2 className="text-lg font-serif font-bold">{lang === 'fr' ? 'Actualité non trouvée' : 'News item not found'}</h2>
          <Link to="/news" className="inline-block text-xs font-semibold text-primary hover:underline">
            {lang === 'fr' ? '← Retour aux actualités' : '← Back to News'}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      {/* Scroll Progress Bar Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-secondary">
        <div className="h-full bg-primary transition-all duration-75" style={{ width: `${scrollPercent}%` }} />
      </div>

      <PageHero title={newsItem.title}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <Link to="/news">{t('navNews')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <span>{lang === 'fr' ? 'Détails' : 'Detail'}</span>
      </PageHero>

      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start flex-row-reverse-rtl">
            
            {/* Article Column */}
            <article className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-row-reverse-rtl">
                <Badge variant="outline" className="text-[10px] font-semibold">
                  {newsItem.category === 'breakthrough' ? 'Breakthrough' : 'Event'}
                </Badge>
                <span>{formatDate(newsItem.published_at || newsItem.created_at)}</span>
                {newsItem.view_count && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {newsItem.view_count} {lang === 'fr' ? 'vues' : 'views'}
                    </span>
                  </>
                )}
              </div>

              {newsItem.photo_url && (
                <div className="h-64 md:h-96 w-full overflow-hidden border border-border">
                  <img src={newsItem.photo_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-6">
                <p className="text-base font-serif italic text-muted-foreground leading-relaxed">
                  {newsItem.description}
                </p>

                <div
                  className="text-sm text-foreground leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{
                    __html: newsItem.content.replace(/\n/g, '<br /><br />')
                  }}
                />
              </div>

              {/* Author Biography Section */}
              {author && (
                <Card className="p-6 bg-secondary/15 flex flex-col sm:flex-row gap-4 items-start border-border shadow-none">
                  {author.photo_url && (
                    <img src={author.photo_url} alt={author.full_name} className="h-16 w-16 object-cover border border-border shrink-0" />
                  )}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 flex-row-reverse-rtl">
                      <div>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                          {lang === 'fr' ? 'Rédigé par' : 'Written by'}
                        </span>
                        <h4 className="font-bold text-sm text-foreground hover:text-primary transition-colors">
                          <Link to={`/members/${author.id}`}>{author.full_name}</Link>
                        </h4>
                      </div>
                      <span className="text-xs text-muted-foreground font-semibold">{author.grade} • {author.specialty}</span>
                    </div>
                    {author.bio && <p className="text-xs text-muted-foreground leading-relaxed">{author.bio}</p>}
                  </div>
                </Card>
              )}

              <div className="pt-6">
                <Link to="/news" className="text-xs font-semibold text-primary hover:underline">
                  {lang === 'fr' ? '← Retour aux actualités' : '← Back to News'}
                </Link>
              </div>
            </article>

            {/* Sidebar Column: Sharing & Related Research */}
            <aside className="space-y-6 w-full">
              
              {/* Sharing widget */}
              <Card className="p-6 shadow-none border-border">
                <h4 className="font-serif font-bold text-sm text-foreground border-b border-border pb-2 mb-4">
                  {lang === 'fr' ? 'Partager l\'article' : 'Share Article'}
                </h4>
                <div className="space-y-2 text-xs">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="w-full justify-start gap-2.5 font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <Link2 className="h-4 w-4" />
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </Button>

                  <Button variant="outline" size="sm" asChild className="w-full justify-start gap-2.5 font-semibold text-muted-foreground hover:text-foreground">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="h-4 w-4 text-sky-500" />
                      <span>Twitter / X</span>
                    </a>
                  </Button>

                  <Button variant="outline" size="sm" asChild className="w-full justify-start gap-2.5 font-semibold text-muted-foreground hover:text-foreground">
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      <span>LinkedIn</span>
                    </a>
                  </Button>
                </div>
              </Card>

              {/* Related Publications widget */}
              {relatedArticles.length > 0 && (
                <Card className="p-6 shadow-none border-border">
                  <h4 className="font-serif font-bold text-sm text-foreground border-b border-border pb-2 mb-4">
                    {lang === 'fr' ? 'Publications associées' : 'Related Research'}
                  </h4>
                  <div className="space-y-4">
                    {relatedArticles.map(art => (
                      <div key={art.id} className="space-y-1.5">
                        <Badge variant="outline" className="text-[9px] font-semibold tracking-wider uppercase">
                          {art.article_type === 'journal' ? 'Journal' : 'Conference'}
                        </Badge>
                        <h5 className="font-serif font-bold text-xs text-foreground hover:text-primary transition-colors leading-snug">
                          <Link to={`/articles/${art.id}`}>{art.name}</Link>
                        </h5>
                        {art.doi && <span className="text-[10px] text-muted-foreground block">DOI: {art.doi}</span>}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}
