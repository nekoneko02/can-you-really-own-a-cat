import type { Metadata } from 'next';
import ScenariosPageClient from './ScenariosPageClient';

export const metadata: Metadata = {
  title: 'シナリオを選ぶ',
};

/**
 * シナリオ選択ページ（サーバーコンポーネント）
 */
export default function ScenariosPage() {
  return <ScenariosPageClient />;
}
