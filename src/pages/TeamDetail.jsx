import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import styles from './TeamDetail.module.css';

/* ── Icons ────────────────────────────────────────────────────── */
const IcoCal  = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="12" height="12" aria-hidden="true"><rect x="2" y="3" width="16" height="15" rx="1"/><path d="M14 1v4M6 1v4M2 9h16"/></svg>;
const IcoArr  = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" width="12" height="12" aria-hidden="true"><path d="M4 10h12M11 4l6 6-6 6"/></svg>;
const IcoMail = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="12" height="12" aria-hidden="true"><rect x="2" y="4" width="16" height="13" rx="1"/><path d="m2 6 8 6 8-6"/></svg>;
const IcoUsers= () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14" aria-hidden="true"><path d="M13 13c0-2.21-1.343-4-3-4S7 10.79 7 13"/><circle cx="10" cy="6" r="3"/><path d="M16 14c0-1.657-1-3-2.5-3M4 14c0-1.657 1-3 2.5-3"/></svg>;
const IcoFlask= () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14" aria-hidden="true"><path d="M8 2h4M8 2v6l-4 7a1 1 0 00.9 1.5h10.2A1 1 0 0016 15l-4-7V2"/></svg>;

/* ── State badge ──────────────────────────────────────────────── */
const STATE = {
  ongoing:   { en: 'Ongoing',   fr: 'En cours',  ar: 'جاري',  cls: 'ongoing'   },
  completed: { en: 'Completed', fr: 'Terminé',   ar: 'مكتمل', cls: 'completed' },
  planned:   { en: 'Planned',   fr: 'Planifié',  ar: 'مخطط',  cls: 'planned'   },
};
function StateBadge({ state, lang }) {
  const s = STATE[state] ?? STATE.planned;
  const lbl = lang === 'ar' ? s.ar : lang === 'fr' ? s.fr : s.en;
  return <span className={`${styles.badge} ${styles[s.cls]}`}>{lbl}</span>;
}

/* ── Helpers ──────────────────────────────────────────────────── */
function initials(name = '') {
  const c = name.replace(/^(Prof\.|Dr\.|Mr\.|Mrs\.)\s+/i, '');
  const p = c.trim().split(/\s+/);
  return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase();
}
function fmtDate(str, lang) {
  if (!str) return '';
  return new Date(str).toLocaleDateString(
    lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'short' }
  );
}

/* ══════════════════════════════════════════════════════════════════
   FIFA-STYLE PORTRAIT FLIP CARD — LEADER (larger)
   ══════════════════════════════════════════════════════════════════ */
function LeaderFlipCard({ leader, lang }) {
  return (
    <div className={`${styles.flipCard} ${styles.flipCardLeader}`}>
      <div className={styles.flipInner}>

        {/* ── FRONT ── */}
        <div className={`${styles.flipFace} ${styles.flipFront}`}>
          {/* Avatar fills top 58% edge-to-edge */}
          <div className={styles.cardImgArea}>
            {leader.photo_url
              ? <img src={leader.photo_url} alt={leader.full_name} className={styles.cardImg} />
              : <div className={styles.cardInitials}>{initials(leader.full_name)}</div>
            }
            {/* Leader crown ribbon */}
            <div className={styles.leaderRibbon} aria-hidden="true">
              ★ {lang === 'ar' ? 'الرئيس' : lang === 'fr' ? 'Chef' : 'Leader'}
            </div>
          </div>
          {/* Info area — bottom 42% */}
          <div className={styles.cardInfoArea}>
            <span className={styles.cardGrade}>{leader.grade}</span>
            <h3 className={styles.cardName}>{leader.full_name}</h3>
            <p className={styles.cardSpec}>{leader.specialty}</p>
            <p className={styles.cardDeg}>{leader.degree}</p>
            <span className={styles.hoverHint}>
              {lang === 'ar' ? '← اقلب للمزيد' : lang === 'fr' ? '← Survolez' : '← Hover for profile'}
            </span>
          </div>
        </div>

        {/* ── BACK ── */}
        <div className={`${styles.flipFace} ${styles.flipBack}`}>
          <div className={styles.backContent}>
            <div className={styles.backAvatarSm}>
              {leader.photo_url
                ? <img src={leader.photo_url} alt={leader.full_name} className={styles.backAvatarImg} />
                : <div className={styles.backAvatarInit}>{initials(leader.full_name)}</div>
              }
            </div>
            <span className={styles.backGrade}>{leader.grade}</span>
            <p className={styles.backName}>{leader.full_name}</p>
            {leader.bio && <p className={styles.backBio}>{leader.bio}</p>}
            {(leader.orcid || leader.google_scholar_url || leader.research_gate_url) && (
              <div className={styles.backIds}>
                {leader.orcid          && <a href={`https://orcid.org/${leader.orcid}`}  target="_blank" rel="noopener noreferrer" className={styles.idLink}>ORCID</a>}
                {leader.google_scholar_url && <a href={leader.google_scholar_url}         target="_blank" rel="noopener noreferrer" className={styles.idLink}>Scholar</a>}
                {leader.research_gate_url  && <a href={leader.research_gate_url}          target="_blank" rel="noopener noreferrer" className={styles.idLink}>ResearchGate</a>}
              </div>
            )}
            <div className={styles.backActions}>
              <Link to={`/members/${leader.id}`} className={styles.btnWhite}>
                {lang === 'ar' ? 'الملف' : lang === 'fr' ? 'Profil' : 'Full Profile'} <IcoArr />
              </Link>
              <a href={`mailto:${leader.email}`} className={styles.btnGhost}>
                <IcoMail /> {lang === 'ar' ? 'مراسلة' : 'Email'}
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FIFA-STYLE PORTRAIT FLIP CARD — MEMBER (standard)
   ══════════════════════════════════════════════════════════════════ */
function MemberFlipCard({ member, lang }) {
  return (
    <div className={`${styles.flipCard} ${styles.flipCardMember}`}>
      <div className={styles.flipInner}>

        {/* ── FRONT ── */}
        <div className={`${styles.flipFace} ${styles.flipFront}`}>
          <div className={styles.cardImgArea}>
            {member.photo_url
              ? <img src={member.photo_url} alt={member.full_name} className={styles.cardImg} />
              : <div className={styles.cardInitials}>{initials(member.full_name)}</div>
            }
          </div>
          <div className={styles.cardInfoArea}>
            <span className={styles.cardGrade}>{member.grade}</span>
            <h4 className={styles.cardName}>{member.full_name}</h4>
            <p className={styles.cardSpec}>{member.specialty}</p>
            <span className={styles.hoverHint}>
              {lang === 'ar' ? '← اقلب' : lang === 'fr' ? '← Survolez' : '← Hover'}
            </span>
          </div>
        </div>

        {/* ── BACK ── */}
        <div className={`${styles.flipFace} ${styles.flipBack}`}>
          <div className={styles.backContent}>
            <div className={styles.backAvatarSm}>
              {member.photo_url
                ? <img src={member.photo_url} alt={member.full_name} className={styles.backAvatarImg} />
                : <div className={styles.backAvatarInit}>{initials(member.full_name)}</div>
              }
            </div>
            <span className={styles.backGrade}>{member.grade}</span>
            <p className={styles.backName}>{member.full_name}</p>
            <p className={styles.backSpec}>{member.specialty}</p>
            <div className={styles.backActions}>
              <Link to={`/members/${member.id}`} className={styles.btnWhite}>
                {lang === 'ar' ? 'الملف' : lang === 'fr' ? 'Profil' : 'Profile'} <IcoArr />
              </Link>
              <a href={`mailto:${member.email}`} className={styles.btnGhost}>
                <IcoMail /> {lang === 'ar' ? 'مراسلة' : 'Email'}
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════ */
export default function TeamDetail() {
  const { id } = useParams();
  const { t, lang } = useTranslation();
  const [team,     setTeam]     = useState(null);
  const [members,  setMembers]  = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    dbService.getTeamById(id, lang)
      .then(td => {
        if (!td) { setLoading(false); return; }
        setTeam(td);
        return Promise.all([
          dbService.getMembersByTeam(id, lang),
          dbService.getProjectsByTeam(id, lang),
        ]).then(([m, p]) => { setMembers(m); setProjects(p); setLoading(false); });
      })
      .catch(() => setLoading(false));
  }, [id, lang]);

  const leader  = members.find(m => m.id === team?.team_leader_id) || members.find(m => m.role === 'team_leader');
  const regular = members.filter(m => m.id !== leader?.id);

  if (loading) return <main className={styles.loadingWrap}><div className={styles.spinner} /></main>;

  if (!team) return (
    <main className={styles.contentWrap}>
      <div className={styles.errorBox}>
        <p>{lang === 'fr' ? 'Équipe introuvable' : lang === 'ar' ? 'الفرقة غير موجودة' : 'Team not found'}</p>
        <Link to="/teams" className={styles.btnBack}>← Back</Link>
      </div>
    </main>
  );

  return (
    <main id="main-content">

      {/* ── PAGE HEADER ─────────────────────────────────────────── */}
      <section className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{t('navHome')}</Link> / <Link to="/teams">{t('navTeam') || 'Teams'}</Link> / {team.acronym}
          </nav>

          <div className={styles.headerRow}>
            <div className={styles.headerText}>
              <span className={styles.headerKicker}>
                {lang === 'ar' ? 'فرقة بحثية معتمدة' : lang === 'fr' ? 'Équipe de Recherche' : 'Research Team'}
              </span>
              <h1 className={styles.headerTitle}>{team.name}</h1>
              <p className={styles.headerDesc}>{team.description}</p>
            </div>

            <div className={styles.statsBox}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{members.length}</span>
                <span className={styles.statLabel}><IcoUsers />{lang === 'ar' ? 'باحثون' : lang === 'fr' ? 'Chercheurs' : 'Researchers'}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNum}>{projects.length}</span>
                <span className={styles.statLabel}><IcoFlask />{lang === 'ar' ? 'مشاريع' : lang === 'fr' ? 'Projets' : 'Projects'}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNum}>{team.acronym}</span>
                <span className={styles.statLabel}>Équipe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ─────────────────────────────────────────────── */}
      <section className={styles.contentSection}>
        <div className={styles.contentWrap}>

          {/* 1. TEAM LEADER */}
          {leader && (
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>
                <span className={styles.titleBar} />
                {lang === 'ar' ? 'رئيس الفرقة' : lang === 'fr' ? "Chef d'équipe" : 'Team Leader'}
              </h2>
              {/* Single leader card — centered */}
              <div className={styles.leaderCardWrap}>
                <LeaderFlipCard leader={leader} lang={lang} t={t} />
              </div>
            </div>
          )}

          {/* 2. TEAM MEMBERS */}
          {regular.length > 0 && (
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>
                <span className={styles.titleBar} />
                {lang === 'ar' ? 'أعضاء الفريق' : lang === 'fr' ? 'Membres' : 'Team Members'}
              </h2>
              <div className={styles.membersGrid}>
                {regular.map(m => (
                  <MemberFlipCard key={m.id} member={m} lang={lang} />
                ))}
              </div>
            </div>
          )}

          {/* 3. RESEARCH PROJECTS — bottom of page, full width */}
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>
              <span className={styles.titleBar} />
              {lang === 'ar' ? 'المشاريع البحثية' : lang === 'fr' ? 'Projets de Recherche' : 'Research Projects'}
            </h2>

            {projects.length > 0 ? (
              <div className={styles.projectsGrid}>
                {projects.map((p, i) => (
                  <article key={p.id} className={styles.projectCard}>
                    <div className={styles.projNum}>{String(i + 1).padStart(2, '0')}</div>
                    <div className={styles.projBody}>
                      <div className={styles.projMeta}>
                        <StateBadge state={p.state} lang={lang} />
                        <span className={styles.projDate}>
                          <IcoCal />
                          {fmtDate(p.started_at, lang)}
                          {p.expected_end_date && <> — {fmtDate(p.expected_end_date, lang)}</>}
                        </span>
                      </div>
                      <h3 className={styles.projTitle}>{p.name}</h3>
                      <p className={styles.projDesc}>{p.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={styles.emptyBox}>
                <IcoFlask />
                <p>{lang === 'ar' ? 'لا توجد مشاريع مسجلة.' : lang === 'fr' ? 'Aucun projet enregistré.' : 'No research projects recorded yet.'}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={styles.footerNav}>
            <Link to="/teams" className={styles.btnBack}>
              ← {lang === 'ar' ? 'العودة للفرق' : lang === 'fr' ? 'Retour aux équipes' : 'Back to Teams'}
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
