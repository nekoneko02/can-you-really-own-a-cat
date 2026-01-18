/**
 * プライバシーポリシーページのテスト
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

// react-markdownをモック（ESMモジュールのため）
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({
    children,
    components,
  }: {
    children: string;
    components: Record<string, React.FC<{ children?: React.ReactNode; href?: string }>>;
  }) {
    // 簡易的なMarkdownパース
    const lines = children.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const key = `line-${index}`;
      if (line.startsWith('# ')) {
        const H1 = components.h1;
        elements.push(<H1 key={key}>{line.slice(2)}</H1>);
      } else if (line.startsWith('## ')) {
        const H2 = components.h2;
        elements.push(<H2 key={key}>{line.slice(3)}</H2>);
      } else if (line.startsWith('### ')) {
        const H3 = components.h3;
        elements.push(<H3 key={key}>{line.slice(4)}</H3>);
      } else if (line.startsWith('- ')) {
        const Li = components.li;
        const Ul = components.ul;
        elements.push(
          <Ul key={key}>
            <Li>{line.slice(2)}</Li>
          </Ul>
        );
      } else if (line.trim()) {
        const P = components.p;
        elements.push(<P key={key}>{line}</P>);
      }
    });

    return <div data-testid="react-markdown">{elements}</div>;
  };
});

import PrivacyPageClient from '@/app/privacy/PrivacyPageClient';

// 静的ページの表示をテスト
describe('PrivacyPageClient', () => {
  const sampleContent = `# プライバシーポリシー

最終更新日: 2026年1月18日

「君はねこを飼えるか？」（以下「本サービス」）は、ユーザーのプライバシーを尊重します。

## 1. 収集する情報

本サービスでは、以下の情報を収集します。

### アンケート回答
- ねこを飼いたい度合い（5段階評価）

## 2. 情報の利用目的

- サービスの改善・品質向上
`;

  describe('表示', () => {
    it('タイトルが表示される', () => {
      render(<PrivacyPageClient content={sampleContent} />);

      expect(
        screen.getByRole('heading', { level: 1, name: 'プライバシーポリシー' })
      ).toBeInTheDocument();
    });

    it('最終更新日が表示される', () => {
      render(<PrivacyPageClient content={sampleContent} />);

      expect(screen.getByText(/最終更新日: 2026年1月18日/)).toBeInTheDocument();
    });

    it('セクション見出しが表示される', () => {
      render(<PrivacyPageClient content={sampleContent} />);

      expect(
        screen.getByRole('heading', { level: 2, name: '1. 収集する情報' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: '2. 情報の利用目的' })
      ).toBeInTheDocument();
    });

    it('サブセクション見出しが表示される', () => {
      render(<PrivacyPageClient content={sampleContent} />);

      expect(
        screen.getByRole('heading', { level: 3, name: 'アンケート回答' })
      ).toBeInTheDocument();
    });

    it('リスト項目が表示される', () => {
      render(<PrivacyPageClient content={sampleContent} />);

      expect(
        screen.getByText(/ねこを飼いたい度合い（5段階評価）/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/サービスの改善・品質向上/)
      ).toBeInTheDocument();
    });

    it('ホームに戻るリンクが表示される', () => {
      render(<PrivacyPageClient content={sampleContent} />);

      const link = screen.getByRole('link', { name: /ホームに戻る/ });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });
  });
});
