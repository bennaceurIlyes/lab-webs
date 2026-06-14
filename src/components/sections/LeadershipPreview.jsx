import { useTranslation } from '../../hooks/useTranslation';
import { useTeams } from '../../hooks/useTeams';
import { Link } from 'react-router-dom';
import SectionTitle from '../ui/SectionTitle';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';

export default function LeadershipPreview() {
  const { t, lang } = useTranslation();
  const { members } = useTeams();

  // Lab leaders and team leaders
  const leaders = members
    .filter(m => m.role === 'lab_leader' || m.role === 'team_leader')
    .slice(0, 4);

  const roleLabel = (role) => {
    if (role === 'lab_leader') {
      return lang === 'ar' ? 'مدير المختبر' : (lang === 'fr' ? 'Directeur du laboratoire' : 'Laboratory Director');
    }
    return lang === 'ar' ? 'رئيس فريق بحث' : (lang === 'fr' ? 'Chef d\'équipe' : 'Team Leader');
  };

  return (
    <section className="py-16 bg-background" aria-label={t('directorTitle')}>
      <div className="container-custom">
        <SectionTitle
          title={lang === 'ar' ? 'القيادة العلمية' : (lang === 'fr' ? 'Direction & Leadership' : 'Leadership')}
          subtitle={t('teamSubtitle')}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-row-reverse-rtl">
          {leaders.map(leader => {
            const cleanName = leader.full_name.replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.)\s+/i, '');
            const parts = cleanName.trim().split(/\s+/);
            const initials = ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();

            return (
              <Card key={leader.id} className="flex flex-col h-full hover:border-primary/50 transition-colors duration-150 overflow-hidden">
                {leader.photo_url ? (
                  <div className="h-48 overflow-hidden relative shrink-0">
                    <img
                      src={leader.photo_url}
                      alt={leader.full_name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-secondary flex items-center justify-center shrink-0" aria-hidden="true">
                    <span className="text-xl font-bold font-serif text-muted-foreground">{initials}</span>
                  </div>
                )}
                <CardHeader className="flex-1 p-5">
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase mb-1 block">
                    {roleLabel(leader.role)}
                  </span>
                  <CardTitle className="text-sm font-serif font-bold hover:text-primary transition-colors">
                    <Link to={`/members/${leader.id}`}>
                      {leader.full_name}
                    </Link>
                  </CardTitle>
                  <span className="text-[11px] font-semibold text-muted-foreground block mt-1">
                    {leader.specialty}
                  </span>
                  <CardDescription className="text-xs mt-3 text-muted-foreground leading-relaxed line-clamp-3">
                    {leader.bio}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
