/**
 * ReactBridge - ReactとPhaserの連携
 *
 * ゲーム終了時にReactへデータを送信します。
 */

import type { PhaserGameController } from '../controllers/PhaserGameController';
import type { GameResult } from './types';

/**
 * ReactBridge
 */
export class ReactBridge {
  /**
   * ゲーム結果をReactへ送信
   *
   * @param controller - PhaserGameController
   */
  static sendGameResult(controller: PhaserGameController): void {
    console.log('[ReactBridge] ゲーム結果をReactへ送信');

    // GameResultを生成
    const result = this.createGameResult(controller);

    // window.onGameCompleteを呼び出し
    const globalWindow = typeof window !== 'undefined' ? window : (global as any).window;

    if (globalWindow && globalWindow.onGameComplete) {
      globalWindow.onGameComplete(result);
      console.log('[ReactBridge] ゲーム結果を送信しました', result);
    } else {
      console.warn('[ReactBridge] window.onGameComplete is not defined');
    }
  }

  /**
   * GameResultを生成
   *
   * @param controller - PhaserGameController
   * @returns GameResult
   */
  private static createGameResult(
    controller: PhaserGameController
  ): GameResult {
    const gameView = controller.view();

    // TODO: GameController.getResult()が実装されたら、そこから取得する
    // 現在は仮データを返す

    return {
      scenarioId: 'night_crying',
      completed: true,
      playerStats: {
        totalSleepTime: gameView.playerStats.totalSleepHours,
        interruptedCount: gameView.playerStats.interruptionCount,
        playedCount: gameView.playerStats.playCount,
        pettedCount: 0, // TODO: pettedCountを実装
      },
      finalCatStatus: {
        affection: gameView.catStatus.affection,
        stress: gameView.catStatus.stress,
        health: gameView.catStatus.health,
        hunger: gameView.catStatus.hunger,
      },
      eventHistory: [],
      report: {
        summary: this.generateSummary(gameView),
        strengths: this.generateStrengths(gameView),
        weaknesses: this.generateWeaknesses(gameView),
      },
    };
  }

  /**
   * 総括を生成（仮実装）
   */
  private static generateSummary(gameView: any): string {
    // TODO: 実際のレポート生成ロジックを実装
    return 'あなたは1週間、猫との生活を体験しました。';
  }

  /**
   * 得意だったことを生成（仮実装）
   */
  private static generateStrengths(gameView: any): string[] {
    // TODO: 実際のレポート生成ロジックを実装
    const strengths: string[] = [];

    if (gameView.playerStats.playedCount > 3) {
      strengths.push('遊び相手');
    }
    if (gameView.playerStats.pettedCount > 5) {
      strengths.push('スキンシップ');
    }

    return strengths;
  }

  /**
   * 苦手だったことを生成（仮実装）
   */
  private static generateWeaknesses(gameView: any): string[] {
    // TODO: 実際のレポート生成ロジックを実装
    const weaknesses: string[] = [];

    if (gameView.playerStats.interruptedCount > 10) {
      weaknesses.push('睡眠不足への対応');
      weaknesses.push('夜中の対応');
    }

    return weaknesses;
  }
}
