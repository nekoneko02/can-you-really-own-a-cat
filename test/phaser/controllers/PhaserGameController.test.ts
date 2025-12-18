/**
 * PhaserGameControllerのテスト
 *
 * GameControllerのラッパークラスをテストします。
 * TDDの原則に従い、実装前にテストを作成します。
 */

import { PhaserGameController } from '@/phaser/controllers/PhaserGameController';
import { GameController } from '@/application/GameController';
import { Direction } from '@/domain/types';

// GameControllerのモック
jest.mock('@/application/GameController');

describe('PhaserGameController', () => {
  let controller: PhaserGameController;
  let mockGameController: jest.Mocked<GameController>;

  beforeEach(() => {
    // モックのクリア
    jest.clearAllMocks();

    // GameControllerのモックインスタンスを作成
    mockGameController = new GameController({
      scenarioId: 'night_crying',
    }) as jest.Mocked<GameController>;

    // PhaserGameControllerを初期化
    controller = new PhaserGameController(mockGameController);
  });

  describe('初期化', () => {
    it('GameControllerインスタンスを保持すること', () => {
      expect(controller).toBeDefined();
      expect(controller.getGameController()).toBe(mockGameController);
    });

    it('GameControllerがnullの場合、エラーを投げること', () => {
      expect(() => {
        new PhaserGameController(null as any);
      }).toThrow('GameController is required');
    });
  });

  describe('tick()メソッド', () => {
    it('GameController.tick()を呼び出すこと', () => {
      const input = { direction: Direction.UP };

      controller.tick(input);

      expect(mockGameController.tick).toHaveBeenCalledWith(input);
      expect(mockGameController.tick).toHaveBeenCalledTimes(1);
    });

    it('複数回呼び出しても正しく動作すること', () => {
      controller.tick({ direction: Direction.UP });
      controller.tick({ direction: Direction.DOWN });
      controller.tick({ interact: true });

      expect(mockGameController.tick).toHaveBeenCalledTimes(3);
    });

    it('GameControllerが未初期化の場合、エラーを投げること', () => {
      const uninitializedController = new PhaserGameController(
        mockGameController
      );
      // GameControllerを強制的にnullに
      (uninitializedController as any).gameController = null;

      expect(() => {
        uninitializedController.tick({ direction: Direction.UP });
      }).toThrow('GameController is not initialized');
    });
  });

  describe('view()メソッド', () => {
    it('GameController.view()を呼び出すこと', () => {
      const mockView = {
        phase: 'NIGHT_PREP' as const,
        time: 2200,
        day: 1,
        player: { x: 100, y: 200, animation: 'idle', hasToy: false },
        cat: { x: 300, y: 400, state: 'SITTING' as const, mood: 'NEUTRAL' as const },
        currentEvent: null,
        catStatus: {
          affection: 50,
          stress: 30,
          health: 80,
          hunger: 40,
        },
        playerStats: {
          totalSleepHours: 0,
          interruptionCount: 0,
          playCount: 0,
        },
      };

      mockGameController.view.mockReturnValue(mockView as any);

      const result = controller.view();

      expect(mockGameController.view).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockView);
    });

    it('GameControllerが未初期化の場合、エラーを投げること', () => {
      const uninitializedController = new PhaserGameController(
        mockGameController
      );
      (uninitializedController as any).gameController = null;

      expect(() => {
        uninitializedController.view();
      }).toThrow('GameController is not initialized');
    });
  });

  // getResult()メソッドのテストはGameController側にgetResultが実装されてから追加
  // describe('getResult()メソッド', () => { ... });

  describe('エラーハンドリング', () => {
    it('tick()でエラーが発生した場合、エラーを再スローすること', () => {
      const error = new Error('Test error');
      mockGameController.tick.mockImplementation(() => {
        throw error;
      });

      expect(() => {
        controller.tick({ direction: Direction.UP });
      }).toThrow('Test error');
    });

    it('view()でエラーが発生した場合、エラーを再スローすること', () => {
      const error = new Error('Test error');
      mockGameController.view.mockImplementation(() => {
        throw error;
      });

      expect(() => {
        controller.view();
      }).toThrow('Test error');
    });
  });
});
