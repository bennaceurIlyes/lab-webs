import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import PageHero from '../components/layout/PageHero';
import styles from './About.module.css';

export default function About() {
  const { t, lang } = useTranslation();
  const [counts, setCounts] = useState({ teams: 0, members: 0, articles: 0 });

  useEffect(() => {
    Promise.all([
      dbService.getTeams(lang),
      dbService.getMembers(lang),
      dbService.getArticles(lang)
    ]).then(([teamsData, membersData, articlesData]) => {
      setCounts({
        teams: teamsData.length,
        members: membersData.length,
        articles: articlesData.length
      });
    }).catch(err => console.error("Error loading about page counts", err));
  }, [lang]);

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
        <span aria-hidden="true"> / </span>
        <span>{t('navAbout')}</span>
      </PageHero>

      {/* About content */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.twoCol} flex-row-reverse-rtl`}>
            <div className={styles.textCol}>
              <h2 className={styles.sectionHeading}>{t('aboutIntroTitle')}</h2>
              <p className={styles.text}>{t('aboutIntroText')}</p>
              <blockquote className={styles.mission}>
                <p>{t('missionText')}</p>
              </blockquote>
              
              <div className={styles.highlights}>
                <div className={styles.highlightCard}>
                  <span className={styles.highlightNumber}>{counts.members || 6}</span>
                  <span className={styles.highlightLabel}>{t('statMembers')}</span>
                </div>
                <div className={styles.highlightCard}>
                  <span className={styles.highlightNumber}>{counts.teams || 3}</span>
                  <span className={styles.highlightLabel}>{t('statTeams')}</span>
                </div>
                <div className={styles.highlightCard}>
                  <span className={styles.highlightNumber}>{counts.articles || 3}</span>
                  <span className={styles.highlightLabel}>{t('navPublications')}</span>
                </div>
              </div>
            </div>

            {/* Director Message Card */}
            <div className={styles.directorCard}>
              <div className={styles.directorPhotoPlaceholder}>
                <span>AN</span>
              </div>
              <h3 className={styles.directorName}>{t('directorLabel')}</h3>
              <p className={styles.directorTitleText}>{t('directorTitle')}</p>
              <p className={styles.directorQuote}>"{t('directorText')}"</p>
            </div>
          </div>

          {/* Research Axes Section */}
          <div className={styles.axesBlock}>
            <h2 className={styles.axesHeading}>{t('researchAxesTitle')}</h2>
            <div className={`${styles.axesGrid} flex-row-reverse-rtl`}>
              {axes.map((ax, idx) => (
                <div key={idx} className={styles.axisCard}>
                  <div className={styles.axisNumber}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <h4 className={styles.axisTitle}>{ax.title}</h4>
                  <p className={styles.axisDesc}>{ax.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
