import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { TextDisplay } from '@/components/scenario/TextDisplay';

describe('TextDisplay', () => {
  const mockOnComplete = jest.fn();
  const mockOnNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ヘルパー: 指定文字数分のタイマーを進める
  const advanceTextByChars = (charCount: number, speed: number = 50) => {
    for (let i = 0; i < charCount; i++) {
      act(() => {
        jest.advanceTimersByTime(speed);
      });
    }
  };

  describe('ストリーミング表示', () => {
    it('テキストが1文字ずつ表示される', () => {
      render(
        <TextDisplay
          text="Hello"
          onComplete={mockOnComplete}
          onNext={mockOnNext}
        />
      );

      // 初期状態では空
      expect(screen.getByTestId('text-display')).toHaveTextContent('');

      // 50ms後に1文字目
      advanceTextByChars(1);
      expect(screen.getByTestId('text-display')).toHaveTextContent('H');

      // さらに50msで2文字目
      advanceTextByChars(1);
      expect(screen.getByTestId('text-display')).toHaveTextContent('He');
    });

    it('全文表示完了後にonCompleteが呼ばれる', () => {
      render(
        <TextDisplay
          text="Hi"
          onComplete={mockOnComplete}
          onNext={mockOnNext}
        />
      );

      // 2文字分進める
      advanceTextByChars(2);

      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('スキップ機能', () => {
    it('表示中にEnterキーで全文が即時表示される', () => {
      render(
        <TextDisplay
          text="Hello World"
          onComplete={mockOnComplete}
          onNext={mockOnNext}
        />
      );

      // 少し時間を進める（部分表示状態）
      advanceTextByChars(2);

      // Enterキーでスキップ
      act(() => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      expect(screen.getByTestId('text-display')).toHaveTextContent('Hello World');
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it('表示中にクリックで全文が即時表示される', () => {
      render(
        <TextDisplay
          text="Hello World"
          onComplete={mockOnComplete}
          onNext={mockOnNext}
        />
      );

      // 少し時間を進める
      advanceTextByChars(2);

      // クリックでスキップ
      act(() => {
        fireEvent.click(screen.getByTestId('text-display'));
      });

      expect(screen.getByTestId('text-display')).toHaveTextContent('Hello World');
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('次ページへの遷移', () => {
    it('全文表示後にEnterキーでonNextが呼ばれる', () => {
      render(
        <TextDisplay
          text="Hi"
          onComplete={mockOnComplete}
          onNext={mockOnNext}
        />
      );

      // 全文表示 (2文字)
      advanceTextByChars(2);

      // Enterキーで次へ
      act(() => {
        fireEvent.keyDown(document, { key: 'Enter' });
      });

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it('全文表示後にクリックでonNextが呼ばれる', () => {
      render(
        <TextDisplay
          text="Hi"
          onComplete={mockOnComplete}
          onNext={mockOnNext}
        />
      );

      // 全文表示 (2文字)
      advanceTextByChars(2);

      // クリックで次へ
      act(() => {
        fireEvent.click(screen.getByTestId('text-display'));
      });

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('テキスト変更時', () => {
    it('新しいテキストが設定されると最初からストリーミングが始まる', () => {
      const { rerender } = render(
        <TextDisplay
          text="Hi"
          onComplete={mockOnComplete}
          onNext={mockOnNext}
        />
      );

      // 全文表示 (2文字)
      advanceTextByChars(2);
      expect(screen.getByTestId('text-display')).toHaveTextContent('Hi');

      // 新しいテキスト
      rerender(
        <TextDisplay
          text="Bye"
          onComplete={mockOnComplete}
          onNext={mockOnNext}
        />
      );

      // リセットされて最初から
      expect(screen.getByTestId('text-display')).toHaveTextContent('');

      advanceTextByChars(1);
      expect(screen.getByTestId('text-display')).toHaveTextContent('B');
    });
  });

  describe('表示速度', () => {
    it('デフォルトの表示速度は50ms/文字', () => {
      render(
        <TextDisplay
          text="ABC"
          onComplete={mockOnComplete}
          onNext={mockOnNext}
        />
      );

      // 49ms後はまだ0文字
      act(() => {
        jest.advanceTimersByTime(49);
      });
      expect(screen.getByTestId('text-display')).toHaveTextContent('');

      // 50ms後に1文字
      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(screen.getByTestId('text-display')).toHaveTextContent('A');
    });
  });
});
