import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useTeams } from '../hooks/useTeams';
import { usePublications } from '../hooks/usePublications';
import PageHero from '../components/layout/PageHero';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Separator } from '../components/ui/Separator';
import { Mail, Calendar, GraduationCap, Award, Compass, ExternalLink } from 'lucide-react';

export default function MemberProfile() {
  const { id } = useParams();
  const { t, lang } = useTranslation();
  const { getMemberById, getTeamById, members, getProjectsByTeam } = useTeams();
  const { getPublicationsByMember } = usePublications();

  const [member, setMember] = useState(null);
  const [team, setTeam] = useState(null);
  const [articles, setArticles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMemberById(id).then(memberData => {
      if (!memberData) {
        setLoading(false);
        return;
      }
      setMember(memberData);

      const fetchTeam = memberData.team_id
        ? getTeamById(memberData.team_id)
        : Promise.resolve(null);
      const fetchArticles = getPublicationsByMember(id);
      const fetchProjects = memberData.team_id
        ? getProjectsByTeam(memberData.team_id)
        : Promise.resolve([]);

      return Promise.all([fetchTeam, fetchArticles, fetchProjects]).then(([teamData, articlesData, projectsData]) => {
        setTeam(teamData);
        setArticles(articlesData);
        setProjects(projectsData);
        setLoading(false);
      });
    }).catch(err => {
      console.error("Error loading member profile", err);
      setLoading(false);
    });
  }, [id, lang, getMemberById, getTeamById, getPublicationsByMember, getProjectsByTeam]);

  function getRoleLabel(role) {
    switch (role) {
      case 'lab_leader': return t('roleLabLeader') || 'Lab Director';
      case 'team_leader': return t('roleTeamLeader') || 'Team Leader';
      case 'member': return t('roleMember') || 'Researcher';
      default: return role;
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : (lang === 'fr' ? 'fr-FR' : 'en-US'), {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  function getInitials(fullName) {
    const cleanName = fullName.replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.)\s+/i, '');
    const parts = cleanName.trim().split(/\s+/);
    return ((parts[0] ? parts[0][0] : '') + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  if (loading) {
    return (
      <main className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (!member) {
    return (
      <main className="container-custom py-12">
        <div className="max-w-md mx-auto border border-border p-6 bg-card text-center space-y-4">
          <h2 className="text-lg font-serif font-bold">{lang === 'ar' ? 'الباحث غير موجود' : (lang === 'fr' ? 'Chercheur non trouvé' : 'Researcher not found')}</h2>
          <Link to="/" className="inline-block text-xs font-semibold text-primary hover:underline">
            {lang === 'ar' ? '← العودة للرئيسية' : (lang === 'fr' ? "← Retour à l'accueil" : '← Back to Home')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content">
      {/* Page Hero */}
      <section className="bg-background border-b border-border py-12 md:py-16">
        <div className="container-custom">
          <nav className="text-xs uppercase tracking-wider text-primary font-semibold mb-4" aria-label="Breadcrumb">
            <Link to="/">{t('navHome')}</Link>
            <span className="mx-1.5 select-none text-foreground/40">/</span>
            <span className="text-foreground/70">{lang === 'ar' ? 'ملف الباحث' : (lang === 'fr' ? 'Profil du chercheur' : 'Researcher Profile')}</span>
          </nav>
          <div className="space-y-3">
            <Badge variant="default" className="text-[10px] font-semibold tracking-wider uppercase">
              {getRoleLabel(member.role)}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-foreground tracking-tight leading-tight">
              {member.full_name}
            </h1>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start flex-row-reverse-rtl">

            {/* Left Card: Member Info */}
            <div className="space-y-6">
              <Card className="p-6 border-border bg-card shadow-none">
                <div className="flex flex-col items-center text-center space-y-4">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.full_name} className="h-28 w-28 object-cover border border-border" />
                  ) : (
                    <div className="h-28 w-28 bg-secondary flex items-center justify-center text-2xl font-bold font-serif text-muted-foreground select-none">
                      {getInitials(member.full_name)}
                    </div>
                  )}

                  <div className="space-y-1.5 w-full text-xs text-start divide-y divide-border border-y border-border py-4 my-2">
                    <div className="py-2 flex justify-between items-center gap-4 flex-row-reverse-rtl">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                        {t('gradeLabel')}:
                      </span>
                      <span className="font-semibold text-foreground">{member.grade} ({member.degree})</span>
                    </div>
                    <div className="py-2 flex justify-between items-center gap-4 flex-row-reverse-rtl">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Award className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                        {t('specialtyLabel')}:
                      </span>
                      <span className="font-semibold text-foreground">{member.specialty}</span>
                    </div>
                    {team && (
                      <div className="py-2 flex justify-between items-center gap-4 flex-row-reverse-rtl">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Compass className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                          {lang === 'ar' ? 'فرقة البحث' : (lang === 'fr' ? 'Équipe' : 'Team')}:
                        </span>
                        <span className="font-semibold">
                          <Link to={`/teams/${team.id}`} className="text-primary hover:underline font-bold">
                            {team.acronym}
                          </Link>
                        </span>
                      </div>
                    )}
                    <div className="py-2 flex justify-between items-center gap-4 flex-row-reverse-rtl">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                        {lang === 'ar' ? 'تاريخ الانضمام' : (lang === 'fr' ? 'Membre depuis' : 'Joined Lab')}:
                      </span>
                      <span className="font-semibold text-foreground">{formatDate(member.joined_at)}</span>
                    </div>
                  </div>

                  {/* Research Interests */}
                  {member.research_topics && member.research_topics.length > 0 && (
                    <div className="w-full text-start space-y-2 pt-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        {lang === 'ar' ? 'الاهتمامات البحثية:' : 'Research Areas:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {member.research_topics.map(topic => (
                          <Badge key={topic} variant="outline" className="text-[10px] py-0.5 px-2">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Academic External Links */}
                  {(member.orcid || member.google_scholar_url || member.research_gate_url) && (
                    <div className="w-full text-start space-y-2 pt-4 border-t border-border">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        {lang === 'ar' ? 'معرفات أكاديمية:' : 'Identifiers:'}
                      </span>
                      <div className="flex flex-col gap-1.5 text-xs font-medium">
                        {member.orcid && (
                          <a href={`https://orcid.org/${member.orcid}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center justify-between gap-2 border border-border p-2 bg-secondary/10">
                            <span>ORCID ID: {member.orcid}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {member.google_scholar_url && (
                          <a href={member.google_scholar_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center justify-between gap-2 border border-border p-2 bg-secondary/10">
                            <span>Google Scholar</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {member.research_gate_url && (
                          <a href={member.research_gate_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center justify-between gap-2 border border-border p-2 bg-secondary/10">
                            <span>ResearchGate</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <Button asChild size="sm" className="w-full font-semibold mt-4">
                    <a href={`mailto:${member.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      {lang === 'ar' ? 'إرسال بريد إلكتروني' : (lang === 'fr' ? 'Contacter par email' : 'Send Message')}
                    </a>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Card: Bio & Publications */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio block */}
              <div className="space-y-3">
                <h2 className="text-xl font-serif font-bold text-foreground border-b border-border pb-2">
                  {lang === 'ar' ? 'السيرة العلمية' : (lang === 'fr' ? 'Biographie' : 'Scientific Biography')}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.bio || (lang === 'ar' ? 'لا توجد سيرة ذاتية مسجلة.' : 'No scientific biography recorded.')}
                </p>
              </div>

              {/* Publications block */}
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-foreground border-b border-border pb-2">
                  {lang === 'ar' ? 'المنشورات والأبحاث' : (lang === 'fr' ? 'Publications & Travaux' : 'Publications & Articles')}
                </h2>

                 {articles.length > 0 ? (
                  <div className="divide-y divide-border border-y border-border">
                    {articles.map(art => {
                      const primaryName = members.find(m => m.id === art.primary_author_id)?.full_name || member?.full_name || 'LDERAS';
                      const secondAuthor = art.coAuthors && art.coAuthors[0];
                      const authorsText = secondAuthor ? `${primaryName}, ${secondAuthor}` : primaryName;
                      return (
                        <div key={art.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-row-reverse-rtl">
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
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground text-xs border border-dashed border-border">
                    {lang === 'ar' ? 'لم يتم تسجيل منشورات علمية بعد.' : 'No scientific publications recorded yet.'}
                  </div>
                )}
              </div>

              {/* Projects block */}
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-foreground border-b border-border pb-2">
                  {lang === 'ar' ? 'مشاريع البحث الحالية' : (lang === 'fr' ? 'Projets de recherche' : 'Research Projects')}
                </h2>

                {projects.length > 0 ? (
                  <div className="divide-y divide-border border-y border-border">
                    {projects.map(proj => (
                      <div key={proj.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-row-reverse-rtl">
                        <div className="space-y-1.5 flex-1 text-start">
                          <h3 className="text-sm font-bold text-foreground font-serif leading-snug hover:text-primary transition-colors">
                            <Link to={`/projects/${proj.id}`}>{proj.name}</Link>
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {proj.description}
                          </p>
                        </div>
                        <div className="flex items-center shrink-0">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/projects/${proj.id}`}>
                              {lang === 'ar' ? 'تفاصيل المشروع' : (lang === 'fr' ? 'Détails du projet' : 'Project Details')}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground text-xs border border-dashed border-border">
                    {lang === 'ar' ? 'لم يتم تسجيل مشاريع بحثية بعد.' : 'No research projects recorded yet.'}
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="pt-10">
            <Link to="/teams" className="text-xs font-semibold text-primary hover:underline">
              {lang === 'ar' ? '← العودة للفرق' : (lang === 'fr' ? '← Retour aux équipes' : '← Back to Teams')}
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
