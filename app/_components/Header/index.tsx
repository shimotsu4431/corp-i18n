'use client';
import Menu from '@/app/_components/Menu';
import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
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
        <LanguageSwitcher />
      </div>
    </header>
  );
}
