/* Contact page — form + address/map placeholder */
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import styles from './Contact.module.css';

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Contact form submitted:', form);
    setForm({ name: '', email: '', subject: '', message: '' });
  }

  return (
    <main id="main-content">
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <span>{t('contactBreadcrumb')}</span>
          </nav>
          <h1 className={styles.heroTitle}>{t('contactTitle')}</h1>
        </div>
      </section>

      {/* Contact content */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.twoCol}>
            {/* Form */}
            <div className={styles.formCol}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label htmlFor="contact-name" className={styles.label}>{t('contactFormName')}</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="contact-email" className={styles.label}>{t('contactFormEmail')}</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="contact-subject" className={styles.label}>{t('contactFormSubject')}</label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="contact-message" className={styles.label}>{t('contactFormMessage')}</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    rows="6"
                    required
                  />
                </div>
                <button type="submit" className={styles.submitBtn}>
                  {t('contactFormSend')}
                </button>
              </form>
            </div>

            {/* Address + Map */}
            <div className={styles.infoCol}>
              <div className={styles.addressCard}>
                <h3 className={styles.infoTitle}>{t('contactAddressTitle')}</h3>
                <div className={styles.addressBlock}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <p>{t('footerAddress')}</p>
                </div>
                <div className={styles.addressBlock}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <p>{t('footerPhone')}</p>
                </div>
                <div className={styles.addressBlock}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <p>contact@lmnp-lab.fr</p>
                </div>
              </div>

              <div className={styles.mapCard}>
                <h3 className={styles.infoTitle}>{t('contactMapTitle')}</h3>
                <div className={styles.mapPlaceholder}>
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
                    <rect x="4" y="4" width="52" height="52" rx="4" />
                    <path d="M30 16c-5.5 0-10 4.5-10 10 0 8 10 18 10 18s10-10 10-18c0-5.5-4.5-10-10-10z" />
                    <circle cx="30" cy="26" r="3" />
                  </svg>
                  <span>Campus St-Jérôme, Marseille</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
