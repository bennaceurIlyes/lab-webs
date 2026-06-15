import { useTranslation } from '../hooks/useTranslation';
import { events } from '../data/events';
import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero';
import { Card } from '../components/ui/Card';
import { Calendar, MapPin, Tag } from 'lucide-react';

export default function Events() {
  const { t, lang } = useTranslation();

  return (
    <main id="main-content">
      <PageHero title={t('eventsTitle')} subtitle={lang === 'fr' ? 'Séminaires, conférences et soutenances à venir au laboratoire' : 'Seminars, academic conferences, and upcoming defenses'}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <span>{t('eventsTitle')}</span>
      </PageHero>

      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-6 md:before:left-1/2 before:-ml-px before:h-full before:w-0.5 before:bg-border">
            
            {events.map((event, index) => {
              const titleText = lang === 'fr' ? event.title : event.titleEn;
              const typeText = lang === 'fr' ? event.type : event.typeEn;
              const monthText = lang === 'fr' ? event.month : event.monthEn;
              
              // Alternating position for MD screens
              const isEven = index % 2 === 0;

              return (
                <div key={event.id} className={`relative flex flex-col md:flex-row items-start md:justify-between ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline point */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <div 
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-primary shadow-sm animate-scale-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <Calendar className="h-3.5 w-3.5 text-accent" />
                    </div>
                  </div>

                  {/* Left spacing for md, card for mobile/desktop */}
                  <div 
                    className="w-full md:w-[45%] pl-12 md:pl-0 animate-fade-in-up"
                    style={{ animationDelay: `${index * 150 + 100}ms` }}
                  >
                    <Card className="hover:border-primary/50 transition-colors duration-150 shadow-none border-border p-6 text-start space-y-3">
                      {/* Date Badge */}
                      <div className="inline-flex items-center gap-1.5 bg-secondary px-2.5 py-1 text-xs font-bold text-primary">
                        <span className="text-sm font-extrabold">{event.day}</span>
                        <span className="uppercase tracking-wider">{monthText}</span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-foreground leading-snug">
                        {titleText}
                      </h3>

                      <div className="flex flex-col gap-2 text-xs text-muted-foreground pt-1.5 border-t border-border/60">
                        <span className="flex items-center gap-1.5 font-semibold text-primary">
                          <Tag className="h-3.5 w-3.5 text-accent shrink-0" />
                          {typeText}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {event.location}
                        </span>
                      </div>
                    </Card>
                  </div>
                  
                  {/* Invisible matching column for layout balance */}
                  <div className="hidden md:block w-[45%]" />
                </div>
              );
            })}

          </div>

          {/* Central Registration Inquiry Notice */}
          <div className="max-w-xl mx-auto mt-16 text-center border-t border-border pt-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {lang === 'fr' 
                ? "Pour participer ou assister à l'un de ces événements, veuillez envoyer un e-mail à notre Directeur :" 
                : "To participate or attend any of these events, please contact our director directly:"}
            </p>
            <a 
              href="mailto:nouri.abdelkader@univ-bechar.dz?subject=Inquiry about LDERAS Events"
              className="inline-block mt-2 text-xs sm:text-sm font-extrabold text-[#001f40] hover:text-accent hover:underline"
            >
              nouri.abdelkader@univ-bechar.dz
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
