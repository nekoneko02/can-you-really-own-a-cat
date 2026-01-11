/**
 * ホーム画面のテスト
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '@/app/page';

// useRouterをモック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('表示', () => {
    it('タイトルが表示される', () => {
      render(<HomePage />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        '君はねこを飼えるか？'
      );
    });

    it('タグラインが表示される', () => {
      render(<HomePage />);

      expect(screen.getByText('飼う前に、猫を知ろう')).toBeInTheDocument();
    });

    it('コンセプトテキストが表示される', () => {
      render(<HomePage />);

      expect(
        screen.getByText('猫を飼うか迷っていますか？')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/夜中の鳴き声、突然の病院代、毎日のお世話/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/飼ってから気づく日常を、ここで体験してみてください。/)
      ).toBeInTheDocument();
    });

    it('強調メッセージが表示される', () => {
      render(<HomePage />);

      expect(
        screen.getByText('飼った後に後悔しないために。')
      ).toBeInTheDocument();
    });

    it('CTAボタンが表示される', () => {
      render(<HomePage />);

      expect(
        screen.getByRole('button', { name: 'はじめる' })
      ).toBeInTheDocument();
    });

    it('猫のイラスト領域が表示される', () => {
      render(<HomePage />);

      // 猫のイラスト用のimg要素またはプレースホルダーが存在することを確認
      const catImage = screen.getByRole('img', { name: /猫/ });
      expect(catImage).toBeInTheDocument();
    });
  });

  describe('CTA遷移', () => {
    it('「はじめる」ボタンをクリックするとシナリオ選択画面へ遷移する', () => {
      render(<HomePage />);

      const startButton = screen.getByRole('button', { name: 'はじめる' });
      fireEvent.click(startButton);

      expect(mockPush).toHaveBeenCalledWith('/scenarios');
    });
  });
});
