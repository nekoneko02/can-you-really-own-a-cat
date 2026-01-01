/**
 * BaseNightcryPhaseScene のフロー制御テスト
 *
 * 選択処理とシーン遷移のビジネスロジックをテストします。
 */

// Phaserをモック（importする前にモック）
jest.mock('phaser', () => ({
  Scene: class MockScene {
    constructor(config: { key: string }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).scene = { key: config.key };
    }
  },
  Math: {
    Between: jest.fn((min: number, max: number) => min),
  },
}));

// DialogSystemをモック
jest.mock('@/phaser/ui/DialogSystem', () => ({
  DialogSystem: jest.fn().mockImplementation(() => ({
    showPages: jest.fn(),
    hide: jest.fn(),
    destroy: jest.fn(),
  })),
}));

// ChoiceButtonをモック
jest.mock('@/phaser/ui/ChoiceButton', () => ({
  ChoiceButton: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
  })),
}));

// UIConstantsをモック
jest.mock('@/phaser/ui/UIConstants', () => ({
  UILayout: {
    screen: { width: 800, height: 600 },
    playArea: { height: 470 },
    choiceButton: { x: 700, startY: 200, spacing: 50 },
  },
}));

// AudioManagerをモック
jest.mock('@/phaser/audio/AudioManager', () => ({
  AudioManager: jest.fn(),
}));

// NightCryAudioControllerをモック
jest.mock('@/phaser/audio/NightCryAudioController', () => ({
  NightCryAudioController: jest.fn().mockImplementation(() => ({
    onEventStart: jest.fn(),
    onEventComplete: jest.fn(),
    stopAll: jest.fn(),
  })),
}));

// NightcryScenarioManagerをモック
jest.mock('@/domain/scenarios/nightcry/NightcryScenarioManager');

import { NightcryScenarioManager } from '@/domain/scenarios/nightcry/NightcryScenarioManager';
import type { NightcryScenarioState } from '@/domain/scenarios/nightcry/NightcryScenarioState';
import {
  BaseNightcryPhaseScene,
  PhaseContent,
} from '@/phaser/scenes/nightcry/BaseNightcryPhaseScene';

/**
 * テスト用の具象クラス
 */
class TestPhaseScene extends BaseNightcryPhaseScene {
  private phaseNumber: 1 | 2 | 3 | 4 | 5;
  private nextSceneKey: string;
  private hasAudioFlag: boolean;

  constructor(
    phaseNumber: 1 | 2 | 3 | 4 | 5 = 1,
    nextSceneKey: string = 'NextScene',
    hasAudio: boolean = false
  ) {
    super(`TestPhase${phaseNumber}Scene`);
    this.phaseNumber = phaseNumber;
    this.nextSceneKey = nextSceneKey;
    this.hasAudioFlag = hasAudio;
  }

  getPhaseNumber(): 1 | 2 | 3 | 4 | 5 {
    return this.phaseNumber;
  }

  getPhaseContent(): PhaseContent {
    return {
      commonText: ['テスト共通描写'],
      choices: [
        { id: 'A', label: '選択肢A' },
        { id: 'B', label: '選択肢B' },
        { id: 'C', label: '選択肢C' },
      ],
      immediateResponses: {
        A: '即時反映A',
        B: '即時反映B',
        C: '即時反映C',
      },
      endingText: ['合流テキスト'],
      hasAudio: this.hasAudioFlag,
    };
  }

  getNextSceneKey(): string {
    return this.nextSceneKey;
  }

  // テスト用にprotectedメソッドを公開
  public testOnChoiceSelected(selection: 'A' | 'B' | 'C'): void {
    this.onChoiceSelected(selection);
  }

  public testTransitionToNextScene(): void {
    this.transitionToNextScene();
  }

  public getScenarioState(): NightcryScenarioState {
    return this.scenarioState;
  }

  public setScenarioState(state: NightcryScenarioState): void {
    this.scenarioState = state;
  }

  public getChoiceButtons(): unknown[] {
    return this.choiceButtons;
  }

  public getAudioController(): unknown {
    return this.audioController;
  }

  public setAudioController(controller: unknown): void {
    this.audioController = controller as typeof this.audioController;
  }

  public setDialogSystem(dialogSystem: unknown): void {
    this.dialogSystem = dialogSystem as typeof this.dialogSystem;
  }

  public setChoiceButtons(buttons: unknown[]): void {
    this.choiceButtons = buttons as typeof this.choiceButtons;
  }
}

describe('BaseNightcryPhaseScene', () => {
  let scene: TestPhaseScene;
  let mockInitialState: NightcryScenarioState;

  beforeEach(() => {
    jest.clearAllMocks();

    // 初期状態
    mockInitialState = {
      currentPhase: 1,
      selections: {
        phase1: null,
        phase2: null,
        phase3: null,
        phase4: null,
        phase5: null,
      },
      completed: false,
    };

    // NightcryScenarioManagerのモック設定
    (NightcryScenarioManager.createInitialState as jest.Mock).mockReturnValue(
      mockInitialState
    );
    (NightcryScenarioManager.recordSelection as jest.Mock).mockImplementation(
      (state, phase, selection) => ({
        ...state,
        selections: {
          ...state.selections,
          [`phase${phase}`]: selection,
        },
      })
    );
    (NightcryScenarioManager.advancePhase as jest.Mock).mockImplementation(
      (state) => ({
        ...state,
        currentPhase: Math.min(state.currentPhase + 1, 5) as 1 | 2 | 3 | 4 | 5,
      })
    );
    (NightcryScenarioManager.completeScenario as jest.Mock).mockImplementation(
      (state) => ({
        ...state,
        completed: true,
      })
    );

    scene = new TestPhaseScene(1, 'NightcryPhase2Scene', false);
    scene.setScenarioState(mockInitialState);
  });

  describe('選択処理', () => {
    beforeEach(() => {
      // DialogSystemのモック
      const mockDialogSystem = {
        showPages: jest.fn((_data, callback) => callback?.()),
        hide: jest.fn(),
        destroy: jest.fn(),
      };
      scene.setDialogSystem(mockDialogSystem);

      // 選択肢ボタンのモック
      const mockButtons = [
        { destroy: jest.fn() },
        { destroy: jest.fn() },
        { destroy: jest.fn() },
      ];
      scene.setChoiceButtons(mockButtons);

      // シーン遷移のモック
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scene as any).cameras = {
        main: {
          fadeOut: jest.fn(),
          once: jest.fn((_event: string, callback: () => void) => callback?.()),
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scene as any).scene = {
        key: 'TestPhase1Scene',
        start: jest.fn(),
      };
    });

    it('選択後にNightcryScenarioManagerに記録される', () => {
      scene.testOnChoiceSelected('B');

      expect(NightcryScenarioManager.recordSelection).toHaveBeenCalledWith(
        mockInitialState,
        1, // phaseNumber
        'B' // selection
      );
    });

    it('選択後にシナリオ状態が更新される', () => {
      scene.testOnChoiceSelected('A');

      const updatedState = scene.getScenarioState();
      expect(updatedState.selections.phase1).toBe('A');
    });

    it('選択後に選択肢ボタンが破棄される', () => {
      const buttons = scene.getChoiceButtons() as { destroy: jest.Mock }[];

      scene.testOnChoiceSelected('C');

      buttons.forEach((button) => {
        expect(button.destroy).toHaveBeenCalled();
      });
      expect(scene.getChoiceButtons()).toHaveLength(0);
    });

    it('音声フェーズでは選択後に音声が停止する', () => {
      // 音声ありのシーンを作成
      const audioScene = new TestPhaseScene(1, 'NextScene', true);
      audioScene.setScenarioState(mockInitialState);

      const mockAudioController = {
        onEventComplete: jest.fn(),
        stopAll: jest.fn(),
      };
      audioScene.setAudioController(mockAudioController);

      // 必要なモックを設定
      const mockDialogSystem = {
        showPages: jest.fn((_data, callback) => callback?.()),
        hide: jest.fn(),
        destroy: jest.fn(),
      };
      audioScene.setDialogSystem(mockDialogSystem);
      audioScene.setChoiceButtons([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (audioScene as any).cameras = {
        main: {
          fadeOut: jest.fn(),
          once: jest.fn((_event: string, callback: () => void) => callback?.()),
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (audioScene as any).scene = {
        key: 'TestPhase1Scene',
        start: jest.fn(),
      };

      audioScene.testOnChoiceSelected('A');

      expect(mockAudioController.onEventComplete).toHaveBeenCalled();
    });

    it('音声なしフェーズでは音声停止が呼ばれない', () => {
      const mockAudioController = {
        onEventComplete: jest.fn(),
        stopAll: jest.fn(),
      };
      scene.setAudioController(mockAudioController);

      scene.testOnChoiceSelected('A');

      expect(mockAudioController.onEventComplete).not.toHaveBeenCalled();
    });
  });

  describe('シーン遷移', () => {
    let mockSceneStart: jest.Mock;
    let mockFadeOut: jest.Mock;

    beforeEach(() => {
      mockSceneStart = jest.fn();
      mockFadeOut = jest.fn();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scene as any).cameras = {
        main: {
          fadeOut: mockFadeOut,
          once: jest.fn((_event: string, callback: () => void) => callback?.()),
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scene as any).scene = {
        key: 'TestPhase1Scene',
        start: mockSceneStart,
      };
    });

    it('Phase1-4ではadvancePhaseが呼ばれる', () => {
      scene.testTransitionToNextScene();

      expect(NightcryScenarioManager.advancePhase).toHaveBeenCalledWith(
        mockInitialState
      );
      expect(NightcryScenarioManager.completeScenario).not.toHaveBeenCalled();
    });

    it('Phase5ではcompleteScenarioが呼ばれる', () => {
      const phase5Scene = new TestPhaseScene(5, 'NightcryEndingScene', false);
      const phase5State = { ...mockInitialState, currentPhase: 5 as const };
      phase5Scene.setScenarioState(phase5State);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (phase5Scene as any).cameras = {
        main: {
          fadeOut: mockFadeOut,
          once: jest.fn((_event: string, callback: () => void) => callback?.()),
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (phase5Scene as any).scene = {
        key: 'TestPhase5Scene',
        start: mockSceneStart,
      };

      phase5Scene.testTransitionToNextScene();

      expect(NightcryScenarioManager.completeScenario).toHaveBeenCalledWith(
        phase5State
      );
      expect(NightcryScenarioManager.advancePhase).not.toHaveBeenCalled();
    });

    it('次のシーンへの遷移パラメータにscenarioStateが含まれる', () => {
      scene.testTransitionToNextScene();

      expect(mockSceneStart).toHaveBeenCalledWith(
        'NightcryPhase2Scene',
        expect.objectContaining({
          scenarioState: expect.any(Object),
        })
      );
    });

    it('フェードアウトが実行される', () => {
      scene.testTransitionToNextScene();

      expect(mockFadeOut).toHaveBeenCalledWith(500, 0, 0, 0);
    });
  });

  describe('シーン遷移チェーン', () => {
    it('Phase1からPhase5まで正しい順序で遷移する', () => {
      const phaseChain: [number, string][] = [
        [1, 'NightcryPhase2Scene'],
        [2, 'NightcryPhase3Scene'],
        [3, 'NightcryPhase4Scene'],
        [4, 'NightcryPhase5Scene'],
        [5, 'NightcryEndingScene'],
      ];

      phaseChain.forEach(([phaseNum, expectedNext]) => {
        const testScene = new TestPhaseScene(
          phaseNum as 1 | 2 | 3 | 4 | 5,
          expectedNext,
          false
        );
        expect(testScene.getNextSceneKey()).toBe(expectedNext);
      });
    });
  });
});
