/**
 * GameApplicationService - ゲームアプリケーションサービス
 *
 * Application層の統括サービスです。
 * UI層からの入力を受け取り、適切なサービスに委譲します。
 * Domain層の状態をDTOに変換してUI層に返します。
 */

import { Game, GameParams } from '@/domain/Game';
import { GamePhase } from '@/domain/types';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';
import { TimeService } from './TimeService';
import { NightCryEventService, NightCryEventState } from './NightCryEventService';
import { PlayerInput, GameView, PlayerViewModel, CatViewModel } from './types';

/**
 * 夜泣きイベントビューモデル
 */
export interface NightCryEventViewModel {
  isActive: boolean;
  isCompleted: boolean;
  currentAction: NightCryActionType | null;
  satisfaction: number;
  resignation: number;
}

/**
 * フェーズ遷移結果
 */
export interface PhaseTransitionResult {
  shouldTransition: boolean;
  nextScene: string | null;
}

export class GameApplicationService {
  private game: Game;
  private timeService: TimeService;
  private nightCryEventService: NightCryEventService;

  constructor(params: GameParams) {
    this.game = new Game(params);
    this.timeService = new TimeService();
    this.nightCryEventService = new NightCryEventService(this.timeService);
  }

  /**
   * ゲームを更新
   * @param input プレイヤー入力
   * @param deltaMs 経過ミリ秒
   */
  update(input: PlayerInput, deltaMs: number): void {
    // 時間を更新
    this.timeService.update(deltaMs);

    // 移動入力の処理
    if (input.direction) {
      this.processMovement(input.direction);
    }

    // 夜泣きイベントが開始可能かチェック
    this.checkNightCryEventTrigger();

    // 夜泣きイベントの更新
    if (this.nightCryEventService.isActive()) {
      this.nightCryEventService.update();

      // 完了チェック
      if (this.nightCryEventService.isCompleted()) {
        this.completeNightCryEvent();
      }
    }

    // ゲーム状態の更新
    this.game.update();
  }

  /**
   * 夜泣きイベントのアクションを選択
   */
  selectNightCryAction(actionType: NightCryActionType): void {
    if (!this.nightCryEventService.isActive()) {
      return;
    }
    this.nightCryEventService.selectAction(actionType);
  }

  /**
   * 現在のゲーム状態を取得
   */
  getView(): GameView {
    const player = this.game['player'];
    const cat = this.game['cat'];
    const catStatusManager = this.game['catStatusManager'];
    const playerStats = this.game['playerStats'];
    const currentEvent = this.game['currentEvent'];

    const playerViewModel: PlayerViewModel = {
      x: player.x,
      y: player.y,
      animation: player.currentAnimation,
      hasToy: player.hasToy,
    };

    const catViewModel: CatViewModel = {
      name: cat.name,
      x: cat.x,
      y: cat.y,
      state: cat.state,
      mood: cat.mood,
      animation: cat.currentAnimation,
    };

    return {
      phase: this.game.getPhase(),
      time: this.timeService.getDisplayTime(),
      day: this.game.getCurrentDay(),
      player: playerViewModel,
      cat: catViewModel,
      currentEvent,
      currentScenario: null, // deprecated
      currentScenarioStep: this.game.getCurrentScenarioStep(),
      catStatus: catStatusManager.getStatus(),
      playerStats,
      isWaitingForEmotionInput: this.game.isWaitingForEmotionInput(),
    };
  }

  /**
   * 夜泣きイベントの状態を取得
   */
  getNightCryEventState(): NightCryEventViewModel {
    const state = this.nightCryEventService.getState();
    return {
      isActive: state.isActive,
      isCompleted: state.isCompleted,
      currentAction: state.currentAction,
      satisfaction: state.satisfaction,
      resignation: state.resignation,
    };
  }

  /**
   * フェーズ遷移をチェック
   */
  checkPhaseTransition(): PhaseTransitionResult {
    const phase = this.game.getPhase();

    if (phase === GamePhase.MORNING_OUTRO) {
      return { shouldTransition: true, nextScene: 'MorningPhaseScene' };
    }
    if (phase === GamePhase.GAME_END) {
      return { shouldTransition: true, nextScene: 'GameEndScene' };
    }

    return { shouldTransition: false, nextScene: null };
  }

  /**
   * 時間サービスを取得（テスト用）
   */
  getTimeService(): TimeService {
    return this.timeService;
  }

  /**
   * 夜泣きイベントサービスを取得（テスト用）
   */
  getNightCryEventService(): NightCryEventService {
    return this.nightCryEventService;
  }

  /**
   * Gameを取得（テスト用・互換性用）
   */
  getGame(): Game {
    return this.game;
  }

  private processMovement(direction: any): void {
    const player = this.game['player'];
    player.move(direction);
  }

  private checkNightCryEventTrigger(): void {
    const phase = this.game.getPhase();
    const currentEvent = this.game['currentEvent'];

    // 夜中フェーズでイベントがある場合、夜泣きイベントを開始
    if (phase === GamePhase.MIDNIGHT_EVENT && currentEvent && !this.nightCryEventService.isActive()) {
      if (currentEvent.id.includes('night_crying')) {
        this.nightCryEventService.start();
        this.timeService.setDisplayTime(300); // 3:00
      }
    }
  }

  private completeNightCryEvent(): void {
    const result = this.nightCryEventService.stop();

    // 統計更新などの処理
    console.log('[GameApplicationService] 夜泣きイベント完了', result);

    // イベント完了をGameに通知
    this.game.completeCurrentEvent();

    // 朝フェーズに遷移
    this.game.transitionToMorning();
    this.timeService.setDisplayTime(700); // 7:00
  }
}
