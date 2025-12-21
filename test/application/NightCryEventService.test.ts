/**
 * NightCryEventService テスト
 *
 * 夜泣きイベント制御サービスのテスト
 */

import { NightCryEventService } from '@/application/NightCryEventService';
import { TimeService } from '@/application/TimeService';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';

describe('NightCryEventService', () => {
  let service: NightCryEventService;
  let timeService: TimeService;

  beforeEach(() => {
    timeService = new TimeService();
    service = new NightCryEventService(timeService);
  });

  describe('初期状態', () => {
    it('イベントはアクティブではない', () => {
      expect(service.isActive()).toBe(false);
    });

    it('イベントは完了していない', () => {
      expect(service.isCompleted()).toBe(false);
    });
  });

  describe('start()', () => {
    it('イベントを開始できる', () => {
      service.start();
      expect(service.isActive()).toBe(true);
    });
  });

  describe('selectAction()', () => {
    beforeEach(() => {
      service.start();
    });

    it('アクションを選択できる', () => {
      service.selectAction(NightCryActionType.PLAYING);
      expect(service.getCurrentAction()).toBe(NightCryActionType.PLAYING);
    });

    it('TimeServiceにアクション開始時刻が設定される', () => {
      timeService.update(1000);
      service.selectAction(NightCryActionType.PLAYING);
      // アクション開始後のスケール経過時間は0から始まる
      expect(timeService.getScaledElapsedMs()).toBe(0);
    });
  });

  describe('update()', () => {
    beforeEach(() => {
      service.start();
      service.selectAction(NightCryActionType.PLAYING);
    });

    it('時間経過で満足度が上がる', () => {
      // 1秒経過（30倍速なので30秒分）
      timeService.update(1000);
      service.update();
      expect(service.getSatisfaction()).toBeGreaterThan(0);
    });

    it('15分（ゲーム内）経過で完了する', () => {
      // 現実30秒 = ゲーム内15分
      // 30秒 = 30000ms
      for (let i = 0; i < 30; i++) {
        timeService.update(1000);
      }
      service.update();
      expect(service.isCompleted()).toBe(true);
    });
  });

  describe('stop()', () => {
    beforeEach(() => {
      service.start();
      service.selectAction(NightCryActionType.PLAYING);
      timeService.update(5000);
      service.update();
    });

    it('イベントを停止できる', () => {
      service.stop();
      expect(service.isActive()).toBe(false);
    });

    it('結果を取得できる', () => {
      const result = service.stop();
      expect(result).toBeDefined();
      expect(result.satisfaction).toBeGreaterThan(0);
    });
  });

  describe('getState()', () => {
    it('現在の状態を取得できる', () => {
      service.start();
      service.selectAction(NightCryActionType.PLAYING);
      timeService.update(1000);
      service.update();

      const state = service.getState();
      expect(state.isActive).toBe(true);
      expect(state.currentAction).toBe(NightCryActionType.PLAYING);
      expect(state.satisfaction).toBeGreaterThan(0);
      expect(state.resignation).toBe(0);
    });
  });
});
