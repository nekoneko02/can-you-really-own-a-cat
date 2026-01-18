/**
 * Footer コンポーネントのテスト
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Footer } from '@/components/Footer';

describe('Footer', () => {
  it('プライバシーポリシーへのリンクを表示する', () => {
    render(<Footer />);

    const link = screen.getByRole('link', { name: 'プライバシーポリシー' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/privacy');
  });

  it('footer要素としてレンダリングされる', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });
});
