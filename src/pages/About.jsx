import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useTeams } from '../hooks/useTeams';
import { usePublications } from '../hooks/usePublications';
import PageHero from '../components/layout/PageHero';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function About() {
  const { t, lang } = useTranslation();
  const { teams, members } = useTeams();
  const { publications } = usePublications();

  const counts = {
    teams: teams.length,
    members: members.length,
    articles: publications.length
  };

  const axes = [
    {
      title: lang === 'ar' ? 'الطاقة الشمسية الكهروضوئية في الصحراء' : (lang === 'fr' ? 'Photovoltaïque Solaire Saharien' : 'Saharan Solar Photovoltaics'),
      desc: lang === 'ar'
        ? 'تحسين مردودية الخلايا الشمسية ودراسة طبقات طاردة الغبار وحماية الألواح من درجات الحرارة العالية.'
        : (lang === 'fr' ? 'Optimisation des rendements PV et développement de couches anti-poussière sous hautes chaleurs.' : 'PV panel yield optimization and anti-soiling coatings under extreme dry climates.')
    },
    {
      title: lang === 'ar' ? 'أنظمة الطاقة الشمسية المركزة والتخزين الحراري' : (lang === 'fr' ? 'Solaire Concentré (CSP) & Stockage' : 'Concentrated Solar (CSP) & Thermal Storage'),
      desc: lang === 'ar'
        ? 'تصميم لواقط حرارية للمحطات المركزة واختبار الأملاح الذائبة لتخزين الطاقة واستغلالها ليلاً.'
        : (lang === 'fr' ? 'Conception de récepteurs thermiques CSP et expérimentation de sels fondus pour le stockage nocturne.' : 'Designing high-temp receivers and molten salt materials for thermal capture and dispatch.')
    },
    {
      title: lang === 'ar' ? 'طاقة الرياح والشبكات الذكية المعزولة' : (lang === 'fr' ? 'Énergie Éolienne & Micro-Réseaux' : 'Wind Energy & Hybrid Micro-Grids'),
      desc: lang === 'ar'
        ? 'نمذجة التيارات الهوائية المنخفضة وتصميم شفرات توربينات ملائمة للصحراء والتحكم بالشبكات الصغيرة.'
        : (lang === 'fr' ? 'Modélisation des courants éoliens sahariens et conception de micro-réseaux intelligents autonomes.' : 'Saharan wind profiling and dynamic controllers for off-grid hybrid power platforms.')
    }
  ];

  return (
    <main id="main-content">
      <PageHero title={t('aboutTitle')} subtitle={t('aboutIntroText')}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <span>{t('navAbout')}</span>
      </PageHero>

      {/* About content */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start flex-row-reverse-rtl">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground mb-4">{t('aboutIntroTitle')}</h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{t('aboutIntroText')}</p>
              </div>

              <blockquote className="border-l-4 border-primary pl-4 py-1 italic my-6 text-sm text-foreground bg-secondary/20 rtl:border-l-0 rtl:border-r-4 rtl:pl-0 rtl:pr-4">
                <p className="leading-relaxed">{t('missionText')}</p>
              </blockquote>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border">
                <div className="text-center p-4 bg-secondary/20">
                  <span className="block text-2xl md:text-3xl font-bold text-primary font-serif">{counts.members || 6}</span>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1 block">{t('statMembers')}</span>
                </div>
                <div className="text-center p-4 bg-secondary/20">
                  <span className="block text-2xl md:text-3xl font-bold text-primary font-serif">{counts.teams || 3}</span>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1 block">{t('statTeams')}</span>
                </div>
                <div className="text-center p-4 bg-secondary/20">
                  <span className="block text-2xl md:text-3xl font-bold text-primary font-serif">{counts.articles || 3}</span>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1 block">{t('navPublications')}</span>
                </div>
              </div>
            </div>

            {/* Director Message Card */}
            <Card className="border-border bg-card p-6 md:p-8 space-y-4 shadow-none">
              <div className="h-16 w-16 bg-primary text-primary-foreground flex items-center justify-center font-bold font-serif text-lg mx-auto rounded-none">
                AN
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-serif font-bold text-lg text-foreground">{t('directorLabel')}</h3>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">{t('directorTitle')}</p>
              </div>
              <p className="text-xs text-muted-foreground text-center leading-relaxed italic border-t border-border pt-4">
                "{t('directorText')}"
              </p>
            </Card>
          </div>

          {/* Research Axes Section */}
          <div className="mt-20 border-t border-border pt-16">
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground text-center mb-12">{t('researchAxesTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-row-reverse-rtl">
              {axes.map((ax, idx) => (
                <Card key={idx} className="hover:border-primary/50 transition-colors duration-150">
                  <CardHeader className="space-y-3 p-6">
                    <span className="text-3xl font-bold font-serif text-primary/20 block">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <CardTitle className="text-base font-serif font-bold leading-snug">
                      {ax.title}
                    </CardTitle>
                    <CardDescription className="text-xs mt-2 leading-relaxed text-muted-foreground line-clamp-4">
                      {ax.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
