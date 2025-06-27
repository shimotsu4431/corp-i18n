import { useState, useEffect } from 'react';

declare global {
  interface Window {
    WOVN?: {
      io?: {
        getCurrentLang: () => any;
        changeLang: (lang: string) => void;
      };
    };
  }
}

export default function useWovnLang() {
  const [currentLang, setCurrentLang] = useState<string>('');

  useEffect(() => {
    const getLang = () => {
      if (window.WOVN && window.WOVN.io) {
        const lang = window.WOVN.io.getCurrentLang();
        return lang.code || lang;
      }
      return null;
    };

    const checkWOVN = () => {
      const lang = getLang();
      if (lang) {
        setCurrentLang(lang);
      } else {
        setTimeout(checkWOVN, 100);
      }
    };

    checkWOVN();

    const handleWovnLangChange = () => {
      const lang = getLang();
      if (lang) {
        setCurrentLang(lang);
      }
    };

    window.addEventListener('wovnLangChanged', handleWovnLangChange);

    return () => {
      window.removeEventListener('wovnLangChanged', handleWovnLangChange);
    };
  }, []);

  const changeLang = (langCode: string) => {
    if (window.WOVN && window.WOVN.io) {
      window.WOVN.io.changeLang(langCode);
    }
  };

  return { currentLang, changeLang };
}
