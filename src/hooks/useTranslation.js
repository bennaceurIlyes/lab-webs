/* useTranslation hook — returns t() function that reads from the current language */
import { useLanguage } from '../context/LanguageContext';
import fr from '../i18n/fr';
import en from '../i18n/en';

const translations = { fr, en };

export function useTranslation() {
  const { lang } = useLanguage();
  const strings = translations[lang] || translations.fr;

  const t = (key) => strings[key] ?? key;

  return { t, lang };
}
