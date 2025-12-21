/**
 * PlayingAction のテスト
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { PlayingAction } from '@/domain/nightcry/actions/PlayingAction';
import { Cat } from '@/domain/Cat';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';

describe('PlayingAction', () => {
  let cat: Cat;
  let action: PlayingAction;

  beforeEach(() => {
    cat = new Cat({ name: 'テスト猫' });
    action = new PlayingAction();
  });

  describe('start', () => {
    it('アクション開始時、猫の currentAction を PLAYING に設定する', () => {
      const gameTime = 1000;

      action.start(cat, gameTime);

      expect(cat.nightCryState.currentAction).toBe(NightCryActionType.PLAYING);
    });

    it('アクション開始時、actionStartTime を設定する', () => {
      const gameTime = 5000;

      action.start(cat, gameTime);

      expect(cat.nightCryState.actionStartTime).toBe(5000);
    });

    it('アクション開始時、満足度は変化しない', () => {
      const initialSatisfaction = cat.nightCryState.satisfaction;
      const gameTime = 1000;

      action.start(cat, gameTime);

      expect(cat.nightCryState.satisfaction).toBe(initialSatisfaction);
    });
  });

  describe('update', () => {
    it('経過時間に応じて満足度が増加する', () => {
      const startTime = 0;
      action.start(cat, startTime);

      // 3分経過（15分中3分 = 0.2）
      const currentTime = 3 * 60 * 1000;
      action.update(cat, currentTime);

      expect(cat.nightCryState.satisfaction).toBeCloseTo(0.2, 2);
    });

    it('15分経過で満足度が1.0になる', () => {
      const startTime = 0;
      action.start(cat, startTime);

      // 15分経過
      const currentTime = 15 * 60 * 1000;
      action.update(cat, currentTime);

      expect(cat.nightCryState.satisfaction).toBe(1.0);
    });

    it('15分を超えても満足度は1.0を超えない', () => {
      const startTime = 0;
      action.start(cat, startTime);

      // 30分経過
      const currentTime = 30 * 60 * 1000;
      action.update(cat, currentTime);

      expect(cat.nightCryState.satisfaction).toBe(1.0);
    });

    it('諦め度は変化しない', () => {
      const startTime = 0;
      const initialResignation = cat.nightCryState.resignation;
      action.start(cat, startTime);

      // 3分経過
      const currentTime = 3 * 60 * 1000;
      action.update(cat, currentTime);

      expect(cat.nightCryState.resignation).toBe(initialResignation);
    });
  });

  describe('isCompleted', () => {
    it('満足度が1.0の場合、完了とみなす', () => {
      const startTime = 0;
      action.start(cat, startTime);

      // 15分経過で満足度1.0
      const currentTime = 15 * 60 * 1000;
      action.update(cat, currentTime);

      expect(action.isCompleted(cat)).toBe(true);
    });

    it('満足度が1.0未満の場合、未完了とみなす', () => {
      const startTime = 0;
      action.start(cat, startTime);

      // 2分経過
      const currentTime = 2 * 60 * 1000;
      action.update(cat, currentTime);

      expect(action.isCompleted(cat)).toBe(false);
    });
  });

  describe('stop', () => {
    it('アクション停止時、currentAction を null に設定する', () => {
      const startTime = 0;
      action.start(cat, startTime);

      action.stop(cat);

      expect(cat.nightCryState.currentAction).toBeNull();
    });

    it('アクション停止時、満足度は保持される', () => {
      const startTime = 0;
      action.start(cat, startTime);

      // 2分経過
      const currentTime = 2 * 60 * 1000;
      action.update(cat, currentTime);

      const satisfactionBeforeStop = cat.nightCryState.satisfaction;
      action.stop(cat);

      expect(cat.nightCryState.satisfaction).toBe(satisfactionBeforeStop);
    });
  });
});
