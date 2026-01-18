'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

/**
 * フッターラッパーコンポーネント（Client Component）
 *
 * パスに応じてフッターの表示/非表示を制御する。
 * /experience ページでは没入感を優先するため非表示にする。
 */
export function FooterWrapper() {
  const pathname = usePathname();

  // /experience ページでは非表示（没入感を優先）
  if (pathname === '/experience') {
    return null;
  }

  return <Footer />;
}
