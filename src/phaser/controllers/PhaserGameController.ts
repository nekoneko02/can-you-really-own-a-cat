/**
 * PhaserGameController
 *
 * GameController（Application層）のラッパークラス。
 * Phaser Sceneから使いやすくするための薄い層です。
 *
 * 責務:
 * - GameControllerの初期化と保持
 * - tick()/view()/getResult()の呼び出し
 * - エラーハンドリング
 */

import { GameController } from '@/application/GameController';
import { PlayerInput, GameView } from '@/application/types';
import { GameResult } from '@/domain/GameResult';

/**
 * PhaserGameController
 *
 * Phaserシーン内でGameControllerを使いやすくするラッパークラス。
 */
export class PhaserGameController {
  private gameController: GameController;

  /**
   * コンストラクタ
   *
   * @param gameController - GameControllerインスタンス
   */
  constructor(gameController: GameController) {
    if (!gameController) {
      throw new Error('GameController is required');
    }

    this.gameController = gameController;
  }

  /**
   * GameControllerインスタンスを取得
   *
   * @returns GameControllerインスタンス
   */
  getGameController(): GameController {
    return this.gameController;
  }

  /**
   * プレイヤー入力をDomainに送信
   *
   * @param input - プレイヤー入力
   */
  tick(input: PlayerInput): void {
    this.ensureInitialized();

    try {
      this.gameController.tick(input);
    } catch (error) {
      console.error('[PhaserGameController] tick() failed:', error);
      throw error;
    }
  }

  /**
   * 現在のゲーム状態を取得
   *
   * @returns ゲーム状態（描画用データ）
   */
  view(): GameView {
    this.ensureInitialized();

    try {
      return this.gameController.view();
    } catch (error) {
      console.error('[PhaserGameController] view() failed:', error);
      throw error;
    }
  }

  /**
   * ゲーム終了時の結果を取得
   *
   * @returns ゲーム結果（Reactに渡すデータ）
   *
   * TODO: GameController.getResult()が実装されたら有効化
   */
  // getResult(): GameResult {
  //   this.ensureInitialized();

  //   try {
  //     return this.gameController.getResult();
  //   } catch (error) {
  //     console.error('[PhaserGameController] getResult() failed:', error);
  //     throw error;
  //   }
  // }

  /**
   * GameControllerが初期化されているか確認
   *
   * @throws GameControllerが未初期化の場合、エラーを投げる
   */
  private ensureInitialized(): void {
    if (!this.gameController) {
      throw new Error('GameController is not initialized');
    }
  }
}
