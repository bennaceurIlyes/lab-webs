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

  const themes = [
    {
      title: lang === 'fr' ? 'Optimisation des composants optoélectroniques' : 'Optoelectronic Components Optimization',
      desc: lang === 'fr' 
        ? 'Amélioration des performances des cellules solaires : qualité des contacts, interfaces, conductivité et rendement quantique.' 
        : 'Improving solar cell performance: contact quality, interfaces, conductivity, quantum and energy efficiency.'
    },
    {
      title: lang === 'fr' ? 'Simulation ab-Initio des matériaux' : 'Ab-Initio Materials Simulation',
      desc: lang === 'fr' 
        ? 'Simulation et étude par méthodes ab-Initio des propriétés physiques des matériaux pour les énergies renouvelables.' 
        : 'Simulation and ab-Initio study of physical properties of materials for renewable energy applications.'
    },
    {
      title: lang === 'fr' ? 'Simulation des cellules solaires avancées' : 'Advanced Solar Cell Simulation',
      desc: lang === 'fr' 
        ? 'Simulation des caractérisations des cellules solaires à base de Si, IV-IV et les matériaux III-V et II-VI de différentes configurations multi-spectrales.' 
        : 'Simulation of solar cell characterizations based on Si, IV-IV, and III-V / II-VI materials in multi-spectral configurations.'
    },
    {
      title: lang === 'fr' ? 'Cellules solaires à couches minces chalcopyrites' : 'Thin-Film Chalcopyrite Solar Cells',
      desc: lang === 'fr' 
        ? 'Études et optimisation des performances des cellules solaires à couches minces à base de matériaux chalcopyrites.' 
        : 'Study and optimization of thin-film solar cell performance based on chalcopyrite materials.'
    },
    {
      title: lang === 'fr' ? 'Caractérisation des cellules solaires à colorant' : 'Dye-Sensitized Solar Cells (DSSC)',
      desc: lang === 'fr' 
        ? 'Caractérisation expérimentale des cellules solaires organiques à colorant pour évaluer leur rendement.' 
        : 'Characterization of organic dye-sensitized solar cells to evaluate their efficiency and stability.'
    },
    {
      title: lang === 'fr' ? 'Dégradation des composants sous climat saharien' : 'PV Component Saharan Degradation',
      desc: lang === 'fr' 
        ? 'Étude de la dégradation des composants et des systèmes photovoltaïques vis-à-vis des conditions climatiques et atmosphériques.' 
        : 'Investigation of PV component and system degradation under Saharan climatic, sand, and atmospheric conditions.'
    },
    {
      title: lang === 'fr' ? 'Dimensionnement et contrôle des systèmes' : 'Energy System Sizing & Control',
      desc: lang === 'fr' 
        ? 'Dimensionnement, contrôle et optimisation des systèmes d\'énergies renouvelables pour une efficacité optimale.' 
        : 'Sizing, smart control, and optimization of renewable and hybrid energy systems for micro-grids.'
    },
    {
      title: lang === 'fr' ? 'Réalisation par voies chimiques et physiques' : 'Chemical Thin-Film Deposition Methods',
      desc: lang === 'fr' 
        ? 'Réalisation des cellules solaires à couches minces standard, multispectrales et sous concentration par les méthodes sol-gel, spin coating et spray pyrolyse.' 
        : 'Fabrication of standard and multi-spectral thin-film solar cells via sol-gel, spin coating, and spray pyrolysis.'
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
            <div className="lg:col-span-2 space-y-8 text-start">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground mb-4">{t('aboutIntroTitle')}</h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">{t('aboutIntroText')}</p>
              </div>

              <blockquote className="border-l-4 border-primary pl-4 py-2 italic my-6 text-sm text-foreground bg-secondary/35">
                <p className="font-semibold text-primary not-italic mb-1">{t('missionTitle')}</p>
                <p className="leading-relaxed">"{t('missionText')}"</p>
              </blockquote>

              {/* Identification Table Card */}
              <div className="bg-secondary/15 border border-border p-6 rounded-[var(--radius)] space-y-4">
                <h3 className="font-serif font-bold text-lg text-foreground border-b border-border pb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  {t('idTitle')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">{lang === 'fr' ? 'Nom du Laboratoire' : 'Laboratory Name'}</span>
                    <span className="text-foreground font-medium">Laboratoire de Développement des Energies Renouvelables et Leurs Applications dans les Zones Sahariennes</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">{lang === 'fr' ? 'Établissement de rattachement' : 'Affiliation Institution'}</span>
                    <span className="text-foreground font-medium">{t('universityLabel')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">{lang === 'fr' ? 'Date de création' : 'Creation Date'}</span>
                      <span className="text-foreground font-medium">10 Février 2020</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">{lang === 'fr' ? 'N° d\'arrêté' : 'Decree Number'}</span>
                      <span className="text-foreground font-medium">N° 05</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border">
                <div className="text-center p-4 bg-secondary/20 rounded-[var(--radius)]">
                  <span className="block text-2xl md:text-3xl font-bold text-primary font-serif">{counts.members || 6}</span>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1 block">{t('statMembers')}</span>
                </div>
                <div className="text-center p-4 bg-secondary/20 rounded-[var(--radius)]">
                  <span className="block text-2xl md:text-3xl font-bold text-primary font-serif">{counts.teams || 4}</span>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1 block">{t('statTeams')}</span>
                </div>
                <div className="text-center p-4 bg-secondary/20 rounded-[var(--radius)]">
                  <span className="block text-2xl md:text-3xl font-bold text-primary font-serif">{counts.articles || 3}</span>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1 block">{t('navPublications')}</span>
                </div>
              </div>
            </div>

            {/* Director Message Card */}
            <Card className="border-border bg-card p-6 md:p-8 space-y-4 shadow-none text-center">
              <div className="h-16 w-16 bg-primary text-primary-foreground flex items-center justify-center font-bold font-serif text-lg mx-auto rounded-full">
                AN
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-foreground">{t('directorLabel')}</h3>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">{t('directorTitle')}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed italic border-t border-border pt-4">
                "{t('directorText')}"
              </p>
              <div className="pt-3 border-t border-border/50 space-y-2 text-xs text-start">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Email</span>
                  <a href="mailto:nouri.abdelkader@univ-bechar.dz" className="text-primary hover:underline font-medium">nouri.abdelkader@univ-bechar.dz</a>
                </div>
                <div className="pt-1">
                  <a 
                    href="http://www.univ-bechar.dz/sm/pdf/CV-nouri.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center w-full bg-primary text-primary-foreground py-2 px-3 shadow-sm hover:bg-primary/95 transition-colors duration-150 rounded-[var(--radius)] font-semibold text-center"
                  >
                    {lang === 'fr' ? 'CV du Directeur ↗' : "Director's CV ↗"}
                  </a>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-20 border-t border-border pt-16">
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground text-center mb-12">
              {lang === 'fr' ? 'Thématiques de Recherche' : 'Scientific Research Themes'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-row-reverse-rtl">
              {themes.map((th, idx) => (
                <Card key={idx} className="hover:border-primary/50 transition-all duration-150 shadow-none hover:shadow-md flex flex-col justify-between text-start">
                  <CardHeader className="space-y-3 p-6 flex-1">
                    <span className="text-3xl font-bold font-serif text-primary/20 block">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <CardTitle className="text-base font-serif font-bold leading-snug">
                      {th.title}
                    </CardTitle>
                    <CardDescription className="text-xs mt-2 leading-relaxed text-muted-foreground">
                      {th.desc}
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
