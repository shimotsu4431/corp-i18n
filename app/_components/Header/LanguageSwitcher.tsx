'use client';
import { useState, useRef } from 'react';
import useWovnLang from '@/app/hooks/useWovnLang';
import useClickOutside from '@/app/hooks/useClickOutside';
import styles from './index.module.css';

const LANGUAGES = [
  { code: 'ja', name: '日本語' },
  { code: 'en', name: 'EN' },
  { code: 'zh-CHS', name: '簡体字' },
  { code: 'zh-CHT', name: '繁体字' },
];

export default function LanguageSwitcher() {
  const { currentLang, changeLang } = useWovnLang();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    setIsOpen(false);
  });

  const handleLanguageChange = (code: string) => {
    changeLang(code);
    setIsOpen(false);
  };

  return (
    <div className={styles.languageSwitcher} ref={menuRef}>
      <div className={styles.languageButton} onClick={() => setIsOpen(!isOpen)}>
        Language
      </div>
      {/* isOpenの状態に応じてCSSクラスをトグルする */}
      <ul className={`${styles.languageMenu} ${isOpen ? styles.isOpen : ''}`}>
        {LANGUAGES.map((lang) => (
          <li
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLang === lang.code ? styles.activeLang : ''}
          >
            {lang.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
