/**
 * HistoryBasedActionModifier のテスト
 */

import { HistoryBasedActionModifier } from '@/domain/autonomous/selectors/HistoryBasedActionModifier';
import {
  createInitialAutonomousBehaviorState,
  DEFAULT_MEOWING_DURATION,
} from '@/domain/autonomous/AutonomousBehaviorState';
import { CatMood } from '@/domain/types';
import { EventRecord } from '@/domain/EventRecord';

describe('HistoryBasedActionModifier', () => {
  const modifier = new HistoryBasedActionModifier();

  const createEventRecord = (
    choiceId: string,
    day: number = 1
  ): EventRecord => ({
    eventId: 'test-event',
    day,
    choiceId,
    emotion: { satisfaction: 3, burden: 3 },
    timestamp: Date.now(),
  });

  describe('modify', () => {
    it('履歴がない場合は何も変更しない', () => {
      const state = createInitialAutonomousBehaviorState();
      const result = modifier.modify(state, []);

      expect(result.state).toEqual({});
      expect(result.initialMood).toBeNull();
    });

    it('前日にwaitを選んだ場合、鳴く時間が10秒増加する', () => {
      const state = createInitialAutonomousBehaviorState();
      const history = [createEventRecord('wait')];
      const result = modifier.modify(state, history);

      expect(result.state.meowingDuration).toBe(DEFAULT_MEOWING_DURATION + 10000);
    });

    it('前日にignoreを選んだ場合も、鳴く時間が10秒増加する', () => {
      const state = createInitialAutonomousBehaviorState();
      const history = [createEventRecord('ignore')];
      const result = modifier.modify(state, history);

      expect(result.state.meowingDuration).toBe(DEFAULT_MEOWING_DURATION + 10000);
    });

    it('前日にcatchを選んだ場合、初期気分がSCAREDになる', () => {
      const state = createInitialAutonomousBehaviorState();
      const history = [createEventRecord('catch')];
      const result = modifier.modify(state, history);

      expect(result.initialMood).toBe(CatMood.SCARED);
    });

    it('前日にplayを選んだ場合、初期気分がHAPPYになる', () => {
      const state = createInitialAutonomousBehaviorState();
      const history = [createEventRecord('play')];
      const result = modifier.modify(state, history);

      expect(result.initialMood).toBe(CatMood.HAPPY);
    });

    it('3日連続waitを選んだ場合、鳴く時間がさらに20秒増加する', () => {
      const state = createInitialAutonomousBehaviorState();
      const history = [
        createEventRecord('wait', 1),
        createEventRecord('wait', 2),
        createEventRecord('wait', 3),
      ];
      const result = modifier.modify(state, history);

      // 基本 + 前日の10秒 + 3日連続の20秒
      expect(result.state.meowingDuration).toBe(DEFAULT_MEOWING_DURATION + 10000 + 20000);
    });

    it('3日連続ignoreを選んだ場合も、鳴く時間がさらに20秒増加する', () => {
      const state = createInitialAutonomousBehaviorState();
      const history = [
        createEventRecord('ignore', 1),
        createEventRecord('ignore', 2),
        createEventRecord('ignore', 3),
      ];
      const result = modifier.modify(state, history);

      expect(result.state.meowingDuration).toBe(DEFAULT_MEOWING_DURATION + 10000 + 20000);
    });

    it('3日連続でない場合、追加の増加はない', () => {
      const state = createInitialAutonomousBehaviorState();
      const history = [
        createEventRecord('wait', 1),
        createEventRecord('play', 2), // 途中でplayを選んだ
        createEventRecord('wait', 3),
      ];
      const result = modifier.modify(state, history);

      // 基本 + 前日の10秒のみ（3日連続ではない）
      expect(result.state.meowingDuration).toBe(DEFAULT_MEOWING_DURATION + 10000);
    });
  });
});
