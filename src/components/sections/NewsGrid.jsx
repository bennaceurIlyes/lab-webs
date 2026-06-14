import { useTranslation } from '../../hooks/useTranslation';
import { useNews } from '../../hooks/useNews';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';

export default function NewsGrid() {
  const { t, lang } = useTranslation();
  const { news } = useNews();

  // Top 3 news for homepage
  const newsItems = news.slice(0, 3);

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : (lang === 'fr' ? 'fr-FR' : 'en-US'), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className="flex flex-col gap-6 w-full md:col-span-2">
      {newsItems.map((item) => (
        <Card key={item.id} className="flex flex-col md:flex-row gap-4 overflow-hidden border-border bg-card hover:border-primary/50 transition-colors duration-150">
          {item.photo_url && (
            <div className="md:w-1/3 h-48 md:h-auto relative shrink-0">
              <img
                src={item.photo_url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-row-reverse-rtl">
                <Badge variant="secondary" className="text-[10px]">
                  {lang === 'ar' ? 'مستجدات' : (lang === 'fr' ? 'Actualité' : 'News')}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatDate(item.published_at || item.created_at)}</span>
              </div>
              <h3 className="text-base font-bold font-serif text-foreground leading-snug mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                {item.description}
              </p>
            </div>
            <div>
              <Link to={`/news/${item.id}`} className="text-xs font-semibold text-primary hover:underline">
                {t('readMore')}
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
