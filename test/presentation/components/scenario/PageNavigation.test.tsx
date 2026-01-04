import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PageNavigation } from '@/components/scenario/PageNavigation';

describe('PageNavigation', () => {
  const mockOnNext = jest.fn();
  const mockOnSkip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ページ送り', () => {
    it('Enterキーでページ送りされる', () => {
      render(
        <PageNavigation
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          isTextComplete={true}
        />
      );

      fireEvent.keyDown(document, { key: 'Enter' });

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it('クリックでページ送りされる', () => {
      render(
        <PageNavigation
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          isTextComplete={true}
        />
      );

      fireEvent.click(screen.getByTestId('page-navigation'));

      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('スキップ機能', () => {
    it('テキスト表示中にEnterキーでスキップされる', () => {
      render(
        <PageNavigation
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          isTextComplete={false}
        />
      );

      fireEvent.keyDown(document, { key: 'Enter' });

      expect(mockOnSkip).toHaveBeenCalledTimes(1);
      expect(mockOnNext).not.toHaveBeenCalled();
    });

    it('テキスト表示中にクリックでスキップされる', () => {
      render(
        <PageNavigation
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          isTextComplete={false}
        />
      );

      fireEvent.click(screen.getByTestId('page-navigation'));

      expect(mockOnSkip).toHaveBeenCalledTimes(1);
      expect(mockOnNext).not.toHaveBeenCalled();
    });
  });

  describe('表示', () => {
    it('テキスト表示完了時は「次へ」インジケータが表示される', () => {
      render(
        <PageNavigation
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          isTextComplete={true}
        />
      );

      expect(screen.getByTestId('next-indicator')).toBeInTheDocument();
    });

    it('テキスト表示中は「スキップ」インジケータが表示されない（またはテキストが異なる）', () => {
      render(
        <PageNavigation
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          isTextComplete={false}
        />
      );

      // テキスト表示中はインジケータを非表示
      expect(screen.queryByTestId('next-indicator')).not.toBeInTheDocument();
    });
  });

  describe('無効化', () => {
    it('disabled=trueの場合、操作が無効になる', () => {
      render(
        <PageNavigation
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          isTextComplete={true}
          disabled={true}
        />
      );

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.click(screen.getByTestId('page-navigation'));

      expect(mockOnNext).not.toHaveBeenCalled();
      expect(mockOnSkip).not.toHaveBeenCalled();
    });
  });
});
