/**
 * TimeBasedActionSelector のテスト
 */

import { TimeBasedActionSelector } from '@/domain/autonomous/selectors/TimeBasedActionSelector';
import { AutonomousActionType } from '@/domain/autonomous/AutonomousActionType';
import { AutonomousActionConfig } from '@/domain/autonomous/AutonomousActionConfig';

describe('TimeBasedActionSelector', () => {
  const selector = new TimeBasedActionSelector();

  describe('select', () => {
    it('MEOWINGが設定時間経過後にSITTINGに遷移する', () => {
      const threshold = AutonomousActionConfig.meowing.baseDuration;
      const result = selector.select(AutonomousActionType.MEOWING, threshold);
      expect(result).toBe(AutonomousActionType.SITTING);
    });

    it('MEOWINGが設定時間未満の場合はnullを返す', () => {
      const threshold = AutonomousActionConfig.meowing.baseDuration;
      const result = selector.select(
        AutonomousActionType.MEOWING,
        threshold - 1
      );
      expect(result).toBeNull();
    });

    it('SITTINGが設定時間経過後にWANDERINGに遷移する', () => {
      const threshold = AutonomousActionConfig.sitting.duration;
      const result = selector.select(AutonomousActionType.SITTING, threshold);
      expect(result).toBe(AutonomousActionType.WANDERING);
    });

    it('WANDERINGが設定時間経過後にSITTINGに遷移する', () => {
      const threshold = AutonomousActionConfig.wandering.duration;
      const result = selector.select(AutonomousActionType.WANDERING, threshold);
      expect(result).toBe(AutonomousActionType.SITTING);
    });

    it('IDLE_PLAYINGは自然には終了しない（ユーザー操作まで継続）', () => {
      const result = selector.select(
        AutonomousActionType.IDLE_PLAYING,
        1000000
      );
      expect(result).toBeNull();
    });

    it('SLEEPINGは自然には終了しない', () => {
      const result = selector.select(AutonomousActionType.SLEEPING, 1000000);
      expect(result).toBeNull();
    });

    it('BEING_PETTEDは自然には終了しない（ユーザー操作まで継続）', () => {
      const result = selector.select(
        AutonomousActionType.BEING_PETTED,
        1000000
      );
      expect(result).toBeNull();
    });

    it('WAITING_AFTER_CAREが設定時間経過後にMEOWINGに遷移する', () => {
      const threshold = AutonomousActionConfig.waitingAfterCare.duration;
      const result = selector.select(
        AutonomousActionType.WAITING_AFTER_CARE,
        threshold
      );
      expect(result).toBe(AutonomousActionType.MEOWING);
    });

    it('LOCKED_OUTは自然には終了しない（ユーザー操作まで継続）', () => {
      const result = selector.select(AutonomousActionType.LOCKED_OUT, 1000000);
      expect(result).toBeNull();
    });

    it('FLEEINGはisCompletedがtrueのときにSITTINGに遷移する', () => {
      // threshold: 0 なので、elapsedTime >= 0 なら遷移
      const result = selector.select(AutonomousActionType.FLEEING, 0);
      expect(result).toBe(AutonomousActionType.SITTING);
    });
  });

  describe('getDuration', () => {
    it('MEOWINGの持続時間は設定値', () => {
      const duration = selector.getDuration(AutonomousActionType.MEOWING);
      expect(duration).toBe(AutonomousActionConfig.meowing.baseDuration);
    });

    it('SLEEPINGの持続時間は無限', () => {
      const duration = selector.getDuration(AutonomousActionType.SLEEPING);
      expect(duration).toBe(Infinity);
    });

    it('IDLE_PLAYINGの持続時間は無限（ユーザー操作まで継続）', () => {
      const duration = selector.getDuration(AutonomousActionType.IDLE_PLAYING);
      expect(duration).toBe(Infinity);
    });
  });
});
