import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { dbService } from '../lib/dbService';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Separator } from '../components/ui/Separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../components/ui/Dialog';
import PageHero from '../components/layout/PageHero';
import {
  User,
  BookOpen,
  Briefcase,
  Users,
  Megaphone,
  Settings,
  Plus,
  Trash2,
  Calendar,
  LogOut,
  Sparkles,
  Layers
} from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading, logout, refreshUser } = useAuth();
  const { t, lang } = useTranslation();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState('profile');

  // Database Data state
  const [publications, setPublications] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [allNews, setAllNews] = useState([]);
  const [teamProjects, setTeamProjects] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: null
  });

  const requestConfirm = (title, description, onConfirmAction) => {
    setConfirmDialog({
      open: true,
      title,
      description,
      onConfirm: () => {
        onConfirmAction();
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  };

  // Forms state
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    orcid: '',
    google_scholar_url: '',
    research_gate_url: '',
    grade: '',
    degree: '',
    specialty: '',
    bio: '',
  });

  const [articleForm, setArticleForm] = useState({
    name: '',
    journal_name: '',
    journal_link: '',
    pdf_link: '',
    doi: '',
    coAuthorIds: []
  });

  const [editingArticleId, setEditingArticleId] = useState(null);

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    started_at: '',
    expected_end_date: '',
    state: 'ongoing',
    photo_url: '',
    member_ids: []
  });

  const [memberForm, setMemberForm] = useState({
    email: '',
    full_name: '',
    role: 'member',
    grade: 'Dr.',
    degree: 'Ph.D',
    specialty: '',
    bio: '',
    team_id: ''
  });

  const [teamForm, setTeamForm] = useState({
    name: '',
    acronym: '',
    description: '',
    team_leader_id: ''
  });

  const [newsForm, setNewsForm] = useState({
    title: '',
    description: '',
    content: '',
    photo_url: ''
  });

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [membersData, teamsData, newsData] = await Promise.all([
        dbService.getMembers(lang),
        dbService.getTeams(lang),
        dbService.getNews(lang)
      ]);
      setAllMembers(membersData);
      setAllTeams(teamsData);
      setAllNews(newsData);

      // Load specific role data
      if (user.role === 'member' || user.role === 'team_leader' || user.role === 'lab_leader') {
        const pubs = await dbService.getArticlesByMember(user.id, lang);
        setPublications(pubs);
      }

      if (user.role === 'team_leader' && user.team_id) {
        const projs = await dbService.getProjectsByTeam(user.team_id, lang);
        setTeamProjects(projs);
      }

      // Initialize Profile Form
      setProfileForm({
        full_name: user.full_name || '',
        email: user.email || '',
        orcid: user.orcid || '',
        google_scholar_url: user.google_scholar_url || '',
        research_gate_url: user.research_gate_url || '',
        grade: user.grade || '',
        degree: user.degree || '',
        specialty: user.specialty || '',
        bio: user.bio || '',
      });

    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setLoadingData(false);
    }
  }, [user, lang]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      // Default tab depending on role
      if (user.role === 'lab_leader') {
        setActiveTab('members');
      } else {
        setActiveTab('profile');
      }
    }
  }, [user, loadDashboardData]);

  // Flash messages helper
  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };
  const triggerError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  // --- MUTATION SUBMISSIONS ---

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await dbService.updateMemberProfile(user.id, profileForm);
      await refreshUser();
      triggerSuccess(lang === 'ar' ? 'تم تحديث الملف الشخصي بنجاح!' : 'Profile updated successfully!');
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Add/Update Article
  const handleSubmitArticle = async (e) => {
    e.preventDefault();
    try {
      if (editingArticleId) {
        await dbService.updateArticle(editingArticleId, articleForm);
        setEditingArticleId(null);
        triggerSuccess(lang === 'ar' ? 'تم تعديل المقال العلمي بنجاح!' : 'Scientific article updated successfully!');
      } else {
        await dbService.addArticle({
          ...articleForm,
          primary_author_id: user.id
        });
        triggerSuccess(lang === 'ar' ? 'تم نشر المقال العلمي بنجاح!' : 'Scientific article added successfully!');
      }
      setArticleForm({ name: '', journal_name: '', journal_link: '', pdf_link: '', doi: '', coAuthorIds: [] });
      await loadDashboardData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Start Edit Article Flow
  const handleStartEditArticle = async (art) => {
    let coAuthorIds = [];
    try {
      const coAuthors = await dbService.getArticleCoAuthors(art.id, lang);
      coAuthorIds = coAuthors.map(m => m.id);
    } catch (err) {
      console.error("Error loading coauthors for edit", err);
    }
    setEditingArticleId(art.id);
    setArticleForm({
      name: art.name || '',
      journal_name: art.journal_name || '',
      journal_link: art.journal_link || '',
      pdf_link: art.pdf_link || '',
      doi: art.doi || '',
      coAuthorIds: coAuthorIds
    });
    const formEl = document.getElementById('article-form-scroll-anchor');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Delete Article
  const handleDeleteArticle = (artId) => {
    requestConfirm(
      lang === 'ar' ? 'حذف المقال' : 'Delete Article',
      lang === 'ar' ? 'هل أنت متأكد من حذف هذا المقال العلمي؟' : 'Are you sure you want to delete this research article?',
      async () => {
        try {
          if (editingArticleId === artId) {
            setEditingArticleId(null);
            setArticleForm({ name: '', journal_name: '', journal_link: '', pdf_link: '', doi: '', coAuthorIds: [] });
          }
          await dbService.deleteArticle(artId);
          await loadDashboardData();
          triggerSuccess(lang === 'ar' ? 'تم حذف المقال!' : 'Article deleted successfully!');
        } catch (err) {
          triggerError(err.message);
        }
      }
    );
  };

  // Add Project (Team Leader)
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await dbService.addProject({
        ...projectForm,
        team_id: user.team_id
      });
      setProjectForm({ name: '', description: '', started_at: '', expected_end_date: '', state: 'ongoing', photo_url: '', member_ids: [] });
      await loadDashboardData();
      triggerSuccess(lang === 'ar' ? 'تم إضافة المشروع البحثي!' : 'Research project added successfully!');
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Delete Project (Team Leader)
  const handleDeleteProject = (projId) => {
    requestConfirm(
      lang === 'ar' ? 'حذف المشروع' : 'Delete Project',
      lang === 'ar' ? 'هل أنت متأكد من حذف هذا المشروع؟' : 'Are you sure you want to delete this project?',
      async () => {
        try {
          await dbService.deleteProject(projId);
          await loadDashboardData();
          triggerSuccess(lang === 'ar' ? 'تم حذف المشروع!' : 'Project deleted successfully!');
        } catch (err) {
          triggerError(err.message);
        }
      }
    );
  };

  // Team Personnel addition
  const handleAddMemberToTeam = async (memberId) => {
    try {
      await dbService.addMemberToTeam(memberId, user.team_id);
      await loadDashboardData();
      triggerSuccess(lang === 'ar' ? 'تم إضافة الباحث للفريق!' : 'Member added to team successfully!');
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Team Personnel deletion
  const handleRemoveMemberFromTeam = (memberId) => {
    requestConfirm(
      lang === 'ar' ? 'إزالة الباحث من الفرقة' : 'Remove Member from Team',
      lang === 'ar' ? 'هل أنت متأكد من إزالة هذا الباحث من فرقتك؟' : 'Are you sure you want to remove this member from your team?',
      async () => {
        try {
          await dbService.removeMemberFromTeam(memberId);
          await loadDashboardData();
          triggerSuccess(lang === 'ar' ? 'تم إزالة الباحث من الفريق!' : 'Member removed from team successfully!');
        } catch (err) {
          triggerError(err.message);
        }
      }
    );
  };

  // Lab Manager: Add member to lab system
  const handleAddMemberToLab = async (e) => {
    e.preventDefault();
    try {
      await dbService.addMemberToLab(memberForm);
      setMemberForm({ email: '', full_name: '', role: 'member', grade: 'Dr.', degree: 'Ph.D', specialty: '', bio: '', team_id: '' });
      await loadDashboardData();
      triggerSuccess(lang === 'ar' ? 'تم إضافة الباحث للمختبر بنجاح!' : 'Researcher added to the lab directory!');
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Lab Manager: Remove member from lab system
  const handleRemoveMemberFromLab = (memberId) => {
    if (memberId === user.id) {
      triggerError(lang === 'ar' ? 'لا يمكنك حذف حسابك الخاص!' : 'You cannot remove your own account!');
      return;
    }
    requestConfirm(
      lang === 'ar' ? 'إزالة العضو من المختبر' : 'Remove Member from Lab',
      lang === 'ar' ? 'هل أنت متأكد من إزالة هذا العضو نهائياً من المختبر؟' : 'Are you sure you want to permanently delete this member from the lab?',
      async () => {
        try {
          await dbService.removeMemberFromLab(memberId);
          await loadDashboardData();
          triggerSuccess(lang === 'ar' ? 'تم حذف العضو من النظام!' : 'Member permanently deleted from the lab system!');
        } catch (err) {
          triggerError(err.message);
        }
      }
    );
  };

  // Lab Manager: Create Team/Group
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await dbService.createTeam(teamForm);
      setTeamForm({ name: '', acronym: '', description: '', team_leader_id: '' });
      await loadDashboardData();
      triggerSuccess(lang === 'ar' ? 'تم إنشاء فرقة البحث بنجاح!' : 'Research team created successfully!');
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Lab Manager: Delete Team/Group
  const handleDeleteTeam = (teamId) => {
    requestConfirm(
      lang === 'ar' ? 'حذف فرقة البحث' : 'Delete Research Team',
      lang === 'ar' ? 'هل أنت متأكد من حذف فرقة البحث هذه؟ سيؤدي ذلك لحذف مشاريعها.' : 'Are you sure you want to delete this team? All its projects will be removed.',
      async () => {
        try {
          await dbService.deleteTeam(teamId);
          await loadDashboardData();
          triggerSuccess(lang === 'ar' ? 'تم حذف فرقة البحث!' : 'Team deleted successfully!');
        } catch (err) {
          triggerError(err.message);
        }
      }
    );
  };

  // Lab Manager: Assign Team Leader
  const handleAssignLeader = async (teamId, leaderId) => {
    try {
      await dbService.assignTeamLeader(teamId, leaderId);
      await loadDashboardData();
      triggerSuccess(lang === 'ar' ? 'تم تعيين رئيس الفرقة!' : 'Team leader assigned successfully!');
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Lab Manager: Add News
  const handleAddNews = async (e) => {
    e.preventDefault();
    try {
      await dbService.addNews(newsForm);
      setNewsForm({ title: '', description: '', content: '', photo_url: '' });
      await loadDashboardData();
      triggerSuccess(lang === 'ar' ? 'تم نشر الإعلان الأكاديمي!' : 'News announcement posted successfully!');
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Lab Manager: Delete News
  const handleDeleteNews = (newsId) => {
    requestConfirm(
      lang === 'ar' ? 'حذف الإعلان' : 'Delete Announcement',
      lang === 'ar' ? 'حذف هذا الإعلان؟' : 'Delete this announcement?',
      async () => {
        try {
          await dbService.deleteNews(newsId);
          await loadDashboardData();
          triggerSuccess(lang === 'ar' ? 'تم حذف الإعلان!' : 'Announcement removed successfully!');
        } catch (err) {
          triggerError(err.message);
        }
      }
    );
  };

  if (authLoading || !user) {
    return (
      <main className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  // Define tabs depending on role
  const isMemberOrLeader = user.role === 'member' || user.role === 'team_leader';
  const isLeader = user.role === 'team_leader';
  const isManager = user.role === 'lab_leader';
  const team = allTeams.find(t => t.id === user.team_id);

  return (
    <main id="main-content">
      <PageHero title={lang === 'ar' ? 'لوحة التحكم الأكاديمية' : 'Researcher Dashboard'}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <span>{lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
      </PageHero>

      <section className="py-12 bg-background">
        <div className="container-custom">
          
          {/* Welcome User Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8 mb-8 text-start flex-row-reverse-rtl">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 border border-primary/20">
                  {user.role === 'lab_leader' ? (lang === 'ar' ? 'مدير المختبر' : 'Lab Manager') : user.role === 'team_leader' ? (lang === 'ar' ? 'رئيس فرقة' : 'Team Leader') : (lang === 'ar' ? 'باحث' : 'Member')}
                </span>
                {team && <Badge variant="outline" className="font-semibold text-[10px] rounded-none">{team.acronym}</Badge>}
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground">
                {lang === 'ar' ? `مرحباً بك، ${user.full_name}` : `Welcome back, ${user.full_name}`}
              </h2>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            
            <Button variant="outline" size="sm" onClick={logout} className="shrink-0 font-semibold gap-2 border-destructive/20 text-destructive hover:bg-destructive/10 rounded-none h-10 px-4">
              <LogOut className="h-4 w-4" />
              {lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
            </Button>
          </div>

          {/* Flash notifications */}
          {successMsg && (
            <div className="bg-emerald-500/10 text-emerald-600 text-xs p-3.5 border border-emerald-500/20 font-medium mb-6 text-start">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-destructive/10 text-destructive text-xs p-3.5 border border-destructive/20 font-medium mb-6 text-start">
              {errorMsg}
            </div>
          )}

          {/* Dashboard Outer Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Sidebar Tabs */}
            <aside className="flex flex-col gap-1.5 border border-border p-2 bg-card text-start rounded-none shadow-sm lg:sticky lg:top-6">
              {(isMemberOrLeader || isManager) && (
                <>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-3 border ${activeTab === 'profile' ? 'bg-foreground text-background border-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent'}`}
                  >
                    <User className="h-4 w-4" />
                    {lang === 'ar' ? 'الملف الشخصي' : 'Profile Editor'}
                  </button>
                  <button
                    onClick={() => setActiveTab('articles')}
                    className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-3 border ${activeTab === 'articles' ? 'bg-foreground text-background border-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent'}`}
                  >
                    <BookOpen className="h-4 w-4" />
                    {lang === 'ar' ? 'منشوراتي العلمية' : 'My Publications'}
                  </button>
                </>
              )}

              {isLeader && (
                <>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-3 border ${activeTab === 'projects' ? 'bg-foreground text-background border-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent'}`}
                  >
                    <Briefcase className="h-4 w-4" />
                    {lang === 'ar' ? 'مشاريع الفرقة' : 'Manage Projects'}
                  </button>
                  <button
                    onClick={() => setActiveTab('team-members')}
                    className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-3 border ${activeTab === 'team-members' ? 'bg-foreground text-background border-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent'}`}
                  >
                    <Users className="h-4 w-4" />
                    {lang === 'ar' ? 'أعضاء الفرقة' : 'Team Personnel'}
                  </button>
                </>
              )}

              {isManager && (
                <>
                  <button
                    onClick={() => setActiveTab('members')}
                    className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-3 border ${activeTab === 'members' ? 'bg-foreground text-background border-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent'}`}
                  >
                    <Users className="h-4 w-4" />
                    {lang === 'ar' ? 'أعضاء المختبر' : 'Manage Members'}
                  </button>
                  <button
                    onClick={() => setActiveTab('teams')}
                    className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-3 border ${activeTab === 'teams' ? 'bg-foreground text-background border-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent'}`}
                  >
                    <Layers className="h-4 w-4" />
                    {lang === 'ar' ? 'فرق البحث' : 'Research Teams'}
                  </button>
                  <button
                    onClick={() => setActiveTab('news')}
                    className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-3 border ${activeTab === 'news' ? 'bg-foreground text-background border-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent'}`}
                  >
                    <Megaphone className="h-4 w-4" />
                    {lang === 'ar' ? 'الأخبار والإعلانات' : 'Lab Announcements'}
                  </button>
                </>
              )}
            </aside>

            {/* Dashboard Panels */}
            <div className="lg:col-span-3">
              {loadingData ? (
                <div className="flex items-center justify-center py-20 border border-border bg-card">
                  <div className="h-6 w-6 animate-spin border-2 border-primary border-t-transparent" />
                </div>
              ) : (
                <Card className="border border-border bg-card p-6 md:p-8 bg-card shadow-sm rounded-none">
                  
                  {/* --- TAB PANEL: MEMBER PROFILE --- */}
                  {activeTab === 'profile' && (isMemberOrLeader || isManager) && (
                    <div className="space-y-6 text-start">
                      <div className="space-y-1">
                        <h3 className="font-serif font-bold text-lg text-foreground">
                          {lang === 'ar' ? 'تعديل الملف الشخصي الأكاديمي' : 'Academic Profile Editor'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {lang === 'ar' ? 'قم بتحديث سيرتك العلمية وروابط معرفاتك الأكاديمية الخارجية.' : 'Update your credentials, biography, and external academic identifiers.'}
                        </p>
                      </div>

                      <Separator />

                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-x-5 gap-y-4 text-start">
                          <div className="space-y-1.5 col-span-1 md:col-span-3">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="prof-name">
                              {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                            </label>
                            <input
                              id="prof-name"
                              type="text"
                              required
                              value={profileForm.full_name}
                              onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                              className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5 col-span-1 md:col-span-3">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="prof-email">
                              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                            </label>
                            <input
                              id="prof-email"
                              type="email"
                              required
                              value={profileForm.email}
                              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                              className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5 col-span-1 md:col-span-3">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="prof-grade">
                              {lang === 'ar' ? 'الدرجة العلمية' : 'Grade (e.g. Prof, MCA)'}
                            </label>
                            <input
                              id="prof-grade"
                              type="text"
                              value={profileForm.grade}
                              onChange={(e) => setProfileForm({ ...profileForm, grade: e.target.value })}
                              className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5 col-span-1 md:col-span-3">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="prof-degree">
                              {lang === 'ar' ? 'الشهادة' : 'Degree (e.g. Ph.D, Magister)'}
                            </label>
                            <input
                              id="prof-degree"
                              type="text"
                              value={profileForm.degree}
                              onChange={(e) => setProfileForm({ ...profileForm, degree: e.target.value })}
                              className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5 col-span-1 md:col-span-6">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="prof-spec">
                              {lang === 'ar' ? 'التخصص الدقيق' : 'Specialty'}
                            </label>
                            <input
                              id="prof-spec"
                              type="text"
                              value={profileForm.specialty}
                              onChange={(e) => setProfileForm({ ...profileForm, specialty: e.target.value })}
                              className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5 col-span-1 md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="prof-orcid">
                              ORCID ID
                            </label>
                            <input
                              id="prof-orcid"
                              type="text"
                              placeholder="0000-0000-0000-0000"
                              value={profileForm.orcid}
                              onChange={(e) => setProfileForm({ ...profileForm, orcid: e.target.value })}
                              className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5 col-span-1 md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="prof-scholar">
                              Google Scholar URL
                            </label>
                            <input
                              id="prof-scholar"
                              type="url"
                              value={profileForm.google_scholar_url}
                              onChange={(e) => setProfileForm({ ...profileForm, google_scholar_url: e.target.value })}
                              className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5 col-span-1 md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="prof-rg">
                              ResearchGate Profile URL
                            </label>
                            <input
                              id="prof-rg"
                              type="url"
                              value={profileForm.research_gate_url}
                              onChange={(e) => setProfileForm({ ...profileForm, research_gate_url: e.target.value })}
                              className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5 col-span-1 md:col-span-6">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="prof-bio">
                              {lang === 'ar' ? 'السيرة العلمية' : 'Scientific Biography'}
                            </label>
                            <textarea
                              id="prof-bio"
                              rows={5}
                              value={profileForm.bio}
                              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                              className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors resize-y leading-relaxed"
                            />
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end border-t border-border mt-6">
                          <Button type="submit" className="font-semibold px-6 rounded-none bg-foreground text-background hover:bg-foreground/90 transition-colors">
                            {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* --- TAB PANEL: MY PUBLICATIONS --- */}
                  {activeTab === 'articles' && (isMemberOrLeader || isManager) && (
                    <div className="space-y-8 text-start">
                      
                      {/* Add/Edit Article Form */}
                      <div id="article-form-scroll-anchor" className="space-y-6">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                            {editingArticleId ? (
                              <>
                                <Settings className="h-5 w-5 text-primary" />
                                {lang === 'ar' ? 'تعديل المنشور العلمي' : 'Edit Research Publication'}
                              </>
                            ) : (
                              <>
                                <Plus className="h-5 w-5 text-primary" />
                                {lang === 'ar' ? 'نشر مقال علمي جديد' : 'Publish New Research Article'}
                              </>
                            )}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {editingArticleId
                              ? (lang === 'ar' ? 'تعديل تفاصيل المنشور العلمي الحالي.' : 'Update the selected research paper details in the laboratory database.')
                              : (lang === 'ar' ? 'أدخل تفاصيل المنشور العلمي لتسجيله في مستودع المختبر.' : 'Submit a new research paper or conference article to the laboratory index.')}
                          </p>
                        </div>

                        <form onSubmit={handleSubmitArticle} className="space-y-6 bg-card border border-border p-6 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-5 gap-y-4 text-start">
                            <div className="space-y-1.5 col-span-1 md:col-span-6">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block font-semibold" htmlFor="art-title">
                                {lang === 'ar' ? 'عنوان المقال العلمي' : 'Article Title'}
                              </label>
                              <input
                                id="art-title"
                                type="text"
                                required
                                value={articleForm.name}
                                onChange={(e) => setArticleForm({ ...articleForm, name: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-3">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block font-semibold" htmlFor="art-journal">
                                {lang === 'ar' ? 'اسم المجلة / المؤتمر' : 'Journal / Conference Name'}
                              </label>
                              <input
                                id="art-journal"
                                type="text"
                                required
                                value={articleForm.journal_name}
                                onChange={(e) => setArticleForm({ ...articleForm, journal_name: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-3">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block font-semibold" htmlFor="art-doi">
                                DOI Identifier
                              </label>
                              <input
                                id="art-doi"
                                type="text"
                                placeholder="10.1007/..."
                                value={articleForm.doi}
                                onChange={(e) => setArticleForm({ ...articleForm, doi: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-3">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block font-semibold" htmlFor="art-jlink">
                                {lang === 'ar' ? 'رابط صفحة المجلة' : 'Journal Publication URL'}
                              </label>
                              <input
                                id="art-jlink"
                                type="url"
                                required
                                value={articleForm.journal_link}
                                onChange={(e) => setArticleForm({ ...articleForm, journal_link: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-3">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block font-semibold" htmlFor="art-pdf">
                                {lang === 'ar' ? 'رابط ملف PDF' : 'PDF Document URL (if free)'}
                              </label>
                              <input
                                id="art-pdf"
                                type="url"
                                placeholder="https://..."
                                value={articleForm.pdf_link}
                                onChange={(e) => setArticleForm({ ...articleForm, pdf_link: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-6">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block font-semibold">
                                {lang === 'ar' ? 'المشاركون من المختبر (اختر الباحثين المشاركين)' : 'Select Co-Authors from Lab'}
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border border-border p-3 bg-secondary/5 max-h-36 overflow-y-auto mt-1.5">
                                {allMembers
                                  .filter(m => m.id !== user.id)
                                  .map(m => (
                                    <label key={m.id} className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none text-muted-foreground hover:text-foreground transition-colors py-1">
                                      <input
                                        type="checkbox"
                                        className="rounded-none border-border text-primary focus:ring-primary h-4 w-4 accent-primary"
                                        checked={articleForm.coAuthorIds.includes(m.id)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setArticleForm({
                                              ...articleForm,
                                              coAuthorIds: [...articleForm.coAuthorIds, m.id]
                                            });
                                          } else {
                                            setArticleForm({
                                              ...articleForm,
                                              coAuthorIds: articleForm.coAuthorIds.filter(id => id !== m.id)
                                            });
                                          }
                                        }}
                                      />
                                      <span className="truncate">{m.full_name}</span>
                                    </label>
                                  ))}
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6 flex-row-reverse-rtl">
                            {editingArticleId && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setEditingArticleId(null);
                                  setArticleForm({ name: '', journal_name: '', journal_link: '', pdf_link: '', doi: '', coAuthorIds: [] });
                                }}
                                className="font-semibold px-4 rounded-none h-10 text-xs border-border text-foreground hover:bg-secondary"
                              >
                                {lang === 'ar' ? 'إلغاء التعديل' : 'Cancel Edit'}
                              </Button>
                            )}
                            <Button type="submit" className="font-semibold px-6 rounded-none bg-foreground text-background hover:bg-foreground/90 transition-colors h-10 text-xs">
                              {editingArticleId
                                ? (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes')
                                : (lang === 'ar' ? 'نشر وتثبيت المقال' : 'Submit Publication')}
                            </Button>
                          </div>
                        </form>
                      </div>

                      <Separator />

                      {/* Existing personal articles list */}
                      <div className="space-y-4">
                        <h3 className="font-serif font-bold text-sm text-foreground">
                          {lang === 'ar' ? 'منشوراتي المسجلة' : 'My Registered Publications'}
                        </h3>
                        {publications.length > 0 ? (
                          <div className="divide-y divide-border border-y border-border">
                            {publications.map(art => (
                              <div key={art.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-row-reverse-rtl">
                                <div className="space-y-1.5 flex-1 text-start">
                                  <h4 className="text-sm font-bold text-foreground hover:text-primary transition-colors leading-snug">
                                    {art.journal_link ? (
                                      <a href={art.journal_link} target="_blank" rel="noopener noreferrer" className="hover:underline font-serif">
                                        {art.name}
                                      </a>
                                    ) : (
                                      <span className="font-serif">{art.name}</span>
                                    )}
                                  </h4>
                                  <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                                    {art.journal_name}
                                  </p>
                                </div>
                                <div className="shrink-0 flex items-center gap-2 flex-row-reverse-rtl">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStartEditArticle(art)}
                                    className="border-border text-foreground hover:bg-secondary h-8 font-semibold text-xs rounded-none flex items-center gap-1.5"
                                  >
                                    <Settings className="h-3.5 w-3.5" />
                                    {lang === 'ar' ? 'تعديل' : 'Edit'}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteArticle(art.id)}
                                    className="border-destructive/20 text-destructive hover:bg-destructive/10 h-8 font-semibold text-xs rounded-none flex items-center gap-1.5"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    {lang === 'ar' ? 'حذف' : 'Delete'}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground border border-dashed border-border py-6 text-center">
                            {lang === 'ar' ? 'لم تقم بنشر أي مقالات علمية بعد.' : 'No articles published yet.'}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* --- TAB PANEL: MANAGE PROJECTS --- */}
                  {activeTab === 'projects' && isLeader && (
                    <div className="space-y-8 text-start">
                      
                      {/* Add project form */}
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            {lang === 'ar' ? 'إضافة مشروع بحثي جديد للفرقة' : 'Register New Research Project'}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {lang === 'ar' ? 'قم بتسجيل مشروع علمي جديد لفرقتك البحثية وحدد فترته الزمنية.' : 'Launch a new scientific research initiative under your specific research team.'}
                          </p>
                        </div>

                        <form onSubmit={handleAddProject} className="space-y-6 bg-card border border-border p-6 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-5 gap-y-4 text-start">
                            <div className="space-y-1.5 col-span-1 md:col-span-6">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="proj-name">
                                {lang === 'ar' ? 'اسم المشروع البحثي' : 'Project Name'}
                              </label>
                              <input
                                id="proj-name"
                                type="text"
                                required
                                value={projectForm.name}
                                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-6">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="proj-desc">
                                {lang === 'ar' ? 'وصف المشروع وأهدافه' : 'Project Description'}
                              </label>
                              <textarea
                                id="proj-desc"
                                rows={3}
                                required
                                value={projectForm.description}
                                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors resize-y leading-relaxed"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="proj-start">
                                {lang === 'ar' ? 'تاريخ البدء' : 'Start Date'}
                              </label>
                              <input
                                id="proj-start"
                                type="date"
                                required
                                value={projectForm.started_at}
                                onChange={(e) => setProjectForm({ ...projectForm, started_at: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="proj-end">
                                {lang === 'ar' ? 'تاريخ الانتهاء المتوقع' : 'Expected Completion Date'}
                              </label>
                              <input
                                id="proj-end"
                                type="date"
                                value={projectForm.expected_end_date}
                                onChange={(e) => setProjectForm({ ...projectForm, expected_end_date: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="proj-state">
                                {lang === 'ar' ? 'حالة المشروع' : 'Project State'}
                              </label>
                              <select
                                id="proj-state"
                                value={projectForm.state}
                                onChange={(e) => setProjectForm({ ...projectForm, state: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors cursor-pointer"
                              >
                                <option value="ongoing">{lang === 'ar' ? 'قيد الإنجاز' : 'Ongoing'}</option>
                                <option value="planned">{lang === 'ar' ? 'مخطط له' : 'Planned'}</option>
                                <option value="completed">{lang === 'ar' ? 'مكتمل' : 'Completed'}</option>
                              </select>
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-6">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block font-semibold" htmlFor="proj-photo">
                                {lang === 'ar' ? 'رابط صورة المشروع' : 'Project Cover Image URL'}
                              </label>
                              <input
                                id="proj-photo"
                                type="url"
                                placeholder="https://images.unsplash.com/..."
                                value={projectForm.photo_url || ''}
                                onChange={(e) => setProjectForm({ ...projectForm, photo_url: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-6">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block font-semibold">
                                {lang === 'ar' ? 'الباحثون المشاركون في هذا المشروع' : 'Select Team Members Working on this Project'}
                              </label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border border-border p-3 bg-secondary/5 max-h-36 overflow-y-auto mt-1.5">
                                {allMembers
                                  .filter(m => m.team_id === user.team_id)
                                  .map(m => (
                                    <label key={m.id} className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none text-muted-foreground hover:text-foreground transition-colors py-1">
                                      <input
                                        type="checkbox"
                                        className="rounded-none border-border text-primary focus:ring-primary h-4 w-4 accent-primary"
                                        checked={projectForm.member_ids?.includes(m.id)}
                                        onChange={(e) => {
                                          const currentIds = projectForm.member_ids || [];
                                          if (e.target.checked) {
                                            setProjectForm({
                                              ...projectForm,
                                              member_ids: [...currentIds, m.id]
                                            });
                                          } else {
                                            setProjectForm({
                                              ...projectForm,
                                              member_ids: currentIds.filter(id => id !== m.id)
                                            });
                                          }
                                        }}
                                      />
                                      <span className="truncate">{m.full_name}</span>
                                    </label>
                                  ))}
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 flex justify-end border-t border-border mt-6">
                            <Button type="submit" className="font-semibold px-6 rounded-none bg-foreground text-background hover:bg-foreground/90 transition-colors">
                              {lang === 'ar' ? 'إضافة المشروع' : 'Add Project'}
                            </Button>
                          </div>
                        </form>
                      </div>

                      <Separator />

                      {/* Team Projects listing */}
                      <div className="space-y-4">
                        <h3 className="font-serif font-bold text-sm text-foreground">
                          {lang === 'ar' ? 'مشاريع الفرقة الجارية والمخطط لها' : 'Team Research Projects'}
                        </h3>
                        {teamProjects.length > 0 ? (
                          <div className="divide-y divide-border border-y border-border">
                            {teamProjects.map(proj => (
                              <div key={proj.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-row-reverse-rtl">
                                <div className="space-y-1.5 flex-1 text-start">
                                  <div className="flex items-center gap-2">
                                    <Badge variant={proj.state === 'completed' ? 'secondary' : proj.state === 'ongoing' ? 'default' : 'outline'} className="text-[9px] uppercase tracking-wider font-semibold px-1 py-0 h-4 rounded-none">
                                      {proj.state}
                                    </Badge>
                                    <h4 className="text-sm font-bold text-foreground">
                                      <Link to={`/projects/${proj.id}`} className="hover:text-primary transition-colors hover:underline font-serif">
                                        {proj.name}
                                      </Link>
                                    </h4>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
                                    {proj.description}
                                  </p>
                                </div>
                                <div className="shrink-0 flex items-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteProject(proj.id)}
                                    className="border-destructive/20 text-destructive hover:bg-destructive/10 h-8 font-semibold text-xs rounded-none"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                    {lang === 'ar' ? 'حذف' : 'Delete'}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground border border-dashed border-border py-6 text-center">
                            {lang === 'ar' ? 'لا توجد مشاريع بحثية مسجلة لهذه الفرقة.' : 'No research projects registered under your team.'}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* --- TAB PANEL: TEAM PERSONNEL --- */}
                  {activeTab === 'team-members' && isLeader && (
                    <div className="space-y-8 text-start">
                      
                      {/* Current team members list */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-lg text-foreground">
                            {lang === 'ar' ? 'أعضاء الفرقة البحثية الحالية' : 'Current Team Personnel'}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {lang === 'ar' ? 'قائمة بالباحثين المنخرطين في فرقتك البحثية.' : 'List of scientists currently registered under your unit.'}
                          </p>
                        </div>

                        <div className="divide-y divide-border border-y border-border">
                          {allMembers
                            .filter(m => m.team_id === user.team_id)
                            .map(m => (
                              <div key={m.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-row-reverse-rtl">
                                <div className="text-start">
                                  <h4 className="text-sm font-bold text-foreground">
                                    <Link to={`/members/${m.id}`} className="hover:text-primary transition-colors hover:underline">
                                      {m.full_name}
                                    </Link>
                                  </h4>
                                  <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mt-0.5">
                                    {m.grade} — {m.specialty}
                                  </p>
                                </div>
                                <div className="shrink-0 flex items-center">
                                  {m.id === user.id ? (
                                    <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 font-bold uppercase tracking-wider px-2 py-1 rounded-none">Leader</span>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRemoveMemberFromTeam(m.id)}
                                      className="border-destructive/20 text-destructive hover:bg-destructive/10 h-8 font-semibold text-xs rounded-none"
                                    >
                                      {lang === 'ar' ? 'إزالة من الفرقة' : 'Remove from Unit'}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Available researchers to add */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-sm text-foreground">
                            {lang === 'ar' ? 'الباحثون غير المنخرطين في أي فرقة' : 'Unassigned Lab Researchers'}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {lang === 'ar' ? 'قم بإضافة هؤلاء الباحثين المنضمين للمختبر إلى فرقتك البحثية.' : 'Add researchers from the laboratory database into your research team.'}
                          </p>
                        </div>

                        {allMembers.filter(m => !m.team_id).length > 0 ? (
                          <div className="divide-y divide-border border-y border-border">
                            {allMembers
                              .filter(m => !m.team_id)
                              .map(m => (
                                <div key={m.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-row-reverse-rtl">
                                  <div className="text-start">
                                    <h4 className="text-sm font-bold text-foreground">{m.full_name}</h4>
                                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mt-0.5">
                                      {m.grade} — {m.specialty}
                                    </p>
                                  </div>
                                  <div className="shrink-0">
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddMemberToTeam(m.id)}
                                      className="h-8 font-semibold text-xs gap-1.5 rounded-none bg-foreground text-background hover:bg-foreground/90 transition-colors"
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                      {lang === 'ar' ? 'إضافة للفرقة' : 'Add to Unit'}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground border border-dashed border-border py-6 text-center">
                            {lang === 'ar' ? 'لا يوجد باحثون غير معينين حالياً.' : 'No unassigned researchers available.'}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* --- TAB PANEL: MANAGE LAB MEMBERS --- */}
                  {activeTab === 'members' && isManager && (
                    <div className="space-y-8 text-start">
                      
                      {/* Register Member to lab system Form */}
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            {lang === 'ar' ? 'إضافة باحث جديد لنظام المختبر' : 'Register New Lab Researcher'}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {lang === 'ar' ? 'قم بإدخال بيانات الباحث لتسجيله في الدليل وتخويله صلاحيات الدخول.' : 'Create credentials and profile directory details for a new lab researcher.'}
                          </p>
                        </div>

                        <form onSubmit={handleAddMemberToLab} className="space-y-6 bg-card border border-border p-6 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-5 gap-y-4 text-start">
                            <div className="space-y-1.5 col-span-1 md:col-span-3">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="reg-name">
                                {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                              </label>
                              <input
                                id="reg-name"
                                type="text"
                                required
                                value={memberForm.full_name}
                                onChange={(e) => setMemberForm({ ...memberForm, full_name: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-3">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="reg-email">
                                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                              </label>
                              <input
                                id="reg-email"
                                type="email"
                                required
                                value={memberForm.email}
                                onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="reg-role">
                                {lang === 'ar' ? 'صلاحيات الدخول (الدور)' : 'User System Role'}
                              </label>
                              <select
                                id="reg-role"
                                value={memberForm.role}
                                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors cursor-pointer"
                              >
                                <option value="member">{lang === 'ar' ? 'باحث (عضو)' : 'Researcher (Member)'}</option>
                                <option value="team_leader">{lang === 'ar' ? 'رئيس فرقة بحث' : 'Team Leader'}</option>
                                <option value="lab_leader">{lang === 'ar' ? 'مدير المختبر (مسؤول)' : 'Lab Manager'}</option>
                              </select>
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="reg-grade">
                                {lang === 'ar' ? 'الدرجة العلمية' : 'Grade (e.g. MCA, Prof)'}
                              </label>
                              <input
                                id="reg-grade"
                                type="text"
                                required
                                value={memberForm.grade}
                                onChange={(e) => setMemberForm({ ...memberForm, grade: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="reg-degree">
                                {lang === 'ar' ? 'الشهادة' : 'Degree (e.g. Ph.D)'}
                              </label>
                              <input
                                id="reg-degree"
                                type="text"
                                value={memberForm.degree}
                                onChange={(e) => setMemberForm({ ...memberForm, degree: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-3">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="reg-team">
                                {lang === 'ar' ? 'فرقة البحث الملحق بها' : 'Assign Team (Optional)'}
                              </label>
                              <select
                                id="reg-team"
                                value={memberForm.team_id}
                                onChange={(e) => setMemberForm({ ...memberForm, team_id: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors cursor-pointer"
                              >
                                <option value="">{lang === 'ar' ? 'غير ملحق بفرقة' : 'No Team Assigned'}</option>
                                {allTeams.map(t => (
                                  <option key={t.id} value={t.id}>{t.name} ({t.acronym})</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-3">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="reg-spec">
                                {lang === 'ar' ? 'التخصص الدقيق' : 'Specialty'}
                              </label>
                              <input
                                id="reg-spec"
                                type="text"
                                value={memberForm.specialty}
                                onChange={(e) => setMemberForm({ ...memberForm, specialty: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>
                          </div>

                          <div className="pt-4 flex justify-end border-t border-border mt-6">
                            <Button type="submit" className="font-semibold px-6 rounded-none bg-foreground text-background hover:bg-foreground/90 transition-colors">
                              {lang === 'ar' ? 'تسجيل العضو الجديد' : 'Register Researcher'}
                            </Button>
                          </div>
                        </form>
                      </div>

                      <Separator />

                      {/* All Lab Directory list */}
                      <div className="space-y-4">
                        <h3 className="font-serif font-bold text-sm text-foreground">
                          {lang === 'ar' ? 'دليل باحثي المختبر بالكامل' : 'All Lab Members Directory'}
                        </h3>

                        <div className="divide-y divide-border border-y border-border">
                          {allMembers.map(m => (
                            <div key={m.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-row-reverse-rtl">
                              <div className="text-start">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-foreground">
                                    <Link to={`/members/${m.id}`} className="hover:text-primary transition-colors hover:underline">
                                      {m.full_name}
                                    </Link>
                                  </h4>
                                  <Badge variant={m.role === 'lab_leader' ? 'default' : m.role === 'team_leader' ? 'outline' : 'secondary'} className="text-[8px] uppercase tracking-wider font-semibold px-1 py-0.5 h-4 rounded-none">
                                    {m.role === 'lab_leader' ? 'Manager' : m.role === 'team_leader' ? 'Leader' : 'Member'}
                                  </Badge>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1 tracking-wide font-medium">
                                  {m.email} | {m.grade} | {m.specialty || 'No Specialty'}
                                </p>
                              </div>
                              <div className="shrink-0 flex items-center">
                                {m.id !== user.id && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveMemberFromLab(m.id)}
                                    className="border-destructive/20 text-destructive hover:bg-destructive/10 h-8 font-semibold text-xs rounded-none"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                    {lang === 'ar' ? 'إزالة نهائياً' : 'Remove Permanently'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- TAB PANEL: MANAGE TEAMS --- */}
                  {activeTab === 'teams' && isManager && (
                    <div className="space-y-8 text-start">
                      
                      {/* Create Team Form */}
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            {lang === 'ar' ? 'إنشاء فرقة بحث جديدة' : 'Create New Research Team'}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {lang === 'ar' ? 'قم بتسجيل فرقة بحث جديدة في هيكل المختبر العلمي.' : 'Form a new research unit or scientific group under the lab organization.'}
                          </p>
                        </div>

                        <form onSubmit={handleCreateTeam} className="space-y-6 bg-card border border-border p-6 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-5 gap-y-4 text-start">
                            <div className="space-y-1.5 col-span-1 md:col-span-4">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="team-name">
                                {lang === 'ar' ? 'اسم فرقة البحث الكامل' : 'Team Full Name'}
                              </label>
                              <input
                                id="team-name"
                                type="text"
                                required
                                value={teamForm.name}
                                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="team-acronym">
                                {lang === 'ar' ? 'الرمز المختصر' : 'Acronym (e.g. PVES)'}
                              </label>
                              <input
                                id="team-acronym"
                                type="text"
                                required
                                value={teamForm.acronym}
                                onChange={(e) => setTeamForm({ ...teamForm, acronym: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-6">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="team-desc">
                                {lang === 'ar' ? 'وصف الفرقة ومهامها' : 'Team Description'}
                              </label>
                              <textarea
                                id="team-desc"
                                rows={2}
                                value={teamForm.description}
                                onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors resize-y leading-relaxed"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-6">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="team-leader">
                                {lang === 'ar' ? 'تعيين رئيس الفرقة' : 'Assign Team Leader'}
                              </label>
                              <select
                                id="team-leader"
                                value={teamForm.team_leader_id}
                                onChange={(e) => setTeamForm({ ...teamForm, team_leader_id: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors cursor-pointer"
                              >
                                <option value="">{lang === 'ar' ? 'بدون رئيس حالياً' : 'No Leader Assigned'}</option>
                                {allMembers.map(m => (
                                  <option key={m.id} value={m.id}>{m.full_name} ({m.grade})</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="pt-4 flex justify-end border-t border-border mt-6">
                            <Button type="submit" className="font-semibold px-6 rounded-none bg-foreground text-background hover:bg-foreground/90 transition-colors">
                              {lang === 'ar' ? 'إنشاء الفرقة' : 'Create Team'}
                            </Button>
                          </div>
                        </form>
                      </div>

                      <Separator />

                      {/* Existing teams directory listing */}
                      <div className="space-y-4">
                        <h3 className="font-serif font-bold text-sm text-foreground">
                          {lang === 'ar' ? 'فرق البحث المعتمدة' : 'Registered Research Teams'}
                        </h3>

                        <div className="divide-y divide-border border-y border-border">
                          {allTeams.map(t => {
                            const leader = allMembers.find(m => m.id === t.team_leader_id);
                            return (
                              <div key={t.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 flex-row-reverse-rtl">
                                <div className="space-y-1.5 flex-1 text-start">
                                  <h4 className="text-sm font-bold text-foreground">
                                    <Link to={`/teams/${t.id}`} className="hover:text-primary transition-colors hover:underline font-serif">
                                      {t.name} ({t.acronym})
                                    </Link>
                                  </h4>
                                  <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
                                    {t.description}
                                  </p>

                                  {/* Team leader selector update */}
                                  <div className="flex items-center gap-2 pt-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                      {lang === 'ar' ? 'رئيس الفرقة:' : 'Leader:'}
                                    </span>
                                    <select
                                      value={t.team_leader_id || ''}
                                      onChange={(e) => handleAssignLeader(t.id, e.target.value)}
                                      className="border border-border bg-background p-1 text-[10px] focus:outline-none cursor-pointer rounded-none text-foreground font-semibold"
                                      aria-label={`Assign leader to ${t.acronym}`}
                                    >
                                      <option value="">{lang === 'ar' ? 'بدون رئيس' : 'No Leader'}</option>
                                      {allMembers.map(m => (
                                        <option key={m.id} value={m.id}>{m.full_name}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="shrink-0 flex items-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteTeam(t.id)}
                                    className="border-destructive/20 text-destructive hover:bg-destructive/10 h-8 font-semibold text-xs rounded-none"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                    {lang === 'ar' ? 'حذف الفرقة' : 'Delete Team'}
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- TAB PANEL: MANAGE NEWS --- */}
                  {activeTab === 'news' && isManager && (
                    <div className="space-y-8 text-start">
                      
                      {/* Add News announcement Form */}
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            {lang === 'ar' ? 'نشر إعلان أكاديمي جديد' : 'Post Lab Announcement'}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {lang === 'ar' ? 'قم بنشر أخبار المختبر، ندوات علمية، أو إعلانات عامة للزوار.' : 'Create a public news item or academic announcement shown on the homepage.'}
                          </p>
                        </div>

                        <form onSubmit={handleAddNews} className="space-y-6 bg-card border border-border p-6 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-5 gap-y-4 text-start">
                            <div className="space-y-1.5 col-span-1 md:col-span-6">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="news-title">
                                {lang === 'ar' ? 'عنوان الخبر' : 'Announcement Title'}
                              </label>
                              <input
                                id="news-title"
                                type="text"
                                required
                                value={newsForm.title}
                                onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-6">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="news-desc">
                                {lang === 'ar' ? 'وصف مختصر' : 'Short Description (Summary)'}
                              </label>
                              <input
                                id="news-desc"
                                type="text"
                                required
                                value={newsForm.description}
                                onChange={(e) => setNewsForm({ ...newsForm, description: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-6">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block font-semibold" htmlFor="news-photo">
                                {lang === 'ar' ? 'رابط صورة الإعلان' : 'Announcement Image URL'}
                              </label>
                              <input
                                id="news-photo"
                                type="url"
                                placeholder="https://images.unsplash.com/..."
                                value={newsForm.photo_url || ''}
                                onChange={(e) => setNewsForm({ ...newsForm, photo_url: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors"
                              />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-6">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="news-content">
                                {lang === 'ar' ? 'محتوى الإعلان التفصيلي' : 'Detailed Content'}
                              </label>
                              <textarea
                                id="news-content"
                                rows={4}
                                required
                                value={newsForm.content}
                                onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                                className="mt-1.5 block w-full rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors resize-y leading-relaxed"
                              />
                            </div>
                          </div>

                          <div className="pt-4 flex justify-end border-t border-border mt-6">
                            <Button type="submit" className="font-semibold px-6 rounded-none bg-foreground text-background hover:bg-foreground/90 transition-colors">
                              {lang === 'ar' ? 'نشر الإعلان' : 'Publish Announcement'}
                            </Button>
                          </div>
                        </form>
                      </div>

                      <Separator />

                      {/* Announcements list */}
                      <div className="space-y-4">
                        <h3 className="font-serif font-bold text-sm text-foreground">
                          {lang === 'ar' ? 'الإعلانات المنشورة' : 'Posted Announcements'}
                        </h3>

                        {allNews.length > 0 ? (
                          <div className="divide-y divide-border border-y border-border">
                            {allNews.map(n => (
                              <div key={n.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-row-reverse-rtl">
                                <div className="space-y-1.5 flex-1 text-start">
                                  <h4 className="text-sm font-bold text-foreground">
                                    <Link to={`/news/${n.id}`} className="hover:text-primary transition-colors hover:underline font-serif">
                                      {n.title}
                                    </Link>
                                  </h4>
                                  <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
                                    {n.description}
                                  </p>
                                </div>
                                <div className="shrink-0 flex items-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteNews(n.id)}
                                    className="border-destructive/20 text-destructive hover:bg-destructive/10 h-8 font-semibold text-xs rounded-none"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                    {lang === 'ar' ? 'حذف الإعلان' : 'Remove'}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground border border-dashed border-border py-6 text-center">
                            {lang === 'ar' ? 'لا توجد إعلانات منشورة حالياً.' : 'No announcements posted yet.'}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                </Card>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Confirmation Dialog Modal */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="max-w-md p-6 bg-background border border-border shadow-lg rounded-none">
          <DialogHeader className="text-start">
            <DialogTitle className="font-serif font-bold text-lg text-foreground">
              {confirmDialog.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {confirmDialog.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 flex-row-reverse-rtl">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
              className="text-xs font-semibold rounded-none"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDialog.onConfirm}
              className="text-xs font-semibold rounded-none bg-destructive hover:bg-destructive/95 text-destructive-foreground"
            >
              {lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Action'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
