import { useTranslation } from '../hooks/useTranslation';
import { useTeams } from '../hooks/useTeams';
import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function TeamsList() {
  const { t, lang } = useTranslation();
  const { teams, members, loading } = useTeams();

  const getLeaderName = (leaderId) => {
    const leader = members.find(m => m.id === leaderId);
    return leader ? leader.full_name : '';
  };

  const getMemberCount = (teamId) => {
    return members.filter(m => m.team_id === teamId).length;
  };

  return (
    <main id="main-content">
      <PageHero title={t('projectsTitle')} subtitle={t('projectsSubtitle')}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <span>{t('navTeam')}</span>
      </PageHero>

      {/* Grid List */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-row-reverse-rtl">
              {teams.map(team => (
                <Card key={team.id} className="flex flex-col h-full hover:border-primary/50 transition-colors duration-150 shadow-none">
                  <CardHeader className="flex-1 pb-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-primary tracking-wider uppercase">
                        {team.acronym}
                      </span>
                      <Badge variant="secondary" className="text-[10px] py-0.5 px-2">
                        {getMemberCount(team.id)} {lang === 'ar' ? 'أعضاء' : (lang === 'fr' ? 'membres' : 'members')}
                      </Badge>
                    </div>

                    <CardTitle className="text-lg font-serif font-bold leading-snug">
                      <Link to={`/teams/${team.id}`} className="hover:text-primary transition-colors">
                        {team.name}
                      </Link>
                    </CardTitle>

                    <CardDescription className="text-xs mt-3 leading-relaxed text-muted-foreground line-clamp-4">
                      {team.description}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="pt-0 flex flex-col items-start gap-4 border-t border-border/45 p-6">
                    {team.team_leader_id && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">{lang === 'ar' ? 'رئيس فرقة البحث' : (lang === 'fr' ? 'Chef d\'équipe' : 'Team Leader')}: </span>
                        <Link to={`/members/${team.team_leader_id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                          {getLeaderName(team.team_leader_id)}
                        </Link>
                      </div>
                    )}

                    <Link to={`/teams/${team.id}`} className="text-xs font-semibold text-primary hover:underline">
                      {lang === 'ar' ? 'عرض الفريق ←' : (lang === 'fr' ? 'Voir l\'équipe →' : 'View team →')}
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
