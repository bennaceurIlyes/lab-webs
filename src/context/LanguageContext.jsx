/* Language context — provides lang/setLang and toggles RTL/LTR on body/HTML */
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('ldreas_lang') || 'ar';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('ldreas_lang', newLang);
  };

  useEffect(() => {
    // Update HTML dir and lang tags
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    
    // Add RTL/LTR class to body for custom CSS logic
    document.body.classList.remove('rtl-layout', 'ltr-layout');
    document.body.classList.add(`${dir}-layout`);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
