import * as Phaser from 'phaser';
import { PhaserGame, ScenarioScene } from '@/types/game';
import { Cat } from '@/domain/cat';
import { GameSession, Scenario } from '@/domain/game';
import { logDebug, logError, logInfo } from './log';

export interface GameConfig {
  cat?: Cat;
  scenario?: Scenario;
  session?: GameSession;
  onGameEnd?: () => Promise<void>;
  onEventComplete?: (eventIndex: number) => Promise<void>;
}

export interface GameManagerCallbacks {
  onGameReady?: (game: PhaserGame) => void;
  onGameStart?: () => void;
  onGameEnd?: () => void;
  onStateChange?: (state: GameState) => void;
}

export enum GameState {
  IDLE = 'idle',
  LOADING = 'loading',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ENDING = 'ending',
  ERROR = 'error'
}

export class GameManager {
  private _phaserGame: PhaserGame | null = null;
  private currentState: GameState = GameState.IDLE;
  private gameConfig: GameConfig | null = null;
  private callbacks: GameManagerCallbacks = {};

  private set phaserGame(value: PhaserGame | null) {
    if (value === null && this._phaserGame !== null) {
      logInfo('GameManager: phaserGame being set to null!', {
        stack: new Error().stack
      });
    }
    this._phaserGame = value;
  }

  private get phaserGame(): PhaserGame | null {
    return this._phaserGame;
  }

  constructor() {
    // StateSaver は削除（セッション管理はNext.js側で行う）
  }

  async startGame(
    parentElement: HTMLElement,
    config: GameConfig = {},
    callbacks: GameManagerCallbacks = {}
  ): Promise<boolean> {
    try {
      this.setState(GameState.LOADING);
      this.gameConfig = config;
      this.callbacks = callbacks;

      await this.destroyExistingGame();

      const phaserConfig = this.createPhaserConfig(parentElement, config);
      this.phaserGame = new Phaser.Game(phaserConfig) as PhaserGame;

      logInfo('GameManager: Phaser.Game created', {
        phaserGameExists: !!this.phaserGame,
        hasScene: !!(this.phaserGame && this.phaserGame.scene),
        hasEvents: !!(this.phaserGame && this.phaserGame.events)
      });

      // Phaserの初期化完了を待つ（ready イベントを確実に待つ）
      await new Promise<void>((resolve, reject) => {
        if (!this.phaserGame) {
          logError('GameManager: phaserGame is null in Promise');
          reject(new Error('phaserGame is null'));
          return;
        }

        const timeoutId = setTimeout(() => {
          logError('GameManager: Phaser initialization timeout');
          reject(new Error('Phaser initialization timeout'));
        }, 10000); // 10秒タイムアウト

        logInfo('GameManager: Waiting for Phaser ready event');
        this.phaserGame.events.once('ready', () => {
          clearTimeout(timeoutId);
          logInfo('GameManager: Phaser ready event fired');

          // ready イベント後も phaserGame が存在することを確認
          if (!this.phaserGame) {
            logError('GameManager: phaserGame is null after ready event');
            reject(new Error('phaserGame is null after ready event'));
            return;
          }

          resolve();
        });
      });

      logInfo('GameManager: After Promise wait', {
        phaserGameExists: !!this.phaserGame,
        hasScene: !!(this.phaserGame && this.phaserGame.scene)
      });

      logInfo('GameManager: Loading ScenarioScene class...');
      const ScenarioSceneClass = await this.loadScenarioScene();
      logInfo('GameManager: ScenarioScene class loaded');

      logInfo('GameManager: Checking phaserGame after loadScenarioScene', {
        phaserGameExists: !!this.phaserGame,
        hasScene: !!(this.phaserGame && this.phaserGame.scene)
      });

      if (!this.phaserGame) {
        throw new Error('phaserGame is null after loadScenarioScene');
      }

      if (!this.phaserGame.scene) {
        throw new Error('phaserGame.scene is null after initialization wait');
      }

      logInfo('GameManager: Getting scene manager');
      const sceneManager = this.phaserGame.scene as Phaser.Scenes.SceneManager;

      // 既存のシーンが存在する場合は削除
      if (sceneManager.getScene('ScenarioScene')) {
        logInfo('GameManager: Removing existing ScenarioScene');
        sceneManager.remove('ScenarioScene');
      }

      logInfo('GameManager: Adding ScenarioScene to Phaser', {
        hasCat: !!config.cat,
        hasScenario: !!config.scenario,
        hasSession: !!config.session
      });

      // Sceneを追加（configはコンストラクタには渡さない）
      sceneManager.add('ScenarioScene', ScenarioSceneClass, false);

      // Scene.init(data)でデータを渡してからstart
      const initData = {
        cat: config.cat,
        scenario: config.scenario,
        session: config.session,
        onGameEnd: this.handleGameEnd.bind(this),
        onEventComplete: config.onEventComplete
      };

      logInfo('GameManager: Starting ScenarioScene');
      sceneManager.start('ScenarioScene', initData);

      logInfo('GameManager: Scene started, setting state to PLAYING');
      this.setState(GameState.PLAYING);

      logInfo('GameManager: Calling onGameReady callback', {
        hasCallback: !!this.callbacks.onGameReady
      });
      if (this.callbacks.onGameReady) {
        this.callbacks.onGameReady(this.phaserGame);
      }

      logInfo('GameManager: Calling onGameStart callback', {
        hasCallback: !!this.callbacks.onGameStart
      });
      if (this.callbacks.onGameStart) {
        this.callbacks.onGameStart();
      }

      logInfo('GameManager: Setting up game end handlers');
      this.setupGameEndHandlers();

      logInfo('GameManager: startGame() completed successfully');
      return true;
    } catch (error) {
      logError('Failed to start game', { error: error instanceof Error ? error.message : String(error) });
      this.setState(GameState.ERROR);
      return false;
    }
  }

  async endGame(): Promise<void> {
    if (this.currentState === GameState.ENDING || this.currentState === GameState.IDLE) {
      return;
    }

    this.setState(GameState.ENDING);

    try {
      const scene = this.getGameScene();
      if (scene && 'endGame' in scene) {
        await (scene as unknown as { endGame: () => Promise<void> }).endGame();
      }

      if (this.callbacks.onGameEnd) {
        this.callbacks.onGameEnd();
      }

      await this.destroyExistingGame();
      this.setState(GameState.IDLE);
    } catch (error) {
      logError('Error ending game', { error: error instanceof Error ? error.message : String(error) });
      this.setState(GameState.ERROR);
    }
  }

  pauseGame(): void {
    if (this.currentState !== GameState.PLAYING) return;

    if (this.phaserGame) {
      (this.phaserGame.scene as Phaser.Scenes.SceneManager).pause('ScenarioScene');
      this.setState(GameState.PAUSED);
    }
  }

  resumeGame(): void {
    if (this.currentState !== GameState.PAUSED) return;

    if (this.phaserGame) {
      (this.phaserGame.scene as Phaser.Scenes.SceneManager).resume('ScenarioScene');
      this.setState(GameState.PLAYING);
    }
  }

  getCurrentEventIndex(): number {
    const scene = this.getGameScene();
    if (scene && 'getCurrentEventIndex' in scene) {
      return (scene as unknown as { getCurrentEventIndex: () => number }).getCurrentEventIndex();
    }
    return 0;
  }

  getGameState(): GameState {
    return this.currentState;
  }

  isGameActive(): boolean {
    return this.currentState === GameState.PLAYING || this.currentState === GameState.PAUSED;
  }

  getGame(): PhaserGame | null {
    return this.phaserGame;
  }

  private async destroyExistingGame(): Promise<void> {
    if (this.phaserGame) {
      logInfo('GameManager: destroyExistingGame() called - destroying Phaser instance');
      this.phaserGame.destroy(true);
      this.phaserGame = null;
    } else {
      logInfo('GameManager: destroyExistingGame() called - no Phaser instance to destroy');
    }
  }

  private async loadScenarioScene(): Promise<typeof import('@/presentation/game/ScenarioScene').default> {
    const { default: ScenarioScene } = await import('@/presentation/game/ScenarioScene');
    return ScenarioScene;
  }

  private createPhaserConfig(parentElement: HTMLElement, config: GameConfig): Phaser.Types.Core.GameConfig {
    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: parentElement,
      backgroundColor: '#87CEEB',
      render: {
        antialias: true,
        pixelArt: false,
        transparent: false,
        clearBeforeRender: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false,
        powerPreference: 'default',
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
    };
  }

  private getGameScene(): ScenarioScene | null {
    if (!this.phaserGame) return null;
    return this.phaserGame.scene.getScene('ScenarioScene') as ScenarioScene;
  }

  private setState(newState: GameState): void {
    if (this.currentState !== newState) {
      this.currentState = newState;
      if (this.callbacks.onStateChange) {
        this.callbacks.onStateChange(newState);
      }
    }
  }

  private async handleGameEnd(): Promise<void> {
    if (this.gameConfig?.onGameEnd) {
      await this.gameConfig.onGameEnd();
    }
  }

  private setupGameEndHandlers(): void {
    if (typeof window === 'undefined') return;

    const handleBeforeUnload = async () => {
      // 状態保存はNext.js側（onGameEnd コールバック）で行う
      if (this.gameConfig?.onGameEnd) {
        await this.gameConfig.onGameEnd();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // クリーンアップ関数を保存
    (this as unknown as { _removeBeforeUnload?: () => void })._removeBeforeUnload = () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }

  destroy(): void {
    logInfo('GameManager: destroy() called');
    this.destroyExistingGame();
    this.setState(GameState.IDLE);
    this.callbacks = {};
    this.gameConfig = null;

    const cleanupFn = (this as unknown as { _removeBeforeUnload?: () => void })._removeBeforeUnload;
    if (cleanupFn) {
      cleanupFn();
    }
  }
}