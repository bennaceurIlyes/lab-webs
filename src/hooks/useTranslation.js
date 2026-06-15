/* useTranslation hook — returns t() function that reads from the current language */
import { useLanguage } from '../context/LanguageContext';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

const translations = { fr, en };

export function useTranslation() {
  const { lang } = useLanguage();
  const strings = translations[lang] || translations.en;

  const t = (key, params = {}) => {
    let text = strings[key] ?? key;
    // Replace parameters e.g. {name} with values from params
    Object.keys(params).forEach((paramKey) => {
      text = text.replace(`{${paramKey}}`, params[paramKey]);
    });
    return text;
  };

  return { t, lang };
}
