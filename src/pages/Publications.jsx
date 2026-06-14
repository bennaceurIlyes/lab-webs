import { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero';
import styles from './Publications.module.css';

export default function Publications() {
  const { t, lang } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced filters state
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  
  // UI states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeCitation, setActiveCitation] = useState(null);
  const [activeTab, setActiveTab] = useState('bibtex');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      dbService.getArticles(lang),
      dbService.getMembers(lang),
      dbService.getTeams(lang)
    ]).then(([articlesData, membersData, teamsData]) => {
      setArticles(articlesData);
      setMembers(membersData);
      setTeams(teamsData);
    });
  }, [lang]);

  const getAuthorName = (authorId) => {
    const member = members.find(m => m.id === authorId);
    return member ? member.full_name : '';
  };

  const getAuthorTeamId = (authorId) => {
    const member = members.find(m => m.id === authorId);
    return member ? member.team_id : '';
  };

  // Toggle handlers for multi-select filters
  const toggleFilter = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  // Filter logic
  const filteredArticles = articles.filter(art => {
    // 1. Search Query
    const title = (art.name || '').toLowerCase();
    const primaryAuthor = getAuthorName(art.primary_author_id).toLowerCase();
    const coAuthorsStr = (art.coAuthors || []).join(' ').toLowerCase();
    const doiStr = (art.doi || '').toLowerCase();
    const keywordsStr = (art.keywords || []).join(' ').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesQuery = 
      title.includes(query) || 
      primaryAuthor.includes(query) || 
      coAuthorsStr.includes(query) || 
      doiStr.includes(query) || 
      keywordsStr.includes(query);

    if (!matchesQuery) return false;

    // 2. Year Filter
    if (selectedYears.length > 0 && art.published_at) {
      const year = new Date(art.published_at).getFullYear().toString();
      if (!selectedYears.includes(year)) return false;
    }

    // 3. Article Type Filter
    if (selectedTypes.length > 0) {
      const type = art.article_type || 'journal';
      if (!selectedTypes.includes(type)) return false;
    }

    // 4. Research Area Filter
    if (selectedAreas.length > 0) {
      const authorTeam = getAuthorTeamId(art.primary_author_id);
      if (!selectedAreas.includes(authorTeam)) return false;
    }

    return true;
  });

  // Sorting logic
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.published_at) - new Date(a.published_at);
    }
    if (sortBy === 'oldest') {
      return new Date(a.published_at) - new Date(b.published_at);
    }
    if (sortBy === 'citations') {
      return (b.citations_count || 0) - (a.citations_count || 0);
    }
    if (sortBy === 'title') {
      return (a.name || '').localeCompare(b.name || '');
    }
    return 0;
  });

  // Copy DOI to clipboard helper
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} ${lang === 'ar' ? 'تم نسخه بنجاح!' : 'copied successfully!'}`);
    });
  };

  // Generate citation strings based on format
  const getCitationText = (art, format) => {
    if (!art) return '';
    const year = art.published_at ? new Date(art.published_at).getFullYear() : '2026';
    const primaryName = getAuthorName(art.primary_author_id) || 'LDREAS Researchers';
    const authors = [primaryName, ...(art.coAuthors || [])].join(', ');

    if (format === 'bibtex') {
      return `@article{ldreas_${art.id},\n  author = {${authors}},\n  title = {${art.name}},\n  journal = {${art.journal_name || 'Saharan Energy Science'}},\n  year = {${year}},\n  volume = {${art.volume || '1'}},\n  number = {${art.issue || '1'}},\n  pages = {${art.pages || '1-10'}},\n  doi = {${art.doi || ''}}\n}`;
    }
    if (format === 'apa') {
      return `${authors}. (${year}). ${art.name}. ${art.journal_name || 'Saharan Energy Science'}, ${art.volume || '1'}(${art.issue || '1'}), ${art.pages || '1-10'}. https://doi.org/${art.doi || ''}`;
    }
    if (format === 'chicago') {
      return `${authors}. "${art.name}." ${art.journal_name || 'Saharan Energy Science'} ${art.volume || '1'}, no. ${art.issue || '1'} (${year}): ${art.pages || '1-10'}.`;
    }
    return '';
  };

  const handleCopyCitation = () => {
    const text = getCitationText(activeCitation, activeTab);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main id="main-content">
      <PageHero title={t('publicationsTitle')} subtitle={lang === 'ar' ? 'تصفح المستودع العلمي وأبحاث المختبر الأكاديمية المعتمدة' : (lang === 'fr' ? 'Explorez les travaux et publications de notre laboratoire' : 'Explore the repository of peer-reviewed articles and research papers')}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true"> / </span>
        <span>{t('navPublications')}</span>
      </PageHero>

      <section className={styles.section}>
        <div className={styles.container}>
          
          {/* Main Grid: Sidebar + List Content */}
          <div className={styles.layoutGrid}>
            
            {/* Sidebar filter options */}
            <aside className={`${styles.sidebar} ${showMobileFilters ? styles.showMobileFilters : ''}`}>
              <h2 className={styles.sidebarHeading}>{lang === 'ar' ? 'تصفية النتائج' : (lang === 'fr' ? 'Filtres' : 'Filter Results')}</h2>
              
              {/* Year Filter */}
              <div className={styles.filterGroup}>
                <h3 className={styles.filterGroupTitle}>{lang === 'ar' ? 'السنة' : 'Year'}</h3>
                {['2026', '2025', '2024'].map(year => (
                  <label key={year} className={styles.filterLabel}>
                    <input 
                      type="checkbox"
                      className={styles.filterCheckbox}
                      checked={selectedYears.includes(year)}
                      onChange={() => toggleFilter(year, selectedYears, setSelectedYears)}
                    />
                    <span>{year}</span>
                  </label>
                ))}
              </div>

              {/* Article Type Filter */}
              <div className={styles.filterGroup}>
                <h3 className={styles.filterGroupTitle}>{lang === 'ar' ? 'نوع المنشور' : 'Publication Type'}</h3>
                {[
                  { value: 'journal', label: lang === 'ar' ? 'مقال مجلة' : 'Journal Article' },
                  { value: 'conference', label: lang === 'ar' ? 'مقال مؤتمر' : 'Conference Paper' }
                ].map(type => (
                  <label key={type.value} className={styles.filterLabel}>
                    <input 
                      type="checkbox"
                      className={styles.filterCheckbox}
                      checked={selectedTypes.includes(type.value)}
                      onChange={() => toggleFilter(type.value, selectedTypes, setSelectedTypes)}
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>

              {/* Research Area Filter */}
              <div className={styles.filterGroup}>
                <h3 className={styles.filterGroupTitle}>{lang === 'ar' ? 'الفرقة البحثية' : 'Research Team'}</h3>
                {teams.map(team => (
                  <label key={team.id} className={styles.filterLabel}>
                    <input 
                      type="checkbox"
                      className={styles.filterCheckbox}
                      checked={selectedAreas.includes(team.id)}
                      onChange={() => toggleFilter(team.id, selectedAreas, setSelectedAreas)}
                    />
                    <span>{team.acronym}</span>
                  </label>
                ))}
              </div>

              {/* Clear active filters */}
              {(selectedYears.length > 0 || selectedTypes.length > 0 || selectedAreas.length > 0) && (
                <button 
                  onClick={() => {
                    setSelectedYears([]);
                    setSelectedTypes([]);
                    setSelectedAreas([]);
                  }}
                  className={styles.sortSelect}
                  style={{ width: '100%', borderStyle: 'dashed', marginTop: '10px' }}
                >
                  {lang === 'ar' ? 'إعادة تعيين الفلاتر' : 'Clear Filters'}
                </button>
              )}
            </aside>

            {/* Main Content Pane */}
            <div className={styles.mainContent}>
              
              {/* Search Bar + Mobile Filters Button + Sort Select */}
              <div className={styles.searchBarWrap}>
                <button 
                  onClick={() => setShowMobileFilters(!showMobileFilters)} 
                  className={styles.mobileFilterBtn}
                >
                  ⚙️ {lang === 'ar' ? 'تصفية' : 'Filters'}
                </button>

                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder={lang === 'ar' ? 'البحث عن عنوان، مؤلف، كلمة مفتاحية أو معرف DOI...' : 'Search by title, author, keyword or DOI...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                  aria-label="Sort publications"
                >
                  <option value="newest">{lang === 'ar' ? 'الأحدث أولاً' : 'Newest First'}</option>
                  <option value="oldest">{lang === 'ar' ? 'الأقدم أولاً' : 'Oldest First'}</option>
                  <option value="citations">{lang === 'ar' ? 'الأعلى اقتباساً' : 'Most Cited'}</option>
                  <option value="title">{lang === 'ar' ? 'الترتيب الأبجدي' : 'Alphabetical'}</option>
                </select>
              </div>

              {/* Publications List */}
              <div className={styles.list}>
                {sortedArticles.length > 0 ? (
                  sortedArticles.map((art) => (
                    <article key={art.id} className={`${styles.row} flex-row-reverse-rtl`}>
                      
                      {/* Badge / Metadata Header */}
                      <div className={styles.cardHeaderRow}>
                        <span className={styles.typeBadge}>
                          {art.article_type === 'journal' ? (lang === 'ar' ? 'مقال مجلة' : 'Journal Article') : (lang === 'ar' ? 'مقال مؤتمر' : 'Conference Proceeding')}
                        </span>
                        {art.published_at && (
                          <span className={styles.dateBlock}>
                            📅 {new Date(art.published_at).getFullYear()}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className={styles.articleTitle}>
                        <Link to={`/articles/${art.id}`} className={styles.articleTitleLink}>
                          {art.name}
                        </Link>
                      </h3>

                      {/* Authors Line */}
                      <p className={styles.authorLine}>
                        {art.primary_author_id ? (
                          <Link to={`/members/${art.primary_author_id}`} className={styles.authorLink}>
                            {getAuthorName(art.primary_author_id)}
                          </Link>
                        ) : (
                          'LDREAS'
                        )}
                        {art.coAuthors && art.coAuthors.length > 0 && `, ${art.coAuthors.join(', ')}`}
                      </p>

                      {/* Keywords list */}
                      {art.keywords && art.keywords.length > 0 && (
                        <div className={styles.keywordsList}>
                          {art.keywords.map(kw => (
                            <span key={kw} className={styles.keywordBadge}>{kw}</span>
                          ))}
                        </div>
                      )}

                      {/* Metrics and identifiers */}
                      <div className={styles.metricsRow}>
                        {art.citations_count !== undefined && (
                          <span className={styles.metricItem}>
                            📊 {lang === 'ar' ? 'الاقتباسات:' : 'Citations:'} <span className={styles.metricValue}>{art.citations_count}</span>
                          </span>
                        )}
                        {art.downloads_count !== undefined && (
                          <span className={styles.metricItem}>
                            📥 {lang === 'ar' ? 'التحميلات:' : 'Downloads:'} <span className={styles.metricValue}>{art.downloads_count}</span>
                          </span>
                        )}
                        {art.doi && (
                          <span 
                            onClick={() => copyToClipboard(art.doi, 'DOI')} 
                            className={styles.doiBadge}
                            title="Click to copy DOI link"
                          >
                            🔗 DOI: {art.doi}
                          </span>
                        )}
                      </div>

                      {/* Actions row */}
                      <div className={styles.actionsRow}>
                        <Link to={`/articles/${art.id}`} className={styles.journalLink} style={{background: 'rgba(255,255,255,0.03)', color: '#fff', border: '1px solid var(--color-border)'}}>
                          ℹ️ {lang === 'ar' ? 'التفاصيل' : 'Details'}
                        </Link>
                        
                        {art.journal_link && (
                          <a href={art.journal_link} target="_blank" rel="noopener noreferrer" className={styles.journalLink}>
                            🌐 {lang === 'ar' ? 'رابط المجلة' : 'View Journal'}
                          </a>
                        )}
                        
                        {art.pdf_link && art.pdf_link !== '#' && (
                          <a href={art.pdf_link} target="_blank" rel="noopener noreferrer" className={styles.pdfLink}>
                            📥 PDF
                          </a>
                        )}

                        <button 
                          onClick={() => {
                            setActiveCitation(art);
                            setActiveTab('bibtex');
                          }} 
                          className={styles.citeLink}
                        >
                          📚 {lang === 'ar' ? 'تصدير الاقتباس' : 'Cite Paper'}
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className={styles.noPublications}>
                    {t('noPublications')}
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Citation Export Modal */}
      {activeCitation && (
        <div className={styles.modalOverlay} onClick={() => setActiveCitation(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{lang === 'ar' ? 'تصدير مرجع البحث' : 'Export Citation Reference'}</h3>
              <button className={styles.modalClose} onClick={() => setActiveCitation(null)}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalTabs}>
                {['bibtex', 'apa', 'chicago'].map(tab => (
                  <button 
                    key={tab} 
                    className={`${styles.modalTab} ${activeTab === tab ? styles.activeTab : ''}`}
                    onClick={() => {
                      setActiveTab(tab);
                      setCopied(false);
                    }}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
              <pre className={styles.citationCode}>
                {getCitationText(activeCitation, activeTab)}
              </pre>
              <button className={styles.copyButton} onClick={handleCopyCitation}>
                {copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ للمحفظة' : 'Copy to Clipboard')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

