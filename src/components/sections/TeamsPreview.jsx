import { useTranslation } from '../../hooks/useTranslation';
import { useTeams } from '../../hooks/useTeams';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card';

export default function TeamsPreview() {
  const { lang } = useTranslation();
  const { teams } = useTeams();

  const sectionTitle = lang === 'ar'
    ? 'مجالات البحث'
    : (lang === 'fr' ? 'Axes de Recherche' : 'Research Areas');

  const sectionSubtitle = lang === 'ar'
    ? 'الفرق العلمية TER، PVES و WEAS'
    : (lang === 'fr'
      ? 'Équipes de recherche TER, PVES et WEAS'
      : 'TER, PVES and WEAS research teams');

  return (
    <section className="py-16 bg-background border-b border-border" aria-label={sectionTitle}>
      <div className="container-custom">
        <SectionTitle title={sectionTitle} subtitle={sectionSubtitle} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-row-reverse-rtl">
          {teams.map((team) => (
            <Card key={team.id} className="flex flex-col h-full bg-background border border-border p-6 hover:border-primary transition-colors duration-150 rounded-none">
              <div className="flex-1 space-y-3">
                <span className="text-xs font-bold text-primary tracking-widest uppercase block">
                  {team.acronym}
                </span>
                <h3 className="text-base font-serif font-bold leading-snug text-foreground">
                  {team.name}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-4">
                  {team.description}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/60">
                <Link
                  to={`/teams/${team.id}`}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {lang === 'ar' ? 'عرض الفريق ←' : (lang === 'fr' ? "Voir l'équipe →" : 'View team →')}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
