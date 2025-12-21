/**
 * TimeService テスト
 *
 * 時間管理サービスのテスト
 */

import { TimeService } from '@/application/TimeService';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';

describe('TimeService', () => {
  let service: TimeService;

  beforeEach(() => {
    service = new TimeService();
  });

  describe('初期状態', () => {
    it('経過時間は0', () => {
      expect(service.getElapsedMs()).toBe(0);
    });

    it('スケール適用経過時間も0', () => {
      expect(service.getScaledElapsedMs()).toBe(0);
    });
  });

  describe('update()', () => {
    it('deltaMs分だけ経過時間が増加する', () => {
      service.update(16);
      expect(service.getElapsedMs()).toBe(16);
    });

    it('複数回updateすると累積される', () => {
      service.update(16);
      service.update(16);
      expect(service.getElapsedMs()).toBe(32);
    });
  });

  describe('startActionTime()', () => {
    it('アクション開始時刻を設定し、スケール適用経過時間が0から始まる', () => {
      service.update(1000);
      service.startActionTime(NightCryActionType.PLAYING);
      expect(service.getScaledElapsedMs()).toBe(0);
    });

    it('アクション開始後に時間が経過するとスケール適用される', () => {
      service.update(1000);
      service.startActionTime(NightCryActionType.PLAYING);
      service.update(1000); // さらに1秒経過

      // PLAYING は30倍速なので、1000ms × 30 = 30000ms
      expect(service.getScaledElapsedMs()).toBe(30000);
    });
  });

  describe('stopActionTime()', () => {
    it('アクション時間計測を停止する', () => {
      service.update(1000);
      service.startActionTime(NightCryActionType.PLAYING);
      service.update(1000);
      service.stopActionTime();

      // 停止後はスケール適用経過時間が0になる
      expect(service.getScaledElapsedMs()).toBe(0);
    });
  });

  describe('pause() / resume()', () => {
    it('pause中は時間が進まない', () => {
      service.update(1000);
      service.pause();
      service.update(1000);
      expect(service.getElapsedMs()).toBe(1000);
    });

    it('resume後は時間が進む', () => {
      service.update(1000);
      service.pause();
      service.update(1000);
      service.resume();
      service.update(1000);
      expect(service.getElapsedMs()).toBe(2000);
    });
  });

  describe('reset()', () => {
    it('全ての状態がリセットされる', () => {
      service.update(1000);
      service.startActionTime(NightCryActionType.PLAYING);
      service.update(500);
      service.reset();

      expect(service.getElapsedMs()).toBe(0);
      expect(service.getScaledElapsedMs()).toBe(0);
    });
  });

  describe('getDisplayTime()', () => {
    it('初期時刻は22:00', () => {
      expect(service.getDisplayTime()).toBe(2200);
    });

    it('setDisplayTime()で時刻を設定できる', () => {
      service.setDisplayTime(300); // 3:00
      expect(service.getDisplayTime()).toBe(300);
    });
  });
});
