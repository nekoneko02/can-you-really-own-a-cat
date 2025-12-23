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
import { NightCryActionSelector } from '@/domain/nightcry/NightCryActionSelector';
import { AutonomousActionType } from '@/domain/autonomous/AutonomousActionType';
import { TimeService } from './TimeService';
import { NightCryEventService, NightCryEventState } from './NightCryEventService';
import { CatBehaviorService } from './CatBehaviorService';
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
  private catBehaviorService: CatBehaviorService;
  private nightCryActionSelector: NightCryActionSelector;
  private lastPhase: GamePhase;

  constructor(params: GameParams) {
    this.game = new Game(params);
    this.timeService = new TimeService();
    this.nightCryEventService = new NightCryEventService(this.timeService);
    this.catBehaviorService = new CatBehaviorService(this.timeService);
    this.nightCryActionSelector = new NightCryActionSelector();

    // 初期フェーズを記録
    this.lastPhase = this.game.getPhase();

    // 初期フェーズに応じた猫の振る舞いを設定
    const cat = this.game['cat'];
    const history = this.game.getEventHistory();
    this.catBehaviorService.onPhaseChange(cat, this.lastPhase, history);
  }

  /**
   * ゲームを更新
   * @param input プレイヤー入力
   * @param deltaMs 経過ミリ秒
   */
  update(input: PlayerInput, deltaMs: number): void {
    // 時間を更新
    this.timeService.update(deltaMs);

    // フェーズ変更の検出と猫の振る舞い更新
    const currentPhase = this.game.getPhase();
    if (currentPhase !== this.lastPhase) {
      console.log(`[GameApplicationService] フェーズ変更検出: ${this.lastPhase} -> ${currentPhase}`);
      const cat = this.game['cat'];
      const history = this.game.getEventHistory();
      this.catBehaviorService.onPhaseChange(cat, currentPhase, history);
      this.lastPhase = currentPhase;
    }

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

    // 猫の自律的振る舞いを更新
    const cat = this.game['cat'];
    this.catBehaviorService.update(cat);

    // ゲーム状態の更新
    this.game.update();
  }

  /**
   * 夜泣きイベントのアクションを選択
   *
   * べき等性: 同じアクションなら何もしない（毎フレーム呼び出しても安全）
   */
  selectNightCryAction(actionType: NightCryActionType): void {
    if (!this.nightCryEventService.isActive()) {
      return;
    }

    const cat = this.game['cat'];
    const targetAction = this.mapNightCryToAutonomousAction(actionType);

    // べき等性: 同じアクションなら何もしない
    if (cat.autonomousBehaviorState.currentAction === targetAction) {
      return;
    }

    // NightCryEventService に通知
    this.nightCryEventService.selectAction(actionType);

    // RETURN_CAT の場合は先に表示状態を復元
    if (actionType === NightCryActionType.RETURN_CAT) {
      cat.setVisible(true);
    }

    // 選択肢に応じて猫の自律的振る舞いを切り替え
    if (targetAction) {
      this.catBehaviorService.startAction(cat, targetAction);
      console.log(`[GameApplicationService] 夜泣き選択肢 ${actionType} → 自律アクション ${targetAction} に切り替え`);
    }
  }

  /**
   * 夜泣きアクションタイプを自律的アクションタイプにマッピング
   *
   * 分岐はここに集約（多態性の入り口）
   */
  private mapNightCryToAutonomousAction(
    nightCryAction: NightCryActionType
  ): AutonomousActionType | null {
    switch (nightCryAction) {
      case NightCryActionType.PLAYING:
        // 遊んであげる → 一人遊び（嬉しそうに遊ぶ）
        return AutonomousActionType.IDLE_PLAYING;
      case NightCryActionType.PETTING:
        // 撫でてあげる → 撫でられ中（落ち着く）
        return AutonomousActionType.BEING_PETTED;
      case NightCryActionType.FEEDING_SNACK:
        // おやつをあげる → 座る（食べる）
        return AutonomousActionType.SITTING;
      case NightCryActionType.CATCHING:
        // 猫を捕まえようとする → 逃げる
        return AutonomousActionType.FLEEING;
      case NightCryActionType.LOCKED_OUT:
        // 猫を締め出し中 → 締め出し中
        return AutonomousActionType.LOCKED_OUT;
      case NightCryActionType.IGNORING:
        // 無視して寝続ける → 鳴く（継続）
        return AutonomousActionType.MEOWING;
      case NightCryActionType.STOP_CARE:
        // 遊ぶ/撫でるをやめる → ケア後待機
        return AutonomousActionType.WAITING_AFTER_CARE;
      case NightCryActionType.RETURN_CAT:
        // 締め出しから猫を戻す → 鳴く（復帰）
        return AutonomousActionType.MEOWING;
      default:
        return null;
    }
  }

  /**
   * ケアを停止して待機状態に遷移
   * @deprecated selectNightCryAction(STOP_CARE) を使用してください
   */
  stopCare(): void {
    this.selectNightCryAction(NightCryActionType.STOP_CARE);
  }

  /**
   * 締め出しを解除して猫を部屋に戻す
   * @deprecated selectNightCryAction(RETURN_CAT) を使用してください
   */
  returnCatToRoom(): void {
    this.selectNightCryAction(NightCryActionType.RETURN_CAT);
  }

  /**
   * 朝シーンへの遷移条件を確認
   */
  checkMorningTransitionCondition(): boolean {
    const cat = this.game['cat'];
    return this.catBehaviorService.checkMorningTransitionWithCat(cat);
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
      isVisible: cat.isVisible,
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
   * 夜泣きイベントで選択可能なアクション一覧を取得
   *
   * ドメイン層のNightCryActionSelectorに委譲
   */
  getAvailableNightCryActions(): NightCryActionType[] {
    const state = this.nightCryEventService.getState();
    return this.nightCryActionSelector.getAvailableActions(state.currentAction);
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

  /**
   * 猫の振る舞いサービスを取得（テスト用）
   */
  getCatBehaviorService(): CatBehaviorService {
    return this.catBehaviorService;
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
