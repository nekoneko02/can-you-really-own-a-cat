/**
 * シナリオ選択画面のテスト
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScenariosPage from '@/app/scenarios/page';

// useRouterをモック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('ScenariosPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('表示', () => {
    it('タイトルが表示される', () => {
      render(<ScenariosPage />);

      expect(
        screen.getByRole('heading', { name: 'シナリオを選んでください' })
      ).toBeInTheDocument();
    });

    it('シナリオ一覧が表示される', () => {
      render(<ScenariosPage />);

      expect(screen.getByText('夜泣き・睡眠不足')).toBeInTheDocument();
    });
  });

  describe('シナリオ選択', () => {
    it('シナリオカードをクリックすると詳細が展開される', () => {
      render(<ScenariosPage />);

      // カードをクリック
      const card = screen.getByRole('button', { name: /夜泣き・睡眠不足/ });
      fireEvent.click(card);

      // 詳細が表示される
      expect(
        screen.getByRole('button', { name: 'このシナリオを体験する' })
      ).toBeInTheDocument();
    });

    it('「このシナリオを体験する」ボタンをクリックするとアンケート画面へ遷移する', () => {
      render(<ScenariosPage />);

      // カードを展開
      const card = screen.getByRole('button', { name: /夜泣き・睡眠不足/ });
      fireEvent.click(card);

      // ボタンをクリック
      const startButton = screen.getByRole('button', {
        name: 'このシナリオを体験する',
      });
      fireEvent.click(startButton);

      expect(mockPush).toHaveBeenCalledWith('/survey/start');
    });
  });
});
