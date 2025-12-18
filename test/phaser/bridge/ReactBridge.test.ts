/**
 * ReactBridge - テスト
 *
 * Reactへのデータ受け渡しロジックをテストします。
 */

import { ReactBridge } from '@/phaser/bridge/ReactBridge';
import { PhaserGameController } from '@/phaser/controllers/PhaserGameController';
import { GameController } from '@/application/GameController';
import type { GameResult } from '@/phaser/bridge/types';

describe('ReactBridge', () => {
  describe('sendGameResult', () => {
    let gameController: GameController;
    let phaserController: PhaserGameController;
    let mockOnGameComplete: jest.Mock;

    beforeEach(() => {
      // GameControllerを初期化
      gameController = new GameController({ scenarioId: 'night_crying' });
      phaserController = new PhaserGameController(gameController);

      // window.onGameCompleteのモック
      mockOnGameComplete = jest.fn();

      // globalThisを使用してwindowオブジェクトを設定
      Object.defineProperty(globalThis, 'window', {
        value: {
          onGameComplete: mockOnGameComplete,
        },
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      // グローバルなモックをクリア
      delete (globalThis as any).window;
    });

    it('window.onGameCompleteを呼び出すこと', () => {
      // Act
      ReactBridge.sendGameResult(phaserController);

      // Assert
      expect(mockOnGameComplete).toHaveBeenCalledTimes(1);
    });

    it('GameResultを正しい形式で送信すること', () => {
      // Act
      ReactBridge.sendGameResult(phaserController);

      // Assert
      expect(mockOnGameComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          scenarioId: expect.any(String),
          completed: expect.any(Boolean),
          playerStats: expect.any(Object),
          finalCatStatus: expect.any(Object),
          eventHistory: expect.any(Array),
          report: expect.any(Object),
        })
      );
    });

    it('window.onGameCompleteが未定義の場合、警告をログに出力すること', () => {
      // Arrange
      // window.onGameCompleteのみ削除
      Object.defineProperty(globalThis, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Act
      ReactBridge.sendGameResult(phaserController);

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('window.onGameComplete is not defined')
      );

      // Clean up
      consoleWarnSpy.mockRestore();
    });

    it('GameResultのscenarioIdが正しいこと', () => {
      // Act
      ReactBridge.sendGameResult(phaserController);

      // Assert
      const calledResult = mockOnGameComplete.mock.calls[0][0] as GameResult;
      expect(calledResult.scenarioId).toBe('night_crying');
    });

    it('GameResultのcompletedがbooleanであること', () => {
      // Act
      ReactBridge.sendGameResult(phaserController);

      // Assert
      const calledResult = mockOnGameComplete.mock.calls[0][0] as GameResult;
      expect(typeof calledResult.completed).toBe('boolean');
    });

    it('GameResultのplayerStatsが存在すること', () => {
      // Act
      ReactBridge.sendGameResult(phaserController);

      // Assert
      const calledResult = mockOnGameComplete.mock.calls[0][0] as GameResult;
      expect(calledResult.playerStats).toBeDefined();
      expect(calledResult.playerStats).toHaveProperty('totalSleepTime');
      expect(calledResult.playerStats).toHaveProperty('interruptedCount');
    });

    it('GameResultのfinalCatStatusが存在すること', () => {
      // Act
      ReactBridge.sendGameResult(phaserController);

      // Assert
      const calledResult = mockOnGameComplete.mock.calls[0][0] as GameResult;
      expect(calledResult.finalCatStatus).toBeDefined();
      expect(calledResult.finalCatStatus).toHaveProperty('affection');
      expect(calledResult.finalCatStatus).toHaveProperty('stress');
      expect(calledResult.finalCatStatus).toHaveProperty('health');
      expect(calledResult.finalCatStatus).toHaveProperty('hunger');
    });

    it('GameResultのeventHistoryが配列であること', () => {
      // Act
      ReactBridge.sendGameResult(phaserController);

      // Assert
      const calledResult = mockOnGameComplete.mock.calls[0][0] as GameResult;
      expect(Array.isArray(calledResult.eventHistory)).toBe(true);
    });

    it('GameResultのreportが存在すること', () => {
      // Act
      ReactBridge.sendGameResult(phaserController);

      // Assert
      const calledResult = mockOnGameComplete.mock.calls[0][0] as GameResult;
      expect(calledResult.report).toBeDefined();
      expect(calledResult.report).toHaveProperty('summary');
      expect(calledResult.report).toHaveProperty('strengths');
      expect(calledResult.report).toHaveProperty('weaknesses');
    });
  });
});
