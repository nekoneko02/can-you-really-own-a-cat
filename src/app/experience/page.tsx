import type { Metadata } from 'next';
import ExperiencePageClient from './ExperiencePageClient';

export const metadata: Metadata = {
  title: '夜泣き・寝不足シナリオ',
};

/**
 * 体験ページ（サーバーコンポーネント）
 */
export default function ExperiencePage() {
  return <ExperiencePageClient />;
}
