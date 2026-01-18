import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import PrivacyPageClient from './PrivacyPageClient';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
};

/**
 * プライバシーポリシーページ（サーバーコンポーネント）
 *
 * Markdownファイルを読み込み、クライアントコンポーネントに渡す。
 */
export default function PrivacyPage() {
  const filePath = path.join(process.cwd(), 'content', 'privacy-policy.md');
  const content = fs.readFileSync(filePath, 'utf-8');

  return <PrivacyPageClient content={content} />;
}
