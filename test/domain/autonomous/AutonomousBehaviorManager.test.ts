/**
 * AutonomousBehaviorManager のテスト
 */

import { AutonomousBehaviorManager } from '@/domain/autonomous/AutonomousBehaviorManager';
import { Cat } from '@/domain/Cat';
import { GamePhase, CatState, CatMood } from '@/domain/types';
import { AutonomousActionType } from '@/domain/autonomous/AutonomousActionType';
import { EventRecord } from '@/domain/EventRecord';

describe('AutonomousBehaviorManager', () => {
  let manager: AutonomousBehaviorManager;
  let cat: Cat;

  beforeEach(() => {
    manager = new AutonomousBehaviorManager();
    cat = new Cat();
  });

  describe('selectActionForPhase', () => {
    it('NIGHT_PREPフェーズではSLEEPINGを選択する', () => {
      const action = manager.selectActionForPhase(GamePhase.NIGHT_PREP);
      expect(action).toBe(AutonomousActionType.SLEEPING);
    });

    it('MIDNIGHT_EVENTフェーズではMEOWINGを選択する', () => {
      const action = manager.selectActionForPhase(GamePhase.MIDNIGHT_EVENT);
      expect(action).toBe(AutonomousActionType.MEOWING);
    });
  });

  describe('startAction', () => {
    it('SLEEPINGアクションを開始すると猫がSLEEPING状態になる', () => {
      manager.startAction(cat, AutonomousActionType.SLEEPING, 0);

      expect(cat.state).toBe(CatState.SLEEPING);
      expect(cat.mood).toBe(CatMood.SLEEPY);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.SLEEPING
      );
    });

    it('MEOWINGアクションを開始すると猫がMEOWING状態になる', () => {
      manager.startAction(cat, AutonomousActionType.MEOWING, 0);

      expect(cat.state).toBe(CatState.MEOWING);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.MEOWING
      );
    });

    it('SITTINGアクションを開始すると猫がSITTING状態になる', () => {
      manager.startAction(cat, AutonomousActionType.SITTING, 0);

      expect(cat.state).toBe(CatState.SITTING);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.SITTING
      );
    });
  });

  describe('update', () => {
    it('MEOWINGが30秒経過後にSITTINGに遷移する', () => {
      manager.startAction(cat, AutonomousActionType.MEOWING, 0);

      // 30秒経過
      manager.update(cat, 30000);

      expect(cat.state).toBe(CatState.SITTING);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.SITTING
      );
    });

    it('MEOWINGが30秒未満では遷移しない', () => {
      manager.startAction(cat, AutonomousActionType.MEOWING, 0);

      // 29秒経過
      manager.update(cat, 29000);

      expect(cat.state).toBe(CatState.MEOWING);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.MEOWING
      );
    });

    it('SLEEPINGは時間経過しても遷移しない', () => {
      manager.startAction(cat, AutonomousActionType.SLEEPING, 0);

      // 10分経過
      manager.update(cat, 600000);

      expect(cat.state).toBe(CatState.SLEEPING);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.SLEEPING
      );
    });
  });

  describe('stopCurrentAction', () => {
    it('現在のアクションを停止できる', () => {
      manager.startAction(cat, AutonomousActionType.MEOWING, 0);

      manager.stopCurrentAction(cat);

      expect(cat.autonomousBehaviorState.currentAction).toBeNull();
    });
  });

  describe('applyHistoryModification', () => {
    const createEventRecord = (choiceId: string): EventRecord => ({
      eventId: 'test-event',
      day: 1,
      choiceId,
      emotion: { satisfaction: 3, burden: 3 },
      timestamp: Date.now(),
    });

    it('catchを選んだ後は初期気分がSCAREDになる', () => {
      const history = [createEventRecord('catch')];
      manager.applyHistoryModification(cat, history);

      expect(cat.mood).toBe(CatMood.SCARED);
    });

    it('playを選んだ後は初期気分がHAPPYになる', () => {
      const history = [createEventRecord('play')];
      manager.applyHistoryModification(cat, history);

      expect(cat.mood).toBe(CatMood.HAPPY);
    });
  });

  describe('getCurrentActionType', () => {
    it('現在のアクションタイプを取得できる', () => {
      manager.startAction(cat, AutonomousActionType.MEOWING, 0);

      const actionType = manager.getCurrentActionType(cat);

      expect(actionType).toBe(AutonomousActionType.MEOWING);
    });

    it('アクションがない場合はnullを返す', () => {
      const actionType = manager.getCurrentActionType(cat);

      expect(actionType).toBeNull();
    });
  });

  describe('isCurrentActionCompleted', () => {
    it('MEOWINGが30秒経過後は完了と判定する', () => {
      manager.startAction(cat, AutonomousActionType.MEOWING, 0);

      const isCompleted = manager.isCurrentActionCompleted(cat, 30000);

      expect(isCompleted).toBe(true);
    });

    it('MEOWINGが30秒未満では未完了と判定する', () => {
      manager.startAction(cat, AutonomousActionType.MEOWING, 0);

      const isCompleted = manager.isCurrentActionCompleted(cat, 29000);

      expect(isCompleted).toBe(false);
    });
  });
});
