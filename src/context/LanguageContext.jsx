/* Language context — provides lang/setLang and toggles RTL/LTR on body/HTML */
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('lderas_lang') || 'en';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('lderas_lang', newLang);
  };

  useEffect(() => {
    // Update HTML dir and lang tags
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lang;
    
    // Default to LTR layout class
    document.body.classList.remove('rtl-layout', 'ltr-layout');
    document.body.classList.add('ltr-layout');
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
