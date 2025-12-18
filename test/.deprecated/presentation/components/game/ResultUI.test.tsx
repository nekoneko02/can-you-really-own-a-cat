import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultUI, type ResultData } from '@/presentation/components/game/ResultUI';

describe('ResultUI', () => {
  const mockResult: ResultData = {
    text: '猫は嬉しそうに餌を食べた',
  };

  const mockOnNextClicked = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('結果データがある場合', () => {
    it('結果テキストを表示する', () => {
      render(<ResultUI result={mockResult} onNextClicked={mockOnNextClicked} />);

      expect(screen.getByText('猫は嬉しそうに餌を食べた')).toBeInTheDocument();
    });

    it('タイトル「結果」を表示する', () => {
      render(<ResultUI result={mockResult} onNextClicked={mockOnNextClicked} />);

      expect(screen.getByText('結果')).toBeInTheDocument();
    });

    it('次へボタンを表示する', () => {
      render(<ResultUI result={mockResult} onNextClicked={mockOnNextClicked} />);

      const nextButton = screen.getByText('次へ →');
      expect(nextButton).toBeInTheDocument();
      expect(nextButton.tagName).toBe('BUTTON');
    });

    it('✨絵文字を表示する', () => {
      render(<ResultUI result={mockResult} onNextClicked={mockOnNextClicked} />);

      expect(screen.getByText('✨')).toBeInTheDocument();
    });
  });

  describe('次へボタンのクリック', () => {
    it('ボタンクリック時にonNextClickedが呼ばれる', () => {
      render(<ResultUI result={mockResult} onNextClicked={mockOnNextClicked} />);

      const nextButton = screen.getByText('次へ →');
      fireEvent.click(nextButton);

      expect(mockOnNextClicked).toHaveBeenCalledTimes(1);
    });

    it('複数回クリックした場合、その回数分呼ばれる', () => {
      render(<ResultUI result={mockResult} onNextClicked={mockOnNextClicked} />);

      const nextButton = screen.getByText('次へ →');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      expect(mockOnNextClicked).toHaveBeenCalledTimes(2);
    });
  });

  describe('disabledプロパティ', () => {
    it('disabled=trueの場合、ボタンが無効化される', () => {
      render(<ResultUI result={mockResult} onNextClicked={mockOnNextClicked} disabled={true} />);

      const nextButton = screen.getByText('次へ →');
      expect(nextButton).toBeDisabled();
    });

    it('disabled=trueの場合、クリックしてもコールバックが呼ばれない', () => {
      render(<ResultUI result={mockResult} onNextClicked={mockOnNextClicked} disabled={true} />);

      const nextButton = screen.getByText('次へ →');
      fireEvent.click(nextButton);

      expect(mockOnNextClicked).not.toHaveBeenCalled();
    });

    it('disabled=falseの場合、ボタンがクリック可能', () => {
      render(<ResultUI result={mockResult} onNextClicked={mockOnNextClicked} disabled={false} />);

      const nextButton = screen.getByText('次へ →');
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('結果データがnullの場合', () => {
    it('何も表示されない（nullを返す）', () => {
      const { container } = render(<ResultUI result={null} onNextClicked={mockOnNextClicked} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('スタイリング', () => {
    it('適切なCSSクラスが適用されている', () => {
      const { container } = render(
        <ResultUI result={mockResult} onNextClicked={mockOnNextClicked} />
      );

      const resultContainer = container.querySelector('.bg-green-50');
      expect(resultContainer).toBeInTheDocument();
    });
  });
});
