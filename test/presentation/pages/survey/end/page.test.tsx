/**
 * 終了時アンケート画面のテスト
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EndSurveyPage from '@/app/survey/end/page';

// APIクライアントをモック
jest.mock('@/lib/api/client', () => ({
  surveyApiClient: {
    completeScenario: jest.fn(),
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

describe('EndSurveyPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (surveyApiClient.completeScenario as jest.Mock).mockResolvedValue({
      success: true,
      completedAt: '2026-01-04T12:00:00Z',
    });
  });

  describe('表示', () => {
    it('質問1（猫を飼いたい度合い）が表示される', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(
          screen.getByText('今、猫を飼いたいと思っていますか？')
        ).toBeInTheDocument();
      });
    });

    it('質問1の選択肢が表示される', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('とても飼いたい')).toBeInTheDocument();
        expect(screen.getByLabelText('やや飼いたい')).toBeInTheDocument();
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
        expect(screen.getByLabelText('あまり飼いたくない')).toBeInTheDocument();
        expect(screen.getByLabelText('飼うつもりはない')).toBeInTheDocument();
      });
    });

    it('質問2（気づきの有無）が表示される', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(
          screen.getByText('この体験で気づきはありましたか？')
        ).toBeInTheDocument();
      });
    });

    it('質問2の選択肢が表示される', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(
          screen.getByLabelText('新しい気づきがあった')
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText('知っていたが、実感できた')
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText('特に気づきはなかった')
        ).toBeInTheDocument();
      });
    });

    it('質問3（自由記述）が表示される', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(
          screen.getByText('気づいたことや感想があれば教えてください')
        ).toBeInTheDocument();
      });
    });

    it('自由記述のテキストエリアが表示される', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });

    it('「ホームに戻る」ボタンが表示される', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'ホームに戻る' })
        ).toBeInTheDocument();
      });
    });
  });

  describe('バリデーション', () => {
    it('質問1が未選択の場合、ボタンが無効化される', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'ホームに戻る' });
        expect(button).toBeDisabled();
      });
    });

    it('質問1のみ選択した場合、ボタンは無効のまま', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('迷っている'));

      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'ホームに戻る' });
        expect(button).toBeDisabled();
      });
    });

    it('質問2のみ選択した場合、ボタンは無効のまま', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(
          screen.getByLabelText('新しい気づきがあった')
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('新しい気づきがあった'));

      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'ホームに戻る' });
        expect(button).toBeDisabled();
      });
    });

    it('質問1と質問2を選択すると、ボタンが有効化される', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('迷っている'));
      fireEvent.click(screen.getByLabelText('新しい気づきがあった'));

      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'ホームに戻る' });
        expect(button).not.toBeDisabled();
      });
    });

    it('自由記述は任意なので未入力でもボタンは有効', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('迷っている'));
      fireEvent.click(screen.getByLabelText('新しい気づきがあった'));

      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'ホームに戻る' });
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('自由記述', () => {
    it('自由記述に入力できる', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'テスト入力です' } });

      expect(textarea).toHaveValue('テスト入力です');
    });

    it('自由記述の最大文字数が1000文字に制限される', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('maxLength', '1000');
    });
  });

  describe('送信', () => {
    it('送信時にAPIが呼ばれる', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('迷っている'));
      fireEvent.click(screen.getByLabelText('新しい気づきがあった'));
      fireEvent.click(screen.getByRole('button', { name: 'ホームに戻る' }));

      await waitFor(() => {
        expect(surveyApiClient.completeScenario).toHaveBeenCalledWith(
          'night-crying',
          '12345678-1234-4123-8123-123456789abc',
          {
            wantToCatLevel: 3,
            awareness: 'new',
          }
        );
      });
    });

    it('自由記述がAPIリクエストに含まれる', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('迷っている'));
      fireEvent.click(screen.getByLabelText('知っていたが、実感できた'));

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: '猫の大変さがわかりました' } });

      fireEvent.click(screen.getByRole('button', { name: 'ホームに戻る' }));

      await waitFor(() => {
        expect(surveyApiClient.completeScenario).toHaveBeenCalledWith(
          'night-crying',
          '12345678-1234-4123-8123-123456789abc',
          {
            wantToCatLevel: 3,
            awareness: 'realized',
            freeText: '猫の大変さがわかりました',
          }
        );
      });
    });

    it('送信成功後、ホーム画面へ遷移する', async () => {
      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('迷っている'));
      fireEvent.click(screen.getByLabelText('新しい気づきがあった'));
      fireEvent.click(screen.getByRole('button', { name: 'ホームに戻る' }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('送信中はボタンが無効化される', async () => {
      // API呼び出しを遅延させる
      (surveyApiClient.completeScenario as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('迷っている'));
      fireEvent.click(screen.getByLabelText('新しい気づきがあった'));
      fireEvent.click(screen.getByRole('button', { name: 'ホームに戻る' }));

      await waitFor(() => {
        const button = screen.getByRole('button', { name: '送信中...' });
        expect(button).toBeDisabled();
      });
    });

    it('送信失敗時にエラーメッセージが表示される', async () => {
      (surveyApiClient.completeScenario as jest.Mock).mockRejectedValue(
        new Error('送信に失敗しました')
      );

      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(screen.getByLabelText('迷っている')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('迷っている'));
      fireEvent.click(screen.getByLabelText('新しい気づきがあった'));
      fireEvent.click(screen.getByRole('button', { name: 'ホームに戻る' }));

      await waitFor(() => {
        expect(screen.getByText('送信に失敗しました')).toBeInTheDocument();
      });
    });
  });

  describe('セッションエラー', () => {
    it('セッションが見つからない場合、エラーメッセージが表示される', async () => {
      const { getSession } = require('@/lib/session/actions');
      (getSession as jest.Mock).mockResolvedValue(null);

      render(<EndSurveyPage />);

      await waitFor(() => {
        expect(
          screen.getByText('セッションが見つかりません。最初からやり直してください。')
        ).toBeInTheDocument();
      });
    });
  });
});
