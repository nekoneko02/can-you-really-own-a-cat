import * as Phaser from 'phaser';

/**
 * Phaser Game インスタンスの型定義
 */
export type PhaserGame = Phaser.Game;

/**
 * ScenarioScene の型定義
 */
export interface ScenarioSceneInterface extends Phaser.Scene {
  endGame?: () => Promise<void>;
  getCurrentEventIndex?: () => number;
  getScenario?: () => unknown;
}

/**
 * ScenarioScene の型エイリアス
 */
export type ScenarioScene = ScenarioSceneInterface;
