import { useTranslation } from '../../hooks/useTranslation';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router-dom';

export default function EventsList() {
  const { t, lang } = useTranslation();

  const events = [
    {
      id: 'ev_1',
      day: '15',
      month: lang === 'fr' ? 'Octobre' : 'October',
      title: lang === 'fr' ? 'Séminaire Solaire Concentré' : 'Concentrated Solar Seminar',
      type: 'Seminar',
      location: 'Auditorium, Béchar'
    },
    {
      id: 'ev_2',
      day: '08',
      month: lang === 'fr' ? 'Novembre' : 'November',
      title: lang === 'fr' ? 'Soutenance de Thèse: PCM' : 'PhD Defense: PCM Storage',
      type: 'Defense',
      location: 'Block C, Room 14'
    },
    {
      id: 'ev_3',
      day: '12',
      month: lang === 'fr' ? 'Décembre' : 'December',
      title: lang === 'fr' ? 'Journée d\'étude Éolienne' : 'Saharan Wind Study Day',
      type: 'Workshop',
      location: 'Lab Room 05, University of Béchar'
    }
  ];

  return (
    <div className="border border-border p-6 bg-card w-full md:col-span-1">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4 flex-row-reverse-rtl">
        <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">{t('eventsTitle')}</h3>
        <Link to="/news" className="text-xs font-semibold text-primary hover:underline">{t('eventsViewAll')}</Link>
      </div>
      <ul className="space-y-6">
        {events.map((ev) => (
          <li key={ev.id} className="flex gap-4 items-start flex-row-reverse-rtl">
            <div className="bg-secondary text-foreground flex flex-col items-center justify-center p-2.5 min-w-[56px] text-center">
              <span className="text-lg font-bold font-serif leading-none">{ev.day}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-1">{ev.month}</span>
            </div>
            <div className="flex-1 space-y-1">
              <span className="text-xs font-bold text-foreground hover:text-primary transition-colors block">
                {ev.title}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                  {ev.type}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{ev.location}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
