import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChoicePanel, Choice } from '@/components/scenario/ChoicePanel';

describe('ChoicePanel', () => {
  const mockOnSelect = jest.fn();

  const mockChoices: Choice[] = [
    { id: 'choice1', text: '餌をやる' },
    { id: 'choice2', text: '無視する' },
    { id: 'choice3', text: '様子を見る' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('選択肢の表示', () => {
    it('すべての選択肢を表示する', () => {
      render(<ChoicePanel choices={mockChoices} onSelect={mockOnSelect} />);

      expect(screen.getByText('餌をやる')).toBeInTheDocument();
      expect(screen.getByText('無視する')).toBeInTheDocument();
      expect(screen.getByText('様子を見る')).toBeInTheDocument();
    });

    it('選択肢はbutton要素として表示される', () => {
      render(<ChoicePanel choices={mockChoices} onSelect={mockOnSelect} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    it('最大3つまでの選択肢を表示する', () => {
      const manyChoices: Choice[] = [
        { id: '1', text: '選択肢1' },
        { id: '2', text: '選択肢2' },
        { id: '3', text: '選択肢3' },
        { id: '4', text: '選択肢4' },
      ];

      render(<ChoicePanel choices={manyChoices} onSelect={mockOnSelect} />);

      // 最初の3つだけ表示
      expect(screen.getByText('選択肢1')).toBeInTheDocument();
      expect(screen.getByText('選択肢2')).toBeInTheDocument();
      expect(screen.getByText('選択肢3')).toBeInTheDocument();
      expect(screen.queryByText('選択肢4')).not.toBeInTheDocument();
    });
  });

  describe('選択肢のクリック', () => {
    it('選択肢クリック時にonSelectが正しいIDで呼ばれる', () => {
      render(<ChoicePanel choices={mockChoices} onSelect={mockOnSelect} />);

      fireEvent.click(screen.getByText('餌をやる'));

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith('choice1');
    });

    it('2番目の選択肢をクリックすると正しいIDで呼ばれる', () => {
      render(<ChoicePanel choices={mockChoices} onSelect={mockOnSelect} />);

      fireEvent.click(screen.getByText('無視する'));

      expect(mockOnSelect).toHaveBeenCalledWith('choice2');
    });
  });

  describe('表示/非表示', () => {
    it('visible=falseの場合、何も表示されない', () => {
      const { container } = render(
        <ChoicePanel choices={mockChoices} onSelect={mockOnSelect} visible={false} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('visible=trueの場合、選択肢が表示される', () => {
      render(
        <ChoicePanel choices={mockChoices} onSelect={mockOnSelect} visible={true} />
      );

      expect(screen.getByText('餌をやる')).toBeInTheDocument();
    });

    it('visibleが指定されない場合はデフォルトでtrue', () => {
      render(<ChoicePanel choices={mockChoices} onSelect={mockOnSelect} />);

      expect(screen.getByText('餌をやる')).toBeInTheDocument();
    });
  });

  describe('選択肢が空の場合', () => {
    it('何も表示されない', () => {
      const { container } = render(
        <ChoicePanel choices={[]} onSelect={mockOnSelect} />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('スタイル', () => {
    it('パネルに適切なクラスが適用される', () => {
      render(<ChoicePanel choices={mockChoices} onSelect={mockOnSelect} />);

      const panel = screen.getByTestId('choice-panel');
      expect(panel).toHaveClass('choice-panel');
    });
  });
});
