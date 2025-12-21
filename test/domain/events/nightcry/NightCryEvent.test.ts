/**
 * NightCryEvent テスト
 *
 * 夜泣きイベント集約のテスト
 */

import { NightCryEvent, NightCryEventResult } from '@/domain/events/nightcry/NightCryEvent';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';

describe('NightCryEvent', () => {
  let event: NightCryEvent;

  beforeEach(() => {
    event = new NightCryEvent();
  });

  describe('初期状態', () => {
    it('満足度は0', () => {
      expect(event.getSatisfaction()).toBe(0);
    });

    it('諦め度は0', () => {
      expect(event.getResignation()).toBe(0);
    });

    it('アクティブではない', () => {
      expect(event.isActive()).toBe(false);
    });

    it('完了していない', () => {
      expect(event.isCompleted()).toBe(false);
    });

    it('現在のアクションはnull', () => {
      expect(event.getCurrentAction()).toBeNull();
    });
  });

  describe('start()', () => {
    it('イベントがアクティブになる', () => {
      event.start();
      expect(event.isActive()).toBe(true);
    });
  });

  describe('startAction()', () => {
    beforeEach(() => {
      event.start();
    });

    it('アクションを開始できる', () => {
      event.startAction(NightCryActionType.PLAYING);
      expect(event.getCurrentAction()).toBe(NightCryActionType.PLAYING);
    });

    it('アクション開始時刻が記録される', () => {
      event.startAction(NightCryActionType.PLAYING);
      expect(event.getActionStartTime()).toBe(0);
    });

    it('イベントが開始していない場合はエラー', () => {
      const notStartedEvent = new NightCryEvent();
      expect(() => notStartedEvent.startAction(NightCryActionType.PLAYING)).toThrow();
    });
  });

  describe('update() - 満足度系アクション', () => {
    beforeEach(() => {
      event.start();
      event.startAction(NightCryActionType.PLAYING);
    });

    it('経過時間に応じて満足度が増加する', () => {
      // 15分（ゲーム内時間）の半分経過
      const halfDuration = 15 * 60 * 1000 / 2; // 7.5分
      event.update(halfDuration);
      expect(event.getSatisfaction()).toBeCloseTo(0.5, 1);
    });

    it('15分経過で満足度が1.0になる', () => {
      const fullDuration = 15 * 60 * 1000; // 15分
      event.update(fullDuration);
      expect(event.getSatisfaction()).toBe(1.0);
    });

    it('満足度は1.0を超えない', () => {
      const overDuration = 20 * 60 * 1000; // 20分
      event.update(overDuration);
      expect(event.getSatisfaction()).toBe(1.0);
    });

    it('諦め度は変化しない', () => {
      event.update(15 * 60 * 1000);
      expect(event.getResignation()).toBe(0);
    });
  });

  describe('update() - 諦め度系アクション', () => {
    beforeEach(() => {
      event.start();
      event.startAction(NightCryActionType.IGNORING);
    });

    it('経過時間に応じて諦め度が増加する', () => {
      const halfDuration = 15 * 60 * 1000 / 2;
      event.update(halfDuration);
      expect(event.getResignation()).toBeCloseTo(0.5, 1);
    });

    it('15分経過で諦め度が1.0になる', () => {
      const fullDuration = 15 * 60 * 1000;
      event.update(fullDuration);
      expect(event.getResignation()).toBe(1.0);
    });

    it('満足度は変化しない', () => {
      event.update(15 * 60 * 1000);
      expect(event.getSatisfaction()).toBe(0);
    });
  });

  describe('isCompleted()', () => {
    beforeEach(() => {
      event.start();
    });

    it('満足度が1.0で完了', () => {
      event.startAction(NightCryActionType.PLAYING);
      event.update(15 * 60 * 1000);
      expect(event.isCompleted()).toBe(true);
    });

    it('諦め度が1.0で完了', () => {
      event.startAction(NightCryActionType.IGNORING);
      event.update(15 * 60 * 1000);
      expect(event.isCompleted()).toBe(true);
    });

    it('どちらも1.0未満なら未完了', () => {
      event.startAction(NightCryActionType.PLAYING);
      event.update(7 * 60 * 1000); // 7分
      expect(event.isCompleted()).toBe(false);
    });
  });

  describe('stopAction()', () => {
    beforeEach(() => {
      event.start();
      event.startAction(NightCryActionType.PLAYING);
    });

    it('アクションを停止できる', () => {
      event.stopAction();
      expect(event.getCurrentAction()).toBeNull();
    });

    it('停止後も満足度は維持される', () => {
      event.update(7 * 60 * 1000); // 約0.47
      const satisfactionBefore = event.getSatisfaction();
      event.stopAction();
      expect(event.getSatisfaction()).toBe(satisfactionBefore);
    });
  });

  describe('getResult()', () => {
    beforeEach(() => {
      event.start();
    });

    it('満足度達成の結果を取得できる', () => {
      event.startAction(NightCryActionType.PLAYING);
      event.update(15 * 60 * 1000);

      const result = event.getResult();
      expect(result.satisfaction).toBe(1.0);
      expect(result.resignation).toBe(0);
      expect(result.completedBy).toBe('satisfaction');
    });

    it('諦め度達成の結果を取得できる', () => {
      event.startAction(NightCryActionType.IGNORING);
      event.update(15 * 60 * 1000);

      const result = event.getResult();
      expect(result.satisfaction).toBe(0);
      expect(result.resignation).toBe(1.0);
      expect(result.completedBy).toBe('resignation');
    });

    it('未完了の場合はcompletedByがnull', () => {
      event.startAction(NightCryActionType.PLAYING);
      event.update(5 * 60 * 1000);

      const result = event.getResult();
      expect(result.completedBy).toBeNull();
    });
  });

  describe('reset()', () => {
    it('状態がリセットされる', () => {
      event.start();
      event.startAction(NightCryActionType.PLAYING);
      event.update(10 * 60 * 1000);
      event.reset();

      expect(event.isActive()).toBe(false);
      expect(event.getSatisfaction()).toBe(0);
      expect(event.getResignation()).toBe(0);
      expect(event.getCurrentAction()).toBeNull();
    });
  });
});
