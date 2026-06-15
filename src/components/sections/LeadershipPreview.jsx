import { useTranslation } from '../../hooks/useTranslation';
import { useTeams } from '../../hooks/useTeams';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';

export default function LeadershipPreview() {
  const { t, lang } = useTranslation();
  const { members } = useTeams();

  // Find Lab Director and Team Leaders separately for explicit academic hierarchy
  const director = members.find(m => m.role === 'lab_leader');
  const teamLeaders = members.filter(m => m.role === 'team_leader');

  return (
    <section className="py-16 bg-background" aria-label={t('directorTitle')}>
      <div className="container-custom space-y-12">
        <SectionTitle
          title={lang === 'fr' ? 'Direction & Leadership' : 'Leadership'}
          subtitle={t('teamSubtitle')}
        />

        {/* Laboratory Director Prominent Profile */}
        {director && (
          <div className="border border-border bg-secondary/30 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 flex-row-reverse-rtl rounded-none mb-12 text-start">
            {director.photo_url ? (
              <div className="h-44 w-44 shrink-0 overflow-hidden border border-border relative">
                <img
                  src={director.photo_url}
                  alt={director.full_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="h-44 w-44 shrink-0 bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl font-serif border border-border select-none" aria-hidden="true">
                {(() => {
                  const cleanName = director.full_name.replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.)\s+/i, '');
                  const parts = cleanName.trim().split(/\s+/);
                  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
                })()}
              </div>
            )}
            
            <div className="flex-1 space-y-4">
              <div>
                <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-1 font-sans">
                  {lang === 'fr' ? 'Directeur du laboratoire' : 'Laboratory Director'}
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground hover:text-primary transition-colors">
                  <Link to={`/members/${director.id}`}>
                    {director.full_name}
                  </Link>
                </h3>
                <span className="text-xs font-semibold text-muted-foreground block mt-1 font-sans">
                  {director.specialty}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed italic border-t border-border/80 pt-4">
                "{director.bio}"
              </p>
              <div className="pt-2 font-sans font-semibold">
                <Link to={`/members/${director.id}`} className="text-xs font-bold text-primary hover:underline">
                  {lang === 'fr' ? 'Voir le profil académique →' : 'View Academic Profile →'}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Team Leaders Sub-section */}
        {teamLeaders.length > 0 && (
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/80 border-b border-border pb-2 text-start font-sans">
              {lang === 'fr' ? 'Chefs d\'équipes de recherche' : 'Research Team Leaders'}
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-row-reverse-rtl">
              {teamLeaders.map(leader => {
                const cleanName = leader.full_name.replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.)\s+/i, '');
                const parts = cleanName.trim().split(/\s+/);
                const initials = ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();

                return (
                  <Card key={leader.id} className="flex flex-col h-full bg-background border border-border p-5 rounded-none hover:border-primary transition-colors duration-150">
                    <div className="flex items-center gap-4 border-b border-border pb-4 mb-4 text-start">
                      {leader.photo_url ? (
                        <div className="h-16 w-16 overflow-hidden border border-border shrink-0">
                          <img
                            src={leader.photo_url}
                            alt={leader.full_name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 bg-secondary flex items-center justify-center border border-border shrink-0 select-none" aria-hidden="true">
                          <span className="text-base font-bold font-serif text-muted-foreground">{initials}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] font-bold text-primary tracking-wider uppercase block font-sans">
                           {lang === 'fr' ? 'Chef d\'équipe' : 'Team Leader'}
                        </span>
                        <h4 className="text-sm font-serif font-bold hover:text-primary transition-colors mt-0.5">
                          <Link to={`/members/${leader.id}`}>
                            {leader.full_name}
                          </Link>
                        </h4>
                        <span className="text-[11px] font-semibold text-muted-foreground block mt-0.5 font-sans">
                          {leader.specialty}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 text-start flex-1 mb-4">
                      {leader.bio}
                    </p>
                    
                    <div className="pt-2 text-start font-sans font-semibold border-t border-border/40">
                      <Link to={`/members/${leader.id}`} className="text-xs font-bold text-primary hover:underline">
                        {lang === 'fr' ? 'Voir le profil →' : 'View profile →'}
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
