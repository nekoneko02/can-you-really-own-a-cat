/**
 * ゲームコントローラー
 *
 * PhaserとDomainの仲介を行います。
 * - Phaserから入力（PlayerInput）を受け取る
 * - Domainを更新する
 * - Phaserに描画用データ（GameView）を返す
 */

import { Game } from '@/domain/Game';
import { PlayerInput, GameView, PlayerViewModel, CatViewModel } from './types';

export interface GameControllerParams {
  scenarioId: string;
  catName?: string;
}

export class GameController {
  private game: Game;

  constructor(params: GameControllerParams) {
    this.game = new Game({ scenarioId: params.scenarioId, catName: params.catName });
  }

  /**
   * プレイヤーの入力を処理する
   * @param input Phaserからの入力データ
   */
  public tick(input: PlayerInput): void {
    // 移動入力の処理
    if (input.direction) {
      this.processMovement(input.direction);
    }

    // インタラクション入力の処理
    if (input.interact) {
      this.processInteraction();
    }

    // 選択肢入力の処理
    if (input.choice) {
      this.processChoice(input.choice);
    }

    // 感情入力の処理
    if (input.emotion) {
      this.processEmotion(input.emotion);
    }

    // ゲーム状態の更新
    this.game.update();
  }

  /**
   * 現在のゲーム状態をViewModelとして返す
   */
  public view(): GameView {
    const player = this.game['player']; // private fieldへのアクセス（テスト用）
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
      time: this.game.getCurrentTime(),
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
   * 気持ちを記録
   */
  public recordEmotion(emotion: any): void {
    this.game.recordEmotionForCurrentEvent(emotion);
  }

  private processMovement(direction: any): void {
    const player = this.game['player'];
    player.move(direction);
  }

  private processInteraction(): void {
    const player = this.game['player'];
    player.interact('target'); // MVP版では簡略化
  }

  private processChoice(choiceId: string): void {
    console.log('[GameController] 選択肢を処理します:', choiceId);
    this.game.executeChoice(choiceId);
  }

  private processEmotion(emotion: any): void {
    // MVP版では感情記録は簡略化
    // 実際の記録はGameEventと連携する必要がある
  }
}
