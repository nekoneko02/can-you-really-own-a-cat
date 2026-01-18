import type { Metadata } from 'next';
import NightcryReportPageClient from './NightcryReportPageClient';

export const metadata: Metadata = {
  title: '振り返りレポート',
};

/**
 * 振り返りレポートページ（サーバーコンポーネント）
 */
export default function NightcryReportPage() {
  return <NightcryReportPageClient />;
}
