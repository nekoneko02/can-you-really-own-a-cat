/**
 * シナリオ説明画面のテスト
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IntroPage from '@/app/nightcry/intro/page';

// useRouterをモック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('IntroPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('表示', () => {
    it('タイトルが表示される', () => {
      render(<IntroPage />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        '夜泣き・睡眠不足'
      );
    });

    it('サブタイトルが表示される', () => {
      render(<IntroPage />);

      expect(screen.getByText('ある飼い主の体験')).toBeInTheDocument();
    });

    it('体験の前提が表示される', () => {
      render(<IntroPage />);

      expect(
        screen.getByText(
          'あなたは架空の猫の飼い主として、日常を体験します。'
        )
      ).toBeInTheDocument();
    });

    it('概要が表示される', () => {
      render(<IntroPage />);

      expect(screen.getByText(/猫を迎えて数週間。/)).toBeInTheDocument();
      expect(
        screen.getByText(/ある夜、鳴き声で目が覚めた/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/夜泣きによる睡眠不足がどのように日常に影響するかを体験します。/)
      ).toBeInTheDocument();
    });

    it('所要時間が表示される', () => {
      render(<IntroPage />);

      expect(screen.getByText(/約5〜10分/)).toBeInTheDocument();
    });

    it('注意事項が表示される', () => {
      render(<IntroPage />);

      expect(screen.getByText(/音声が流れます/)).toBeInTheDocument();
    });

    it('CTAボタンが表示される', () => {
      render(<IntroPage />);

      expect(
        screen.getByRole('button', { name: '体験をはじめる' })
      ).toBeInTheDocument();
    });
  });

  describe('CTA遷移', () => {
    it('「体験をはじめる」ボタンをクリックすると開始時アンケートへ遷移する', () => {
      render(<IntroPage />);

      const startButton = screen.getByRole('button', { name: '体験をはじめる' });
      fireEvent.click(startButton);

      expect(mockPush).toHaveBeenCalledWith('/nightcry/survey/start');
    });
  });
});
