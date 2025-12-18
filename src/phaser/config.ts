/**
 * Phaserゲーム設定
 *
 * ゲーム全体の設定（解像度、レンダラー、シーン等）を定義します。
 */

import Phaser from 'phaser';

/**
 * ゲーム設定
 */
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL（フォールバック: Canvas）
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  parent: 'phaser-game', // Reactで指定するコンテナID
  dom: {
    createContainer: true, // DOM要素を使用可能にする
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }, // トップビューのため重力なし
      debug: false, // プロダクションではfalse
    },
  },
  scene: [], // BootSceneで動的に追加
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

/**
 * ゲーム設定を取得（シーンを動的に追加するため）
 *
 * @param scenes - 追加するシーンのリスト
 * @returns Phaser設定オブジェクト
 */
export function createGameConfig(
  scenes: Phaser.Types.Scenes.SceneType[]
): Phaser.Types.Core.GameConfig {
  return {
    ...gameConfig,
    scene: scenes,
  };
}
