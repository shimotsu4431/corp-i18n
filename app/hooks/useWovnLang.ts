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
  // 初期値を 'ja' に設定
  const [currentLang, setCurrentLang] = useState<string>('ja');

  useEffect(() => {
    // ユーザーが言語を一度でも変更したかセッションストレージで確認
    const langHasBeenChanged = sessionStorage.getItem('langChanged') === 'true';

    // 現在のWOVN言語を取得するヘルパー関数
    const getLang = () => {
      if (window.WOVN && window.WOVN.io) {
        const lang = window.WOVN.io.getCurrentLang();
        return lang.code || lang;
      }
      return null;
    };

    // WOVNと状態を同期する関数
    const syncWithWovn = () => {
      const lang = getLang();
      if (lang) {
        setCurrentLang(lang);
      } else {
        // WOVNがロードされていない場合はリトライ
        setTimeout(syncWithWovn, 100);
      }
    };

    // 言語が以前に変更されたことがある場合のみ、WOVNの言語と同期する
    if (langHasBeenChanged) {
      syncWithWovn();
    }

    // WOVNの言語が変更されたときに発火するイベントリスナー
    const handleWovnLangChange = () => {
      const lang = getLang();
      if (lang) {
        setCurrentLang(lang);
      }
    };

    window.addEventListener('wovnLangChanged', handleWovnLangChange);

    // クリーンアップ
    return () => {
      window.removeEventListener('wovnLangChanged', handleWovnLangChange);
    };
  }, []);

  // 言語を変更する関数
  const changeLang = (langCode: string) => {
    if (window.WOVN && window.WOVN.io) {
      window.WOVN.io.changeLang(langCode);
      // 言語が変更されたことをセッションストレージに記録
      sessionStorage.setItem('langChanged', 'true');
      // UIを即座に更新
      setCurrentLang(langCode);
    }
  };

  return { currentLang, changeLang };
}
