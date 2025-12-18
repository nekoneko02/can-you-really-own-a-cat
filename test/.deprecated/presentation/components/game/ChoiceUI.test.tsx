import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChoiceUI, type ChoiceData } from '@/presentation/components/game/ChoiceUI';

describe('ChoiceUI', () => {
  const mockChoices: ChoiceData[] = [
    { id: 'choice1', text: '餌をやる' },
    { id: 'choice2', text: '無視する' },
  ];

  const mockOnChoiceSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('選択肢がある場合', () => {
    it('すべての選択肢ボタンを表示する', () => {
      render(<ChoiceUI choices={mockChoices} onChoiceSelected={mockOnChoiceSelected} />);

      expect(screen.getByText('餌をやる')).toBeInTheDocument();
      expect(screen.getByText('無視する')).toBeInTheDocument();
    });

    it('ヘッダーテキストを表示する', () => {
      render(<ChoiceUI choices={mockChoices} onChoiceSelected={mockOnChoiceSelected} />);

      expect(screen.getByText('どうしますか？')).toBeInTheDocument();
    });

    it('選択肢ボタンがbutton要素として表示される', () => {
      render(<ChoiceUI choices={mockChoices} onChoiceSelected={mockOnChoiceSelected} />);

      const button1 = screen.getByText('餌をやる');
      const button2 = screen.getByText('無視する');

      expect(button1.tagName).toBe('BUTTON');
      expect(button2.tagName).toBe('BUTTON');
    });
  });

  describe('選択肢のクリック', () => {
    it('ボタンクリック時にonChoiceSelectedが正しいIDで呼ばれる', () => {
      render(<ChoiceUI choices={mockChoices} onChoiceSelected={mockOnChoiceSelected} />);

      const button1 = screen.getByText('餌をやる');
      fireEvent.click(button1);

      expect(mockOnChoiceSelected).toHaveBeenCalledTimes(1);
      expect(mockOnChoiceSelected).toHaveBeenCalledWith('choice1');
    });

    it('2番目のボタンクリック時に正しいIDで呼ばれる', () => {
      render(<ChoiceUI choices={mockChoices} onChoiceSelected={mockOnChoiceSelected} />);

      const button2 = screen.getByText('無視する');
      fireEvent.click(button2);

      expect(mockOnChoiceSelected).toHaveBeenCalledTimes(1);
      expect(mockOnChoiceSelected).toHaveBeenCalledWith('choice2');
    });
  });

  describe('disabledプロパティ', () => {
    it('disabled=trueの場合、ボタンが無効化される', () => {
      render(
        <ChoiceUI choices={mockChoices} onChoiceSelected={mockOnChoiceSelected} disabled={true} />
      );

      const button1 = screen.getByText('餌をやる');
      expect(button1).toBeDisabled();
    });

    it('disabled=trueの場合、クリックしてもコールバックが呼ばれない', () => {
      render(
        <ChoiceUI choices={mockChoices} onChoiceSelected={mockOnChoiceSelected} disabled={true} />
      );

      const button1 = screen.getByText('餌をやる');
      fireEvent.click(button1);

      expect(mockOnChoiceSelected).not.toHaveBeenCalled();
    });

    it('disabled=falseの場合、ボタンがクリック可能', () => {
      render(
        <ChoiceUI choices={mockChoices} onChoiceSelected={mockOnChoiceSelected} disabled={false} />
      );

      const button1 = screen.getByText('餌をやる');
      expect(button1).not.toBeDisabled();
    });
  });

  describe('選択肢が空の場合', () => {
    it('何も表示されない（nullを返す）', () => {
      const { container } = render(
        <ChoiceUI choices={[]} onChoiceSelected={mockOnChoiceSelected} />
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
