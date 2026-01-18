import type { Metadata } from 'next';
import EndSurveyPageClient from './EndSurveyPageClient';

export const metadata: Metadata = {
  title: 'アンケート',
};

/**
 * 終了時アンケートページ（サーバーコンポーネント）
 */
export default function EndSurveyPage() {
  return <EndSurveyPageClient />;
}
