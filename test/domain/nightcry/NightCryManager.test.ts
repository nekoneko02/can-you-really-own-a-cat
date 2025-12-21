/**
 * NightCryManager のテスト
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { NightCryManager } from '@/domain/nightcry/NightCryManager';
import { Cat } from '@/domain/Cat';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';

describe('NightCryManager', () => {
  let manager: NightCryManager;
  let cat: Cat;

  beforeEach(() => {
    manager = new NightCryManager();
    cat = new Cat({ name: 'テスト猫' });
  });

  describe('startAction', () => {
    it('PLAYING アクションを開始できる', () => {
      manager.startAction(cat, NightCryActionType.PLAYING, 1000);

      expect(cat.nightCryState.currentAction).toBe(NightCryActionType.PLAYING);
      expect(cat.nightCryState.actionStartTime).toBe(1000);
    });

    it('PETTING アクションを開始できる', () => {
      manager.startAction(cat, NightCryActionType.PETTING, 2000);

      expect(cat.nightCryState.currentAction).toBe(NightCryActionType.PETTING);
    });

    it('IGNORING アクションを開始できる', () => {
      manager.startAction(cat, NightCryActionType.IGNORING, 3000);

      expect(cat.nightCryState.currentAction).toBe(NightCryActionType.IGNORING);
    });

    it('LOCKED_OUT アクションを開始できる', () => {
      manager.startAction(cat, NightCryActionType.LOCKED_OUT, 4000);

      expect(cat.nightCryState.currentAction).toBe(NightCryActionType.LOCKED_OUT);
    });
  });

  describe('update', () => {
    it('PLAYING アクション中、満足度が増加する', () => {
      manager.startAction(cat, NightCryActionType.PLAYING, 0);

      // 3分経過（15分中3分 = 0.2）
      manager.update(cat, 3 * 60 * 1000);

      expect(cat.nightCryState.satisfaction).toBeCloseTo(0.2, 2);
    });

    it('IGNORING アクション中、諦め度が増加する', () => {
      manager.startAction(cat, NightCryActionType.IGNORING, 0);

      // 5分経過
      manager.update(cat, 5 * 60 * 1000);

      expect(cat.nightCryState.resignation).toBeCloseTo(0.333, 2);
    });

    it('アクションなしの場合、何も変化しない', () => {
      const initialSatisfaction = cat.nightCryState.satisfaction;
      const initialResignation = cat.nightCryState.resignation;

      manager.update(cat, 1000);

      expect(cat.nightCryState.satisfaction).toBe(initialSatisfaction);
      expect(cat.nightCryState.resignation).toBe(initialResignation);
    });
  });

  describe('stopCurrentAction', () => {
    it('現在のアクションを停止できる', () => {
      manager.startAction(cat, NightCryActionType.PLAYING, 0);
      manager.update(cat, 3 * 60 * 1000); // 満足度を上げる

      const satisfactionBeforeStop = cat.nightCryState.satisfaction;

      manager.stopCurrentAction(cat);

      expect(cat.nightCryState.currentAction).toBeNull();
      expect(cat.nightCryState.satisfaction).toBe(satisfactionBeforeStop); // 満足度は保持
    });

    it('アクションなしの場合、何も起こらない', () => {
      manager.stopCurrentAction(cat);

      expect(cat.nightCryState.currentAction).toBeNull();
    });
  });

  describe('isCompleted', () => {
    it('満足度が1.0の場合、完了とみなす', () => {
      manager.startAction(cat, NightCryActionType.PLAYING, 0);

      // 15分経過で満足度1.0
      manager.update(cat, 15 * 60 * 1000);

      expect(manager.isCompleted(cat)).toBe(true);
    });

    it('諦め度が1.0の場合、完了とみなす', () => {
      manager.startAction(cat, NightCryActionType.IGNORING, 0);

      // 15分経過で諦め度1.0
      manager.update(cat, 15 * 60 * 1000);

      expect(manager.isCompleted(cat)).toBe(true);
    });

    it('満足度・諦め度が1.0未満の場合、未完了とみなす', () => {
      manager.startAction(cat, NightCryActionType.PLAYING, 0);

      // 5分経過（15分中5分 = 約0.33）
      manager.update(cat, 5 * 60 * 1000);

      expect(manager.isCompleted(cat)).toBe(false);
    });
  });

  describe('shouldRestartCrying', () => {
    it('満足度が1.0未満で停止した場合、再び鳴く必要がある', () => {
      manager.startAction(cat, NightCryActionType.PLAYING, 0);
      manager.update(cat, 5 * 60 * 1000); // 満足度 < 1.0

      manager.stopCurrentAction(cat);

      expect(manager.shouldRestartCrying(cat)).toBe(true);
    });

    it('満足度が1.0の場合、再び鳴く必要はない', () => {
      manager.startAction(cat, NightCryActionType.PLAYING, 0);
      manager.update(cat, 15 * 60 * 1000); // 満足度 = 1.0

      expect(manager.shouldRestartCrying(cat)).toBe(false);
    });

    it('諦め度が1.0の場合、再び鳴く必要はない', () => {
      manager.startAction(cat, NightCryActionType.IGNORING, 0);
      manager.update(cat, 15 * 60 * 1000); // 諦め度 = 1.0

      expect(manager.shouldRestartCrying(cat)).toBe(false);
    });
  });

  describe('reset', () => {
    it('夜泣き状態をリセットできる', () => {
      manager.startAction(cat, NightCryActionType.PLAYING, 0);
      manager.update(cat, 5 * 60 * 1000);

      manager.reset(cat);

      expect(cat.nightCryState.satisfaction).toBe(0);
      expect(cat.nightCryState.resignation).toBe(0);
      expect(cat.nightCryState.currentAction).toBeNull();
      expect(cat.nightCryState.actionStartTime).toBe(0);
    });
  });
});
