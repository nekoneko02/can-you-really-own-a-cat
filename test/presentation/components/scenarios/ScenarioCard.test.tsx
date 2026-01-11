/**
 * シナリオカードコンポーネントのテスト
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScenarioCard } from '@/components/scenarios/ScenarioCard';
import { ScenarioMetadata } from '@/domain/scenarios/scenarioRegistry';

const mockScenario: ScenarioMetadata = {
  id: 'nightcry',
  title: '夜泣き・睡眠不足',
  shortDescription: '猫の夜泣きを5日間体験...',
  fullDescription:
    '猫を迎えて数週間。ある夜、鳴き声で目が覚めた——この体験では、夜泣きによる睡眠不足がどのように日常に影響するかを体験します。',
  estimatedTime: '約5〜10分',
  theme: '睡眠',
  icon: 'moon',
};

describe('ScenarioCard', () => {
  const mockOnStart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('閉じた状態', () => {
    it('タイトルが表示される', () => {
      render(<ScenarioCard scenario={mockScenario} onStart={mockOnStart} />);

      expect(screen.getByText('夜泣き・睡眠不足')).toBeInTheDocument();
    });

    it('短い説明が表示される', () => {
      render(<ScenarioCard scenario={mockScenario} onStart={mockOnStart} />);

      expect(screen.getByText('猫の夜泣きを5日間体験...')).toBeInTheDocument();
    });

    it('詳細説明は表示されない', () => {
      render(<ScenarioCard scenario={mockScenario} onStart={mockOnStart} />);

      expect(
        screen.queryByText(/夜泣きによる睡眠不足がどのように日常に影響するか/)
      ).not.toBeInTheDocument();
    });

    it('「このシナリオを体験する」ボタンは表示されない', () => {
      render(<ScenarioCard scenario={mockScenario} onStart={mockOnStart} />);

      expect(
        screen.queryByRole('button', { name: 'このシナリオを体験する' })
      ).not.toBeInTheDocument();
    });
  });

  describe('開いた状態', () => {
    it('カードをクリックすると詳細が展開される', () => {
      render(<ScenarioCard scenario={mockScenario} onStart={mockOnStart} />);

      // カードをクリック
      const card = screen.getByRole('button', { name: /夜泣き・睡眠不足/ });
      fireEvent.click(card);

      // 詳細説明が表示される
      expect(
        screen.getByText(/夜泣きによる睡眠不足がどのように日常に影響するか/)
      ).toBeInTheDocument();
    });

    it('展開時に所要時間が表示される', () => {
      render(<ScenarioCard scenario={mockScenario} onStart={mockOnStart} />);

      const card = screen.getByRole('button', { name: /夜泣き・睡眠不足/ });
      fireEvent.click(card);

      expect(screen.getByText(/約5〜10分/)).toBeInTheDocument();
    });

    it('展開時に「このシナリオを体験する」ボタンが表示される', () => {
      render(<ScenarioCard scenario={mockScenario} onStart={mockOnStart} />);

      const card = screen.getByRole('button', { name: /夜泣き・睡眠不足/ });
      fireEvent.click(card);

      expect(
        screen.getByRole('button', { name: 'このシナリオを体験する' })
      ).toBeInTheDocument();
    });

    it('「このシナリオを体験する」ボタンをクリックするとonStartが呼ばれる', () => {
      render(<ScenarioCard scenario={mockScenario} onStart={mockOnStart} />);

      // カードを展開
      const card = screen.getByRole('button', { name: /夜泣き・睡眠不足/ });
      fireEvent.click(card);

      // ボタンをクリック
      const startButton = screen.getByRole('button', {
        name: 'このシナリオを体験する',
      });
      fireEvent.click(startButton);

      expect(mockOnStart).toHaveBeenCalledWith('nightcry');
    });

    it('展開されたカードを再度クリックすると閉じる', () => {
      render(<ScenarioCard scenario={mockScenario} onStart={mockOnStart} />);

      // カードを展開
      const card = screen.getByRole('button', { name: /夜泣き・睡眠不足/ });
      fireEvent.click(card);

      // 詳細が表示されていることを確認
      expect(
        screen.getByText(/夜泣きによる睡眠不足がどのように日常に影響するか/)
      ).toBeInTheDocument();

      // 再度クリックして閉じる
      fireEvent.click(card);

      // 詳細が非表示になる
      expect(
        screen.queryByText(/夜泣きによる睡眠不足がどのように日常に影響するか/)
      ).not.toBeInTheDocument();
    });
  });
});
