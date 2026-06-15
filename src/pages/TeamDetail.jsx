import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useTeams } from '../hooks/useTeams';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Separator } from '../components/ui/Separator';
import { Calendar, Mail, Users, FlaskConical, ArrowRight } from 'lucide-react';

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

function initials(name = '') {
  const c = name.replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.)\s+/i, '');
  const p = c.trim().split(/\s+/);
  return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase();
}

function fmtDate(str, lang) {
  if (!str) return '';
  return new Date(str).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'short' }
  );
}

function MemberCard({ member, lang, isLeader = false }) {
  const init = initials(member.full_name);
  return (
    <Card className={`hover:border-primary/50 transition-colors duration-150 flex flex-col justify-between shadow-none ${isLeader ? 'border-primary/40' : ''}`}>
      <CardHeader className="p-5 pb-3">
        <div className="flex gap-4 items-start flex-row-reverse-rtl">
          {member.photo_url ? (
            <img src={member.photo_url} alt={member.full_name} className="h-14 w-14 object-cover border border-border shrink-0" />
          ) : (
            <div className="h-14 w-14 bg-secondary flex items-center justify-center text-sm font-bold font-serif text-muted-foreground shrink-0 select-none">
              {init}
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap flex-row-reverse-rtl">
              {isLeader && (
                <Badge variant="default" className="text-[9px] px-1 py-0 font-semibold leading-none">
                  {lang === 'fr' ? 'Chef' : 'Leader'}
                </Badge>
              )}
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{member.grade} ({member.degree})</span>
            </div>
            <CardTitle className="text-sm font-bold font-serif text-foreground hover:text-primary transition-colors">
              <Link to={`/members/${member.id}`}>{member.full_name}</Link>
            </CardTitle>
            <p className="text-xs font-medium text-muted-foreground leading-normal">{member.specialty}</p>
          </div>
        </div>
      </CardHeader>

      <CardDescription className="text-xs px-5 pb-4 leading-relaxed line-clamp-3 text-muted-foreground">
        {member.bio}
      </CardDescription>

      <CardFooter className="pt-3 px-5 pb-5 border-t border-border/40 flex items-center justify-between gap-4 text-xs flex-row-reverse-rtl w-full">
        <div className="flex gap-2.5 items-center">
          <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors" title={`Email ${member.full_name}`}>
            <Mail className="h-4 w-4" />
          </a>
          {member.orcid && (
            <a href={`https://orcid.org/${member.orcid}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:text-primary transition-colors font-semibold" title="ORCID">
              ORCID
            </a>
          )}
          {member.google_scholar_url && (
            <a href={member.google_scholar_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:text-primary transition-colors font-semibold" title="Google Scholar">
              Scholar
            </a>
          )}
        </div>
        <Link to={`/members/${member.id}`} className="text-primary font-semibold hover:underline flex items-center gap-1 shrink-0">
          <span>{lang === 'fr' ? 'Profil' : 'Profile'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function TeamDetail() {
  const { id } = useParams();
  const { t, lang } = useTranslation();
  const { getTeamById, getMembersByTeam, getProjectsByTeam } = useTeams();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTeamById(id)
      .then(td => {
        if (!td) {
          setLoading(false);
          return;
        }
        setTeam(td);
        return Promise.all([
          getMembersByTeam(id),
          getProjectsByTeam(id),
        ]).then(([m, p]) => {
          setMembers(m);
          setProjects(p);
          setLoading(false);
        });
      })
      .catch(() => setLoading(false));
  }, [id, lang, getTeamById, getMembersByTeam, getProjectsByTeam]);

  const leader = members.find(m => m.id === team?.team_leader_id) || members.find(m => m.role === 'team_leader');
  const regular = members.filter(m => m.id !== leader?.id);

  if (loading) {
    return (
      <main className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (!team) {
    return (
      <main className="container-custom py-12">
        <div className="max-w-md mx-auto border border-border p-6 bg-card text-center space-y-4">
          <h2 className="text-lg font-serif font-bold">{lang === 'fr' ? 'Équipe introuvable' : 'Team not found'}</h2>
          <Link to="/teams" className="inline-block text-xs font-semibold text-primary hover:underline">
            ← Back
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      {/* Page Header */}
      <section className="bg-background border-b border-border py-12 md:py-16">
        <div className="container-custom">
          <nav className="text-xs uppercase tracking-wider text-primary font-semibold mb-4" aria-label="Breadcrumb">
            <Link to="/">{t('navHome')}</Link>
            <span className="mx-1 select-none text-foreground/40">/</span>
            <Link to="/teams">{t('navTeam') || 'Teams'}</Link>
            <span className="mx-1 select-none text-foreground/40">/</span>
            <span className="text-foreground/70">{team.acronym}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 flex-row-reverse-rtl">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs font-bold text-primary tracking-wider uppercase block">
                {lang === 'fr' ? 'Équipe de Recherche' : 'Research Team'}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-foreground tracking-tight leading-tight">
                {team.name}
              </h1>
              <p className="text-foreground/80 text-sm md:text-base leading-relaxed">{team.description}</p>
            </div>

            {/* Quick Metrics */}
            <div className="border border-border p-6 bg-card flex items-center justify-around gap-6 w-full lg:w-auto shrink-0 flex-row-reverse-rtl">
              <div className="text-center px-4 flex-1">
                <span className="block text-2xl font-bold font-serif text-foreground">{members.length}</span>
                <span className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1 mt-1">
                  <Users className="h-3 w-3" />
                  {lang === 'fr' ? 'Chercheurs' : 'Researchers'}
                </span>
              </div>
              <div className="text-center px-4 flex-1 border-l border-border">
                <span className="block text-2xl font-bold font-serif text-foreground">{projects.length}</span>
                <span className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1 mt-1">
                  <FlaskConical className="h-3 w-3" />
                  {lang === 'fr' ? 'Projets' : 'Projects'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-background">
        <div className="container-custom space-y-12">
          
          {/* Team Leader */}
          {leader && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif font-bold text-foreground border-b border-border pb-2 animate-none">
                {lang === 'fr' ? "Chef d'équipe" : 'Team Leader'}
              </h2>
              <div className="max-w-md">
                <MemberCard member={leader} lang={lang} isLeader={true} />
              </div>
            </div>
          )}

          {/* Team Members */}
          {regular.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif font-bold text-foreground border-b border-border pb-2">
                {lang === 'fr' ? 'Membres' : 'Team Members'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-row-reverse-rtl">
                {regular.map(m => (
                  <MemberCard key={m.id} member={m} lang={lang} />
                ))}
              </div>
            </div>
          )}

          {/* Research Projects */}
          <div className="space-y-6">
            <h2 className="text-lg font-serif font-bold text-foreground border-b border-border pb-2">
              {lang === 'fr' ? 'Projets de Recherche' : 'Research Projects'}
            </h2>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-row-reverse-rtl">
                {projects.map((p, i) => (
                  <Card key={p.id} className="p-6 hover:border-primary/50 transition-colors duration-150 flex gap-4 shadow-none">
                    <span className="text-2xl font-bold font-serif text-primary/20 shrink-0 leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap flex-row-reverse-rtl">
                        <StateBadge state={p.state} lang={lang} />
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
                          <Calendar className="h-3.5 w-3.5" />
                          {fmtDate(p.started_at, lang)}
                          {p.expected_end_date && <> — {fmtDate(p.expected_end_date, lang)}</>}
                        </span>
                      </div>
                      <h3 className="font-bold font-serif text-sm text-foreground hover:text-primary transition-colors">
                        <Link to={`/projects/${p.id}`}>{p.name}</Link>
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm border border-dashed border-border flex flex-col items-center justify-center gap-2">
                <FlaskConical className="h-6 w-6 text-muted-foreground/60" />
                <p>{lang === 'fr' ? 'Aucun projet enregistré.' : 'No research projects recorded yet.'}</p>
              </div>
            )}
          </div>

          <div className="pt-6">
            <Link to="/teams" className="text-xs font-semibold text-primary hover:underline">
              ← {lang === 'fr' ? 'Retour aux équipes' : 'Back to Teams'}
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
