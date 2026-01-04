/**
 * 開始時アンケート画面のテスト
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StartSurveyPage from '@/app/nightcry/survey/start/page';

// APIクライアントをモック
jest.mock('@/lib/api/client', () => ({
  surveyApiClient: {
    startScenario: jest.fn(),
  },
}));

// useRouterをモック
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// セッションActionsをモック
jest.mock('@/lib/session/actions', () => ({
  getSession: jest.fn().mockResolvedValue({
    sessionId: '12345678-1234-4123-8123-123456789abc',
    scenarioSlug: 'night-crying',
  }),
}));

import { surveyApiClient } from '@/lib/api/client';

describe('StartSurveyPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (surveyApiClient.startScenario as jest.Mock).mockResolvedValue({
      success: true,
      startedAt: '2026-01-04T12:00:00Z',
    });
  });

  describe('表示', () => {
    it('質問1が表示される', async () => {
      render(<StartSurveyPage />);

      await waitFor(() => {
        expect(
          screen.getByText('今、猫を飼いたいと思っていますか？')
        ).toBeInTheDocument();
      });
    });

    it('質問1の選択肢が表示される', async () => {
      render(<StartSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('とても飼いたい')).toBeInTheDocument();
        expect(screen.getByLabelText('やや飼いたい')).toBeInTheDocument();
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
        expect(screen.getByLabelText('あまり飼いたくない')).toBeInTheDocument();
        expect(screen.getByLabelText('飼うつもりはない')).toBeInTheDocument();
      });
    });

    it('質問2が表示される', async () => {
      render(<StartSurveyPage />);

      await waitFor(() => {
        expect(
          screen.getByText('この体験に期待することは？')
        ).toBeInTheDocument();
      });
    });

    it('質問2の選択肢が表示される', async () => {
      render(<StartSurveyPage />);

      await waitFor(() => {
        expect(
          screen.getByLabelText('飼育の大変さを知りたい')
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText('猫との生活をイメージしたい')
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText('飼う前に気づきを得たい')
        ).toBeInTheDocument();
        expect(screen.getByLabelText('その他')).toBeInTheDocument();
      });
    });

    it('「次へ」ボタンが表示される', async () => {
      render(<StartSurveyPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '次へ' })).toBeInTheDocument();
      });
    });
  });

  describe('バリデーション', () => {
    it('質問1が未選択の場合、「次へ」ボタンが無効化される', async () => {
      render(<StartSurveyPage />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: '次へ' });
        expect(button).toBeDisabled();
      });
    });

    it('質問1を選択すると、「次へ」ボタンが有効化される', async () => {
      render(<StartSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('迷っている'));

      await waitFor(() => {
        const button = screen.getByRole('button', { name: '次へ' });
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('送信', () => {
    it('送信時にAPIが呼ばれる', async () => {
      render(<StartSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('迷っている'));
      fireEvent.click(screen.getByRole('button', { name: '次へ' }));

      await waitFor(() => {
        expect(surveyApiClient.startScenario).toHaveBeenCalledWith(
          'night-crying',
          '12345678-1234-4123-8123-123456789abc',
          {
            wantToCatLevel: 3,
            expectations: [],
          }
        );
      });
    });

    it('質問2の選択がAPIリクエストに含まれる', async () => {
      render(<StartSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('迷っている'));
      fireEvent.click(screen.getByLabelText('飼育の大変さを知りたい'));
      fireEvent.click(screen.getByLabelText('猫との生活をイメージしたい'));
      fireEvent.click(screen.getByRole('button', { name: '次へ' }));

      await waitFor(() => {
        expect(surveyApiClient.startScenario).toHaveBeenCalledWith(
          'night-crying',
          '12345678-1234-4123-8123-123456789abc',
          {
            wantToCatLevel: 3,
            expectations: [
              '飼育の大変さを知りたい',
              '猫との生活をイメージしたい',
            ],
          }
        );
      });
    });

    it('送信成功後、シナリオ体験へ遷移する', async () => {
      render(<StartSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('迷っている'));
      fireEvent.click(screen.getByRole('button', { name: '次へ' }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/nightcry/experience');
      });
    });
  });
});
