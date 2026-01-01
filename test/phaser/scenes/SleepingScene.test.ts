/**
 * SleepingScene のシーン遷移テスト
 *
 * hasEvent フラグに応じた正しいシーン遷移をテストします。
 * Issue #45: シナリオ起動フローの修正
 */

// Phaserをモック
jest.mock('phaser', () => ({
  Scene: class MockScene {
    constructor(config: { key: string }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).scene = { key: config.key };
    }
  },
  Math: {
    Between: jest.fn((min: number) => min),
  },
}));

// GameControllerをモック
jest.mock('@/application/GameController', () => ({
  GameController: jest.fn(),
}));

import { SleepingScene } from '@/phaser/scenes/SleepingScene';

describe('SleepingScene', () => {
  let scene: SleepingScene;
  let mockSceneStart: jest.Mock;
  let mockFadeOut: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    scene = new SleepingScene();

    mockSceneStart = jest.fn();
    mockFadeOut = jest.fn();

    // 必要なモックを設定
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (scene as any).cameras = {
      main: {
        fadeOut: mockFadeOut,
        fadeIn: jest.fn(),
        once: jest.fn((_event: string, callback: () => void) => callback?.()),
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (scene as any).scene = {
      key: 'SleepingScene',
      start: mockSceneStart,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (scene as any).registry = {
      get: jest.fn(() => ({})), // GameControllerのモック
    };
  });

  describe('シーン遷移', () => {
    it('hasEventがtrueの場合、NightcryPhase1Sceneへ遷移する', () => {
      // シーンを初期化（hasEvent: true）
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scene as any).init({ hasEvent: true, eventId: 'nightcry' });

      // transitionToNextSceneを呼び出し
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scene as any).transitionToNextScene();

      // フェードアウトが実行される
      expect(mockFadeOut).toHaveBeenCalledWith(500, 0, 0, 0);

      // NightcryPhase1Sceneへ遷移する
      expect(mockSceneStart).toHaveBeenCalledWith('NightcryPhase1Scene');
    });

    it('hasEventがfalseの場合、MorningPhaseSceneへ遷移する', () => {
      // シーンを初期化（hasEvent: false）
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scene as any).init({ hasEvent: false, eventId: null });

      // transitionToNextSceneを呼び出し
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scene as any).transitionToNextScene();

      // フェードアウトが実行される
      expect(mockFadeOut).toHaveBeenCalledWith(500, 0, 0, 0);

      // MorningPhaseSceneへ遷移する
      expect(mockSceneStart).toHaveBeenCalledWith(
        'MorningPhaseScene',
        expect.objectContaining({ hadNightCryEvent: false })
      );
    });

    it('hasEventが指定されない場合、falseとして扱いMorningPhaseSceneへ遷移する', () => {
      // シーンを初期化（パラメータなし）
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scene as any).init({});

      // transitionToNextSceneを呼び出し
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scene as any).transitionToNextScene();

      // MorningPhaseSceneへ遷移する
      expect(mockSceneStart).toHaveBeenCalledWith(
        'MorningPhaseScene',
        expect.objectContaining({ hadNightCryEvent: false })
      );
    });
  });
});
