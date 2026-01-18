'use client';

import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface PrivacyPageClientProps {
  content: string;
}

/**
 * プライバシーポリシーページ（クライアントコンポーネント）
 *
 * Markdownコンテンツを読みやすいシンプルなレイアウトで表示する。
 */
export default function PrivacyPageClient({ content }: PrivacyPageClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 px-4 py-8">
      <main className="max-w-2xl mx-auto">
        {/* 戻るリンク */}
        <nav className="mb-6">
          <Link
            href="/"
            className="text-amber-300 hover:text-amber-200 transition-colors"
          >
            &larr; ホームに戻る
          </Link>
        </nav>

        {/* Markdownコンテンツ */}
        <article className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 md:p-8">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-2 border-b border-slate-600">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl md:text-2xl font-semibold text-amber-200 mt-8 mb-4">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-amber-100 mt-6 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-300 leading-relaxed mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="text-gray-300 list-disc list-inside mb-4 space-y-1">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="text-gray-300">{children}</li>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline transition-colors"
                >
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
