import { useTranslation } from '../../hooks/useTranslation';
import { usePublications } from '../../hooks/usePublications';
import { useTeams } from '../../hooks/useTeams';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';

export default function PublicationsList() {
  const { t, lang } = useTranslation();
  const { publications } = usePublications();
  const { members } = useTeams();

  // Show top 3 recent publications on homepage
  const recentPublications = publications.slice(0, 3);

  const getAuthorName = (authorId) => {
    const member = members.find(m => m.id === authorId);
    return member ? member.full_name : '';
  };

  return (
    <section className="py-16 bg-background border-b border-border" aria-label={t('latestArticles')}>
      <div className="container-custom">
        <SectionTitle
          title={t('latestArticles')}
          rightLink="/publications"
          rightLinkText={t('pubViewHal') || 'View All Publications →'}
        />
        <div className="divide-y divide-border border-y border-border">
          {recentPublications.map((pub) => {
            const primaryName = getAuthorName(pub.primary_author_id) || 'Lab Researchers';
            const secondAuthor = pub.coAuthors && pub.coAuthors[0];
            const authorsText = secondAuthor ? `${primaryName}, ${secondAuthor}` : primaryName;

            return (
              <div
                key={pub.id}
                className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-row-reverse-rtl hover:bg-secondary/20 transition-colors px-2"
              >
                {/* Reference style layout */}
                <div className="flex-1 space-y-1 text-start">
                  <h3 className="text-sm font-serif font-bold text-foreground block">
                    {pub.journal_link ? (
                      <a href={pub.journal_link} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">
                        {pub.name}
                      </a>
                    ) : (
                      pub.name
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">{authorsText}</span>
                  </p>
                </div>

                {/* Actions/PDF link */}
                {pub.journal_link && (
                  <div className="flex items-center shrink-0">
                    <a href={pub.journal_link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:underline">
                      {lang === 'fr' ? 'Lien de la revue' : 'Journal Link'}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
