import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import PageHero from '../components/layout/PageHero';

export default function Login() {
  const { t, lang } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleEmail) => {
    setEmail(roleEmail);
    setPassword('password');
    setError(null);
  };

  return (
    <main id="main-content">
      <PageHero title={t('loginTitle') || 'Researcher Portal'}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <span>{t('navLogin') || 'Login'}</span>
      </PageHero>

      <section className="py-16 bg-background">
        <div className="container-custom max-w-md mx-auto">
          <Card className="border border-border shadow-none p-6 space-y-6">
            <CardHeader className="p-0 text-start">
              <CardTitle className="font-serif font-bold text-lg text-foreground">
                {t('loginTitle') || 'Researcher Login'}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {t('loginSubtitle') || 'Access your researcher dashboard to edit publications and manage research assets.'}
              </CardDescription>
            </CardHeader>

            {error && (
              <div className="bg-destructive/10 text-destructive text-xs p-3 border border-destructive/20 font-medium text-start">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-start">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="email-input">
                  {t('loginEmail') || 'Email Address'}
                </label>
                <input
                  id="email-input"
                  type="email"
                  required
                  placeholder="name@univ-bechar.dz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground" htmlFor="password-input">
                  {t('loginPassword') || 'Password'}
                </label>
                <input
                  id="password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full font-semibold">
                {loading ? 'Logging in...' : (t('loginBtn') || 'Login')}
              </Button>
            </form>

            <div className="border-t border-border pt-4 text-start space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Quick Autofill Credentials:
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('a.boudjemila@univ-bechar.dz')}
                  className="text-left w-full text-xs border border-border p-2 bg-secondary/20 hover:bg-secondary/40 transition-colors flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold block text-foreground">Dr. Amel BOUDJEMILA</span>
                    <span className="text-[10px] text-muted-foreground">a.boudjemila@univ-bechar.dz</span>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 font-bold uppercase tracking-wider">Member</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('ghezali.mohammed@univ-bechar.dz')}
                  className="text-left w-full text-xs border border-border p-2 bg-secondary/20 hover:bg-secondary/40 transition-colors flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold block text-foreground">Pr. GHEZALI Mohammed</span>
                    <span className="text-[10px] text-muted-foreground">ghezali.mohammed@univ-bechar.dz</span>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 font-bold uppercase tracking-wider">Team Leader</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('nouri.abdelkader@univ-bechar.dz')}
                  className="text-left w-full text-xs border border-border p-2 bg-secondary/20 hover:bg-secondary/40 transition-colors flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold block text-foreground">Pr. NOURI Abdelkader</span>
                    <span className="text-[10px] text-muted-foreground">nouri.abdelkader@univ-bechar.dz</span>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 font-bold uppercase tracking-wider">Lab Manager</span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
