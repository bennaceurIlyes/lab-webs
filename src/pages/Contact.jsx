import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Link } from 'react-router-dom';
import PageHero from '../components/layout/PageHero';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const { t, lang } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate API request
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <main id="main-content">
      <PageHero title={t('contactTitle')} subtitle={lang === 'fr' ? 'Contactez le laboratoire' : 'Reach out to the laboratory administration team'}>
        <Link to="/">{t('navHome')}</Link>
        <span aria-hidden="true" className="mx-1.5 select-none text-muted-foreground/60"> / </span>
        <span>{t('navContact')}</span>
      </PageHero>

      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-start items-start flex-row-reverse-rtl">
            
            {/* Contact Form */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-xl font-serif font-extrabold text-[#001f40] border-l-4 border-[#d5a153] pl-3">
                {lang === 'fr' ? 'Envoyer un message' : 'Send a Message'}
              </h2>
              
              {success && (
                <div className="bg-emerald-50 text-emerald-700 p-4 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                  <p className="text-xs font-semibold leading-relaxed">
                    {t('contactFormSuccess')}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="contact-name">
                      {t('contactFormName')}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="contact-email">
                      {t('contactFormEmail')}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors h-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="contact-sub">
                    {t('contactFormSubject')}
                  </label>
                  <input
                    id="contact-sub"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1 block w-full rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block" htmlFor="contact-msg">
                    {t('contactFormMessage')}
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1 block w-full rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/50 hover:border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary/40 focus:outline-none transition-colors resize-y leading-relaxed"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="font-semibold gap-2 rounded-none bg-foreground text-background hover:bg-foreground/90 transition-colors h-11 px-6 text-xs uppercase tracking-wider"
                >
                  <Send className="h-4 w-4" />
                  {sending ? t('contactFormSending') : t('contactFormSend')}
                </Button>
              </form>
            </div>

            {/* Coordinates & Map Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-extrabold text-[#001f40] border-l-4 border-[#d5a153] pl-3">
                  {t('contactDetailsTitle')}
                </h2>

                <div className="space-y-5 text-sm">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-secondary flex items-center justify-center border border-border text-primary shrink-0">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Address</span>
                      <p className="text-foreground font-semibold mt-0.5 leading-relaxed">
                        {lang === 'fr' 
                          ? 'Faculté des Sciences Exactes, Université TAHRI Mohammed, BP 417, Béchar, Algérie' 
                          : 'Faculty of Exact Sciences, TAHRI Mohammed University, BP 417, Bechar, Algeria'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-secondary flex items-center justify-center border border-border text-primary shrink-0">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Phone / Fax</span>
                      <p className="text-foreground font-semibold mt-0.5">
                        {t('phoneLabel')}<br />{t('faxLabel')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-secondary flex items-center justify-center border border-border text-primary shrink-0">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Email</span>
                      <p className="text-foreground font-semibold mt-0.5">
                        <a href="mailto:nouri.abdelkader@univ-bechar.dz" className="hover:text-primary hover:underline">
                          nouri.abdelkader@univ-bechar.dz
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t('contactMapTitle')}
                </h3>
                <div className="w-full bg-secondary border border-border relative flex flex-col items-center justify-center text-center overflow-hidden">
                  <div className="w-full h-[300px] md:h-[400px] relative">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2588.4320949931916!2d-2.2321236000000004!3d31.602438400000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd8ff606bc3a62df%3A0xca52c859210e2e93!2z2LfYsdmK2YIg2YXZhtmI2YbZiiwgQsOpY2hhcg!5e1!3m2!1sfr!2sdz!4v1781776872791!5m2!1sfr!2sdz" 
                      className="absolute inset-0 w-full h-full border-0" 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className="p-4 bg-secondary/50 w-full flex flex-col items-center gap-1 border-t border-border">
                    <p className="text-xs font-bold text-[#001f40] font-serif">
                      Nouveau bâtiment des laboratoires de recherche 2 -ème étage, UTMB
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
