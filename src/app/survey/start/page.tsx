import type { Metadata } from 'next';
import StartSurveyPageClient from './StartSurveyPageClient';

export const metadata: Metadata = {
  title: 'アンケート',
};

/**
 * 開始時アンケートページ（サーバーコンポーネント）
 */
export default function StartSurveyPage() {
  return <StartSurveyPageClient />;
}
