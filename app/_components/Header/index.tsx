'use client';
import Menu from '@/app/_components/Menu';
import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';
import { useEffect, useState } from 'react';

// Extend the Window interface to include WOVN
// changeLang も追加

declare global {
  interface Window {
    WOVN?: {
      io?: {
        getCurrentLang: () => string;
        changeLang: (lang: string) => void;
      };
    };
  }
}

export default function Header() {
  const [currentLang, setCurrentLang] = useState<string>('');
  useEffect(() => {
    const checkWOVN = () => {
      if (window.WOVN && window.WOVN.io) {
        const langObj = window.WOVN.io.getCurrentLang();
        // codeプロパティがある場合はそれを使う
        const lang =
          langObj && typeof langObj === 'object' && 'code' in langObj
            ? (langObj as { code: string }).code
            : (langObj as string);
        setCurrentLang(lang);
        console.log('currentLang:', lang);
      } else {
        setTimeout(checkWOVN, 100);
      }
    };
    checkWOVN();
    // WOVNの言語切り替え時にも反映させる
    window.addEventListener('wovnLangChanged', () => {
      if (window.WOVN && window.WOVN.io) {
        const langObj = window.WOVN.io.getCurrentLang();
        const lang =
          langObj && typeof langObj === 'object' && 'code' in langObj
            ? (langObj as { code: string }).code
            : (langObj as string);
        setCurrentLang(lang);
        console.log('currentLang:', lang);
      }
    });
    return () => {
      window.removeEventListener('wovnLangChanged', () => {});
    };
  }, []);
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink}>
        <Image
          src="/logo.svg"
          alt="SIMPLE"
          className={styles.logo}
          width={348}
          height={133}
          priority
        />
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '24px' }}>
        <Menu />
        {/* 言語切り替えボタン */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={() => {
              if (window.WOVN && window.WOVN.io) {
                window.WOVN.io.changeLang('ja');
                setTimeout(() => {
                  if (window.WOVN && window.WOVN.io) {
                    const langObj = window.WOVN.io.getCurrentLang();
                    const lang =
                      langObj && typeof langObj === 'object' && 'code' in langObj
                        ? (langObj as { code: string }).code
                        : (langObj as string);
                    setCurrentLang(lang);
                    console.log('currentLang:', lang);
                  }
                }, 100);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: 0,
              borderBottom: currentLang === 'ja' ? '2px solid #fff' : '2px solid transparent',
              opacity: currentLang === 'ja' ? 1 : 0.5,
              transition: 'opacity 0.2s, border-bottom 0.2s',
            }}
          >
            日本語
          </button>
          <span style={{ color: '#fff' }}>|</span>
          <button
            type="button"
            onClick={() => {
              if (window.WOVN && window.WOVN.io) {
                window.WOVN.io.changeLang('en');
                setTimeout(() => {
                  if (window.WOVN && window.WOVN.io) {
                    const langObj = window.WOVN.io.getCurrentLang();
                    const lang =
                      langObj && typeof langObj === 'object' && 'code' in langObj
                        ? (langObj as { code: string }).code
                        : (langObj as string);
                    setCurrentLang(lang);
                    console.log('currentLang:', lang);
                  }
                }, 100);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: 0,
              borderBottom: currentLang === 'en' ? '2px solid #fff' : '2px solid transparent',
              opacity: currentLang === 'en' ? 1 : 0.5,
              transition: 'opacity 0.2s, border-bottom 0.2s',
            }}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
