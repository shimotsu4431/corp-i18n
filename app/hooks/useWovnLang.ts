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

const WOVN_LANG_STORAGE_KEY = 'wovn_lang';

export default function useWovnLang() {
  const [currentLang, setCurrentLang] = useState<string>('ja');

  useEffect(() => {
    // WOVNから現在の言語を取得するヘルパー関数
    const getLangFromWovn = () => {
      if (window.WOVN && window.WOVN.io) {
        const lang = window.WOVN.io.getCurrentLang();
        return lang.code || lang;
      }
      return null;
    };

    // WOVNの言語が変更されたときに状態を更新するハンドラ
    const handleWovnLangChange = () => {
      const lang = getLangFromWovn();
      if (lang) {
        setCurrentLang(lang);
        // sessionStorageにも保存
        sessionStorage.setItem(WOVN_LANG_STORAGE_KEY, lang);
      }
    };

    // --- 初期化ロジック ---
    // 最初にsessionStorageを確認
    const savedLang = sessionStorage.getItem(WOVN_LANG_STORAGE_KEY);
    if (savedLang) {
      // 保存された言語があればそれで初期化
      setCurrentLang(savedLang);
    } else {
      // なければ、WOVNライブラリの準備ができてから言語を取得して設定
      const initialCheckTimeout = setTimeout(() => {
        const lang = getLangFromWovn();
        if (lang) {
          setCurrentLang(lang);
        }
      }, 500); // 500ms待ってから確認

      // タイムアウトをクリーンアップ
      return () => clearTimeout(initialCheckTimeout);
    }

    // WOVNの言語変更イベントを購読
    window.addEventListener('wovnLangChanged', handleWovnLangChange);

    // コンポーネントがアンマウントされるときにイベントリスナーを解除
    return () => {
      window.removeEventListener('wovnLangChanged', handleWovnLangChange);
    };
  }, []);

  // 言語を変更する関数
  const changeLang = (langCode: string) => {
    if (window.WOVN && window.WOVN.io) {
      window.WOVN.io.changeLang(langCode);
      // sessionStorageとstateを即座に更新してUIに反映
      sessionStorage.setItem(WOVN_LANG_STORAGE_KEY, langCode);
      setCurrentLang(langCode);
    }
  };

  return { currentLang, changeLang };
}
