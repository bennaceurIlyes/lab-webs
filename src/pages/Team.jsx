import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useTeams } from '../hooks/useTeams';
import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { User, Mail, Globe, BookOpen } from 'lucide-react';

export default function Team() {
  const { t, lang } = useTranslation();
  const { teams, members, loading } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState('all');

  const getTeamAcronym = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.acronym : '';
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : '';
  };

  // Lab Director is member_director (role: lab_leader)
  const director = members.find(m => m.role === 'lab_leader' || m.id === 'member_director');
  
  // Filtered members (excluding director from general list if needed, or including them but categorizable)
  const filteredMembers = members.filter(m => {
    if (selectedTeamId === 'all') return true;
    return m.team_id === selectedTeamId;
  });

  return (
    <main id="main-content">
      <PageHero title={t('teamTitle')} subtitle={lang === 'fr' ? 'Chercheurs, enseignants-chercheurs et doctorants du LDERAS' : 'Academic researchers, faculty members, and doctoral candidates'}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <span>{t('navTeam')}</span>
      </PageHero>

      {/* Director Highlight Section */}
      {director && selectedTeamId === 'all' && (
        <section className="py-12 bg-secondary/35 border-b border-border">
          <div className="container-custom">
            <h2 className="text-xl font-serif font-extrabold text-primary mb-6 uppercase tracking-wider text-start border-l-4 border-[#d5a153] pl-3">
              {lang === 'fr' ? 'Direction du Laboratoire' : 'Laboratory Leadership'}
            </h2>
            <div className="bg-white border border-border p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start shadow-sm">
              <div className="h-28 w-28 shrink-0 bg-[#001f40] text-white flex items-center justify-center font-bold text-3xl font-serif shadow-inner">
                {director.full_name.split(' ').slice(-1)[0][0] || 'N'}
              </div>
              <div className="flex-1 space-y-4 text-start">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-[#001f40] text-white hover:bg-[#001f40]/90 rounded-none text-[9px] uppercase tracking-wider">
                      {lang === 'fr' ? 'Directeur' : 'Director'}
                    </Badge>
                    {director.team_id && (
                      <Badge variant="outline" className="rounded-none text-[9px] uppercase tracking-wider font-semibold">
                        {getTeamAcronym(director.team_id)}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-serif font-extrabold text-[#001f40] mt-1.5">
                    {director.full_name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                    {director.grade} — {director.specialty}
                  </p>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{director.bio}"
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold flex-wrap text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-accent" />
                    <a href={`mailto:${director.email}`} className="hover:text-primary hover:underline">{director.email}</a>
                  </span>
                  {director.orcid && (
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-accent" />
                      <a href={`https://orcid.org/${director.orcid}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">ORCID</a>
                    </span>
                  )}
                  {director.google_scholar_url && (
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-accent" />
                      <a href={director.google_scholar_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">Scholar</a>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Directory & Filters */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          {/* Team Filter buttons */}
          <div className="flex flex-wrap items-center justify-start gap-2 mb-8 border-b border-border pb-6">
            <button
              onClick={() => setSelectedTeamId('all')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border ${
                selectedTeamId === 'all'
                  ? 'bg-foreground text-background border-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground border-transparent'
              }`}
            >
              {lang === 'fr' ? 'Tous les Chercheurs' : 'All Researchers'}
            </button>
            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border ${
                  selectedTeamId === team.id
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground border-transparent'
                }`}
              >
                {team.acronym} {lang === 'fr' ? 'Équipe' : 'Team'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-6">
              {selectedTeamId !== 'all' && (
                <div className="text-start border border-border p-5 bg-secondary/15 mb-6">
                  <h3 className="font-serif font-extrabold text-[#001f40] text-base">
                    {getTeamName(selectedTeamId)} ({getTeamAcronym(selectedTeamId)})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-4xl">
                    {teams.find(t => t.id === selectedTeamId)?.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-row-reverse-rtl">
                {filteredMembers.map(member => {
                  const initials = member.full_name
                    ? member.full_name.split(' ').slice(-1)[0][0]
                    : 'M';
                  return (
                    <Card key={member.id} className="flex flex-col h-full hover:border-[#001f40]/40 transition-colors duration-150 shadow-none border-border">
                      <CardHeader className="flex-1 pb-4 text-start">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="h-12 w-12 bg-secondary text-primary font-bold text-sm font-serif flex items-center justify-center border border-border">
                            {initials}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {member.role === 'team_leader' && (
                              <Badge className="bg-accent text-white hover:bg-accent/90 rounded-none text-[8px] uppercase tracking-wider">
                                {lang === 'fr' ? 'Chef d\'équipe' : 'Team Leader'}
                              </Badge>
                            )}
                            {member.team_id && (
                              <Badge variant="secondary" className="rounded-none text-[8px] uppercase tracking-wider font-semibold">
                                {getTeamAcronym(member.team_id)}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <CardTitle className="text-base font-serif font-bold leading-tight">
                          <Link to={`/members/${member.id}`} className="hover:text-primary hover:underline">
                            {member.full_name}
                          </Link>
                        </CardTitle>

                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">
                          {member.grade} • {member.degree}
                        </p>

                        <p className="text-xs text-muted-foreground font-semibold mt-1.5 text-primary">
                          {member.specialty}
                        </p>

                        <CardDescription className="text-xs mt-3 leading-relaxed text-muted-foreground line-clamp-3">
                          {member.bio || (lang === 'fr' ? 'Chercheur membre du laboratoire de développement des énergies renouvelables.' : 'Active research fellow under the LDERAS renewable energy framework.')}
                        </CardDescription>
                      </CardHeader>

                      <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-border/45 pt-4">
                        <span className="text-[10px] text-muted-foreground">
                          {member.email}
                        </span>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {member.orcid && (
                            <a
                              href={`https://orcid.org/${member.orcid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors"
                              title="ORCID"
                            >
                              <Globe className="h-3.5 w-3.5" />
                            </a>
                          )}
                          {member.google_scholar_url && (
                            <a
                              href={member.google_scholar_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors"
                              title="Google Scholar"
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
