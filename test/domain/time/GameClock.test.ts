/**
 * GameClock テスト
 *
 * グローバル時刻管理クラスのテスト
 */

import { GameClock } from '@/domain/time/GameClock';

describe('GameClock', () => {
  let clock: GameClock;

  beforeEach(() => {
    clock = new GameClock();
  });

  describe('初期状態', () => {
    it('経過時間は0ミリ秒', () => {
      expect(clock.getElapsedMs()).toBe(0);
    });

    it('tick数は0', () => {
      expect(clock.getTicks()).toBe(0);
    });

    it('一時停止状態ではない', () => {
      expect(clock.isPaused()).toBe(false);
    });
  });

  describe('update()', () => {
    it('deltaMs分だけ経過時間が増加する', () => {
      clock.update(16); // 1フレーム約16ms
      expect(clock.getElapsedMs()).toBe(16);
    });

    it('複数回updateすると累積される', () => {
      clock.update(16);
      clock.update(16);
      clock.update(16);
      expect(clock.getElapsedMs()).toBe(48);
    });

    it('tick数がインクリメントされる', () => {
      clock.update(16);
      expect(clock.getTicks()).toBe(1);

      clock.update(16);
      expect(clock.getTicks()).toBe(2);
    });
  });

  describe('pause() / resume()', () => {
    it('pause中はupdate()しても経過時間が増加しない', () => {
      clock.update(16);
      clock.pause();
      clock.update(16);
      clock.update(16);
      expect(clock.getElapsedMs()).toBe(16);
    });

    it('pause中はtick数も増加しない', () => {
      clock.update(16);
      clock.pause();
      clock.update(16);
      expect(clock.getTicks()).toBe(1);
    });

    it('resume後はupdate()で経過時間が増加する', () => {
      clock.update(16);
      clock.pause();
      clock.update(16);
      clock.resume();
      clock.update(16);
      expect(clock.getElapsedMs()).toBe(32);
    });

    it('isPaused()が正しく状態を返す', () => {
      expect(clock.isPaused()).toBe(false);
      clock.pause();
      expect(clock.isPaused()).toBe(true);
      clock.resume();
      expect(clock.isPaused()).toBe(false);
    });
  });

  describe('reset()', () => {
    it('経過時間が0にリセットされる', () => {
      clock.update(100);
      clock.reset();
      expect(clock.getElapsedMs()).toBe(0);
    });

    it('tick数が0にリセットされる', () => {
      clock.update(16);
      clock.update(16);
      clock.reset();
      expect(clock.getTicks()).toBe(0);
    });

    it('pause状態が解除される', () => {
      clock.pause();
      clock.reset();
      expect(clock.isPaused()).toBe(false);
    });
  });
});
