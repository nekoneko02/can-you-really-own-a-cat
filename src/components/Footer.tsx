import Link from 'next/link';

/**
 * 共通フッターコンポーネント
 *
 * プライバシーポリシーへのリンクを含む、控えめなデザインのフッター。
 * /experience ページでは使用せず、没入感を優先する。
 */
export function Footer() {
  return (
    <footer className="py-6 text-center">
      <Link
        href="/privacy"
        className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
      >
        プライバシーポリシー
      </Link>
    </footer>
  );
}
