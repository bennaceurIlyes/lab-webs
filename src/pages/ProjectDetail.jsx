import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useTeams } from '../hooks/useTeams';
import PageHero from '../components/layout/PageHero';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Separator } from '../components/ui/Separator';
import { Calendar, Mail, Users } from 'lucide-react';

const STATE = {
  ongoing: { en: 'Ongoing', fr: 'En cours', variant: 'default' },
  completed: { en: 'Completed', fr: 'Terminé', variant: 'secondary' },
  planned: { en: 'Planned', fr: 'Planifié', variant: 'outline' },
};

function StateBadge({ state, lang }) {
  const s = STATE[state] ?? STATE.planned;
  const lbl = lang === 'fr' ? s.fr : s.en;
  return <Badge variant={s.variant}>{lbl}</Badge>;
}

function fmtDate(str, lang) {
  if (!str) return '';
  return new Date(str).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { t, lang } = useTranslation();
  const { getProjectById, getMembersByTeam, getTeamById } = useTeams();

  const [project, setProject] = useState(null);
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProjectById(id)
      .then(projData => {
        if (!projData) {
          setLoading(false);
          return;
        }
        setProject(projData);

        const fetchTeamInfo = projData.team_id
          ? getTeamById(projData.team_id)
          : Promise.resolve(null);

        const fetchMembersInfo = projData.member_ids && projData.member_ids.length > 0
          ? getMembersByTeam(projData.team_id).then(teamM => teamM.filter(m => projData.member_ids.includes(m.id)))
          : (projData.team_id ? getMembersByTeam(projData.team_id) : Promise.resolve([]));

        return Promise.all([fetchTeamInfo, fetchMembersInfo]).then(([teamData, membersData]) => {
          setTeam(teamData);
          setMembers(membersData);
          setLoading(false);
        });
      })
      .catch(err => {
        console.error("Error loading project detail", err);
        setLoading(false);
      });
  }, [id, lang, getProjectById, getTeamById, getMembersByTeam]);

  if (loading) {
    return (
      <main className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="container-custom py-12">
        <div className="max-w-md mx-auto border border-border p-6 bg-card text-center space-y-4">
          <h2 className="text-lg font-serif font-bold">
            {lang === 'fr' ? 'Projet non trouvé' : 'Project not found'}
          </h2>
          <Link to="/teams" className="inline-block text-xs font-semibold text-primary hover:underline">
            {lang === 'fr' ? '← Retour aux équipes' : '← Back to Teams'}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <PageHero title={project.name}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <Link to="/teams">{t('navTeamsProjects')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <span>{lang === 'fr' ? 'Détails du projet' : 'Project Details'}</span>
      </PageHero>

      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-row-reverse-rtl text-start">
            
            {/* Left: Project Details & Timeline */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <StateBadge state={project.state} lang={lang} />
                  {team && (
                    <Badge variant="outline" className="font-semibold">
                      {team.acronym}
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground leading-tight">
                  {project.name}
                </h2>
                {project.photo_url && (
                  <div className="aspect-video w-full overflow-hidden border border-border bg-muted my-4">
                    <img src={project.photo_url} alt="" className="w-full h-full object-cover animate-fade-in" />
                  </div>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                  {project.description}
                </p>
              </div>

              <Separator />

              {/* Timeline Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {lang === 'fr' ? 'Calendrier du projet' : 'Project Timeline'}
                </h3>
                
                {/* Visual Timeline progress bar */}
                <div className="bg-secondary/20 p-6 border border-border space-y-4">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground flex-row-reverse-rtl">
                    <div>
                      <span className="block text-[10px] uppercase text-muted-foreground/60">
                        {lang === 'fr' ? 'Date de début' : 'Start Date'}
                      </span>
                      <span className="text-foreground">{fmtDate(project.started_at, lang)}</span>
                    </div>
                    <div className="text-end">
                      <span className="block text-[10px] uppercase text-muted-foreground/60">
                        {lang === 'fr' ? 'Date de fin prévue' : 'Expected End'}
                      </span>
                      <span className="text-foreground">
                        {project.expected_end_date ? fmtDate(project.expected_end_date, lang) : 'Ongoing'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="relative w-full h-2 bg-secondary/80 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${project.state === 'completed' ? 'bg-secondary' : 'bg-primary'}`} 
                      style={{ width: project.state === 'completed' ? '100%' : project.state === 'ongoing' ? '50%' : '5%' }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Project Team Members */}
            <div className="space-y-6">
              <div className="border border-border p-6 bg-card/50 space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  {lang === 'fr' ? 'Membres du projet' : 'Project Researchers'}
                </h3>
                
                {team && (
                  <div className="space-y-1.5 border-b border-border pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 block">
                      {lang === 'fr' ? 'Équipe de recherche' : 'Research Team'}
                    </span>
                    <Link to={`/teams/${team.id}`} className="font-serif font-bold text-sm text-foreground hover:text-primary transition-colors block">
                      {team.name} ({team.acronym})
                    </Link>
                  </div>
                )}

                <div className="space-y-4">
                  {members.map(m => {
                    const initials = m.full_name.split(' ').slice(-1)[0]?.[0] || 'U';
                    return (
                      <div key={m.id} className="flex gap-3 items-center flex-row-reverse-rtl">
                        <div className="h-9 w-9 bg-secondary/80 flex items-center justify-center text-xs font-bold font-serif text-muted-foreground select-none shrink-0 rounded-full">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link to={`/members/${m.id}`} className="text-xs font-bold text-foreground hover:text-primary transition-colors block truncate">
                            {m.full_name}
                          </Link>
                          <span className="text-[10px] text-muted-foreground block truncate">
                            {m.grade} — {m.specialty}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          <div className="pt-10">
            {team ? (
              <Link to={`/teams/${team.id}`} className="text-xs font-semibold text-primary hover:underline">
                {lang === 'fr' ? `← Retour à l'équipe ${team.acronym}` : `← Back to Team ${team.acronym}`}
              </Link>
            ) : (
              <Link to="/teams" className="text-xs font-semibold text-primary hover:underline">
                {lang === 'fr' ? '← Retour aux équipes' : '← Back to Teams'}
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
