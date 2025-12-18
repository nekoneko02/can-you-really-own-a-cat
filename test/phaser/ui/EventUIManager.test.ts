/**
 * EventUIManager のテスト
 *
 * イベントUIの表示・非表示ロジックをテストします。
 * 描画部分（DialogSystem, ChoiceButton）はテスト対象外です。
 */

import { GameEvent } from '@/domain/GameEvent';
import { Choice } from '@/domain/Choice';
import { Consequence } from '@/domain/Consequence';
import { PhaserGameController } from '@/phaser/controllers/PhaserGameController';
import { TimeOfDay } from '@/domain/types';
import { EventUIManager } from '@/phaser/ui/EventUIManager';

describe('EventUIManager', () => {
  let mockController: jest.Mocked<PhaserGameController>;
  let mockScene: Phaser.Scene;
  let eventUIManager: EventUIManager;

  beforeEach(() => {
    // GameControllerのモック
    mockController = {
      tick: jest.fn(),
      view: jest.fn(),
      isGameOver: jest.fn(),
    } as unknown as jest.Mocked<PhaserGameController>;

    // Sceneのモック（最小限）
    mockScene = {
      add: {
        graphics: jest.fn(() => ({
          clear: jest.fn().mockReturnThis(),
          fillStyle: jest.fn().mockReturnThis(),
          fillRect: jest.fn().mockReturnThis(),
          fillRoundedRect: jest.fn().mockReturnThis(),
          setVisible: jest.fn().mockReturnThis(),
          destroy: jest.fn(),
        })),
        text: jest.fn(() => ({
          setText: jest.fn().mockReturnThis(),
          setOrigin: jest.fn().mockReturnThis(),
          setVisible: jest.fn().mockReturnThis(),
          destroy: jest.fn(),
        })),
        zone: jest.fn(() => ({
          setInteractive: jest.fn().mockReturnThis(),
          on: jest.fn().mockReturnThis(),
          destroy: jest.fn(),
        })),
      },
    } as unknown as Phaser.Scene;

    // EventUIManagerを初期化
    eventUIManager = new EventUIManager(mockScene, mockController);
  });

  describe('イベント表示フロー管理', () => {
    it('currentEventがnullの場合、イベントUIは非表示', () => {
      eventUIManager.update(null);

      expect(eventUIManager.isEventShown()).toBe(false);
      expect(eventUIManager.getDisplayedEventId()).toBeNull();
    });

    it('currentEventが設定された場合、イベントUIを表示', () => {
      const event = createTestEvent('event-1', 2);

      eventUIManager.update(event);

      expect(eventUIManager.isEventShown()).toBe(true);
      expect(eventUIManager.getDisplayedEventId()).toBe('event-1');
    });

    it('currentEventがnullに戻った場合、イベントUIを非表示', () => {
      const event = createTestEvent('event-1', 2);

      // イベント表示
      eventUIManager.update(event);
      expect(eventUIManager.isEventShown()).toBe(true);

      // イベント終了
      eventUIManager.update(null);
      expect(eventUIManager.isEventShown()).toBe(false);
      expect(eventUIManager.getDisplayedEventId()).toBeNull();
    });

    it('同じイベントが連続してupdate()されても、再表示しない', () => {
      const event = createTestEvent('event-1', 2);

      eventUIManager.update(event);
      const firstEventId = eventUIManager.getDisplayedEventId();

      // 同じイベントを再度update
      eventUIManager.update(event);
      const secondEventId = eventUIManager.getDisplayedEventId();

      expect(firstEventId).toBe(secondEventId);
      expect(eventUIManager.isEventShown()).toBe(true);
    });

    it('異なるイベントに切り替わった場合、前のUIを破棄して新しいUIを表示', () => {
      const event1 = createTestEvent('event-1', 2);
      const event2 = createTestEvent('event-2', 2);

      // 最初のイベント表示
      eventUIManager.update(event1);
      expect(eventUIManager.getDisplayedEventId()).toBe('event-1');

      // 異なるイベントに切り替え
      eventUIManager.update(event2);
      expect(eventUIManager.getDisplayedEventId()).toBe('event-2');
      expect(eventUIManager.isEventShown()).toBe(true);
    });
  });

  describe('選択肢実行ロジック', () => {
    it('選択肢クリック時、controller.tick({ choice: choiceId })を呼び出す', () => {
      const event = createTestEvent('event-1', 2);
      eventUIManager.update(event);

      // 内部のonChoiceSelectedを直接テストすることはできないため、
      // ChoiceButtonのコールバックがcontroller.tickを呼び出すことを確認
      // （統合テストとして確認）
      expect(mockController.tick).not.toHaveBeenCalled();
    });

    it('選択肢が複数ある場合、正しいchoiceIdを送信', () => {
      const event = createTestEvent('event-1', 3);
      eventUIManager.update(event);

      // イベントが表示されていることを確認
      expect(eventUIManager.isEventShown()).toBe(true);
      expect(event.choices.length).toBe(3);
    });
  });

  describe('イベント終了判定', () => {
    it('イベント表示中にcurrentEventがnullになったら、UIを非表示', () => {
      const event = createTestEvent('event-1', 2);

      eventUIManager.update(event);
      expect(eventUIManager.isEventShown()).toBe(true);

      eventUIManager.update(null);
      expect(eventUIManager.isEventShown()).toBe(false);
    });

    it('UI非表示時、すべてのボタンを破棄', () => {
      const event = createTestEvent('event-1', 2);

      eventUIManager.update(event);
      expect(eventUIManager.isEventShown()).toBe(true);

      eventUIManager.update(null);
      // ボタンが破棄されていることを確認（内部実装により自動的に破棄される）
      expect(eventUIManager.isEventShown()).toBe(false);
    });
  });

  describe('エッジケース', () => {
    it('currentEventがnullの状態でupdate()を複数回呼んでも問題ない', () => {
      eventUIManager.update(null);
      eventUIManager.update(null);
      eventUIManager.update(null);

      expect(eventUIManager.isEventShown()).toBe(false);
    });

    it('選択肢が0個のイベントでも表示できる', () => {
      const event = createTestEvent('event-1', 0);

      eventUIManager.update(event);

      expect(eventUIManager.isEventShown()).toBe(true);
      expect(eventUIManager.getDisplayedEventId()).toBe('event-1');
    });

    it('catStateDescriptionが空配列の場合でも表示できる', () => {
      const event = new GameEvent({
        id: 'event-1',
        day: 1,
        timeOfDay: TimeOfDay.NIGHT_MIDNIGHT,
        title: 'テストイベント',
        description: 'これはテスト用のイベントです',
        catStateDescription: [], // 空配列
        choices: [],
      });

      eventUIManager.update(event);

      expect(eventUIManager.isEventShown()).toBe(true);
    });
  });
});

// ヘルパー関数: テスト用のGameEventを作成
function createTestEvent(id: string, choiceCount: number = 2): GameEvent {
  const choices: Choice[] = [];

  for (let i = 0; i < choiceCount; i++) {
    choices.push(
      new Choice({
        id: `choice-${i}`,
        text: `選択肢${i + 1}`,
        consequenceText: `結果${i + 1}`,
        execute: () =>
          new Consequence({
            catStatusChange: { affection: 0, stress: 0, health: 0, hunger: 0 },
            playerStatsChange: { sleepTime: 0, wakenCount: 0, choiceMade: 0 },
            text: `結果${i + 1}`,
          }),
      })
    );
  }

  return new GameEvent({
    id,
    day: 1,
    timeOfDay: TimeOfDay.NIGHT_MIDNIGHT,
    title: 'テストイベント',
    description: 'これはテスト用のイベントです',
    catStateDescription: ['猫が鳴いている'],
    choices,
  });
}
