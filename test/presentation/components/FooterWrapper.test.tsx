/**
 * FooterWrapper コンポーネントのテスト
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FooterWrapper } from '@/components/FooterWrapper';

// next/navigation のモック
const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('FooterWrapper', () => {
  beforeEach(() => {
    mockUsePathname.mockReset();
  });

  it('/experience ページではフッターを表示しない', () => {
    mockUsePathname.mockReturnValue('/experience');

    const { container } = render(<FooterWrapper />);

    expect(container.querySelector('footer')).not.toBeInTheDocument();
  });

  it('/ ページではフッターを表示する', () => {
    mockUsePathname.mockReturnValue('/');

    render(<FooterWrapper />);

    const link = screen.getByRole('link', { name: 'プライバシーポリシー' });
    expect(link).toBeInTheDocument();
  });

  it('/privacy ページではフッターを表示する', () => {
    mockUsePathname.mockReturnValue('/privacy');

    render(<FooterWrapper />);

    const link = screen.getByRole('link', { name: 'プライバシーポリシー' });
    expect(link).toBeInTheDocument();
  });

  it('/scenarios ページではフッターを表示する', () => {
    mockUsePathname.mockReturnValue('/scenarios');

    render(<FooterWrapper />);

    const link = screen.getByRole('link', { name: 'プライバシーポリシー' });
    expect(link).toBeInTheDocument();
  });

  it('/survey/start ページではフッターを表示する', () => {
    mockUsePathname.mockReturnValue('/survey/start');

    render(<FooterWrapper />);

    const link = screen.getByRole('link', { name: 'プライバシーポリシー' });
    expect(link).toBeInTheDocument();
  });

  it('/nightcry-report ページではフッターを表示する', () => {
    mockUsePathname.mockReturnValue('/nightcry-report');

    render(<FooterWrapper />);

    const link = screen.getByRole('link', { name: 'プライバシーポリシー' });
    expect(link).toBeInTheDocument();
  });
});
