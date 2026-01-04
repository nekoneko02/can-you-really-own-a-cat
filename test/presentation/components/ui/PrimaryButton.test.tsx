import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

describe('PrimaryButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本表示', () => {
    it('ボタンテキストを表示する', () => {
      render(<PrimaryButton onClick={mockOnClick}>テストボタン</PrimaryButton>);

      expect(screen.getByText('テストボタン')).toBeInTheDocument();
    });

    it('button要素として表示される', () => {
      render(<PrimaryButton onClick={mockOnClick}>ボタン</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('クリックイベント', () => {
    it('クリック時にonClickが呼ばれる', () => {
      render(<PrimaryButton onClick={mockOnClick}>ボタン</PrimaryButton>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabledプロパティ', () => {
    it('disabled=trueの場合、ボタンが無効化される', () => {
      render(
        <PrimaryButton onClick={mockOnClick} disabled={true}>
          ボタン
        </PrimaryButton>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('disabled=trueの場合、クリックしてもコールバックが呼ばれない', () => {
      render(
        <PrimaryButton onClick={mockOnClick} disabled={true}>
          ボタン
        </PrimaryButton>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('disabled=falseの場合、ボタンがクリック可能', () => {
      render(
        <PrimaryButton onClick={mockOnClick} disabled={false}>
          ボタン
        </PrimaryButton>
      );

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('スタイル', () => {
    it('適切なクラス名が適用される', () => {
      render(<PrimaryButton onClick={mockOnClick}>ボタン</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('primary-button');
    });
  });
});
