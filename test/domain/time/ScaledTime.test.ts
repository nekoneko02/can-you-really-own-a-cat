/**
 * ScaledTime テスト
 *
 * スケール適用時間クラスのテスト
 */

import { ScaledTime } from '@/domain/time/ScaledTime';

describe('ScaledTime', () => {
  describe('constructor', () => {
    it('開始時刻とスケールを設定できる', () => {
      const scaledTime = new ScaledTime(1000, 2.0);
      expect(scaledTime.getStartTime()).toBe(1000);
      expect(scaledTime.getTimeScale()).toBe(2.0);
    });

    it('デフォルトスケールは1.0', () => {
      const scaledTime = new ScaledTime(0);
      expect(scaledTime.getTimeScale()).toBe(1.0);
    });
  });

  describe('getScaledElapsed()', () => {
    it('スケール1.0の場合、経過時間がそのまま返される', () => {
      const scaledTime = new ScaledTime(0, 1.0);
      expect(scaledTime.getScaledElapsed(1000)).toBe(1000);
    });

    it('スケール2.0の場合、経過時間が2倍になる', () => {
      const scaledTime = new ScaledTime(0, 2.0);
      expect(scaledTime.getScaledElapsed(1000)).toBe(2000);
    });

    it('スケール30.0の場合、経過時間が30倍になる', () => {
      const scaledTime = new ScaledTime(0, 30.0);
      // 1秒経過 → 30秒分の時間が経過
      expect(scaledTime.getScaledElapsed(1000)).toBe(30000);
    });

    it('開始時刻からの差分にスケールが適用される', () => {
      const scaledTime = new ScaledTime(5000, 2.0);
      // currentTime=7000, startTime=5000 → 差分2000 × 2.0 = 4000
      expect(scaledTime.getScaledElapsed(7000)).toBe(4000);
    });

    it('currentTimeが開始時刻より前の場合は0を返す', () => {
      const scaledTime = new ScaledTime(5000, 2.0);
      expect(scaledTime.getScaledElapsed(3000)).toBe(0);
    });
  });

  describe('setTimeScale()', () => {
    it('スケールを変更できる', () => {
      const scaledTime = new ScaledTime(0, 1.0);
      scaledTime.setTimeScale(5.0);
      expect(scaledTime.getTimeScale()).toBe(5.0);
    });

    it('負のスケールは0に補正される', () => {
      const scaledTime = new ScaledTime(0, 1.0);
      scaledTime.setTimeScale(-1.0);
      expect(scaledTime.getTimeScale()).toBe(0);
    });
  });

  describe('resetStartTime()', () => {
    it('開始時刻をリセットできる', () => {
      const scaledTime = new ScaledTime(1000, 2.0);
      scaledTime.resetStartTime(5000);
      expect(scaledTime.getStartTime()).toBe(5000);
    });
  });

  describe('実際のユースケース', () => {
    it('夜泣きイベント: 現実30秒でゲーム内15分（30倍速）', () => {
      const scaledTime = new ScaledTime(0, 30.0);

      // 現実時間1秒経過
      const realElapsed1Sec = 1000;
      const gameElapsed = scaledTime.getScaledElapsed(realElapsed1Sec);

      // ゲーム内時間は30秒
      expect(gameElapsed).toBe(30000);

      // 現実時間30秒経過
      const realElapsed30Sec = 30000;
      const gameElapsed30 = scaledTime.getScaledElapsed(realElapsed30Sec);

      // ゲーム内時間は15分（900秒 = 900000ms）
      expect(gameElapsed30).toBe(900000);
    });
  });
});
