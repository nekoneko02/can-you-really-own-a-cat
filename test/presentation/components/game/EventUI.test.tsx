import React from 'react';
import { render, screen } from '@testing-library/react';
import { EventUI, type EventData } from '@/presentation/components/game/EventUI';

describe('EventUI', () => {
  const mockEvent: EventData = {
    id: 'event1',
    title: '朝の餌やり',
    description: '猫がお腹を空かせて鳴いている。餌をあげますか?',
  };

  describe('イベントデータがある場合', () => {
    it('タイトルと説明文を表示する', () => {
      render(<EventUI event={mockEvent} />);

      expect(screen.getByText('朝の餌やり')).toBeInTheDocument();
      expect(screen.getByText('猫がお腹を空かせて鳴いている。餌をあげますか?')).toBeInTheDocument();
    });

    it('タイトルがh2要素で表示される', () => {
      render(<EventUI event={mockEvent} />);

      const title = screen.getByText('朝の餌やり');
      expect(title.tagName).toBe('H2');
    });

    it('説明文がp要素で表示される', () => {
      render(<EventUI event={mockEvent} />);

      const description = screen.getByText('猫がお腹を空かせて鳴いている。餌をあげますか?');
      expect(description.tagName).toBe('P');
    });
  });

  describe('イベントデータがnullの場合', () => {
    it('読み込み中メッセージを表示する', () => {
      render(<EventUI event={null} />);

      expect(screen.getByText('イベント読み込み中...')).toBeInTheDocument();
    });

    it('タイトルと説明文は表示されない', () => {
      render(<EventUI event={null} />);

      expect(screen.queryByText('朝の餌やり')).not.toBeInTheDocument();
    });
  });

  describe('スタイリング', () => {
    it('適切なCSSクラスが適用されている', () => {
      const { container } = render(<EventUI event={mockEvent} />);

      const eventContainer = container.querySelector('.p-6');
      expect(eventContainer).toBeInTheDocument();
    });
  });
});
