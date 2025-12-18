/**
 * アセット読み込み管理
 *
 * MVP版ではプレースホルダー（色付き矩形）を動的生成します。
 * 将来のアセット差し替えに対応した設計にしています。
 */

import { AssetKeys } from './AssetKeys';

/**
 * プレースホルダー設定
 */
export interface PlaceholderConfig {
  width: number;
  height: number;
  color: number;
  label?: string; // オブジェクト用のテキストラベル
}

/**
 * アセットローダー
 */
export class AssetLoader {
  /**
   * MVP版かどうか（環境変数で制御可能）
   */
  static isMVPMode(): boolean {
    return process.env.NEXT_PUBLIC_USE_PLACEHOLDER_ASSETS !== 'false';
  }

  /**
   * プレースホルダー設定を取得
   *
   * @param key - アセットキー
   * @returns プレースホルダー設定
   */
  static getPlaceholderConfig(key: string): PlaceholderConfig {
    // 背景
    if (key === AssetKeys.Backgrounds.RoomNight) {
      return { width: 800, height: 600, color: 0x1a1a3e }; // 濃紺
    }
    if (key === AssetKeys.Backgrounds.RoomMidnight) {
      return { width: 800, height: 600, color: 0x0f0f1e }; // さらに暗い紺
    }
    if (key === AssetKeys.Backgrounds.RoomMorning) {
      return { width: 800, height: 600, color: 0xfffacd }; // 薄黄色
    }

    // プレイヤー
    if (key.startsWith('player_')) {
      return { width: 32, height: 48, color: 0x0000ff }; // 青
    }

    // 猫
    if (key.startsWith('cat_')) {
      return { width: 32, height: 32, color: 0xffa500 }; // オレンジ
    }

    // オブジェクト
    if (key === AssetKeys.Objects.Bed) {
      return { width: 96, height: 64, color: 0x8b4513, label: 'BED' }; // 茶色
    }
    if (key === AssetKeys.Objects.FoodBowl) {
      return { width: 32, height: 32, color: 0x808080, label: 'FOOD' }; // グレー
    }
    if (key === AssetKeys.Objects.LitterBox) {
      return { width: 48, height: 48, color: 0x228b22, label: 'TOILET' }; // 緑
    }
    if (key === AssetKeys.Objects.ToyShelf) {
      return { width: 64, height: 96, color: 0xffff00, label: 'TOY' }; // 黄色
    }
    if (key.startsWith('toy_')) {
      return { width: 16, height: 16, color: 0xffff00 }; // 黄色
    }

    // UI
    if (key.startsWith('button_')) {
      return { width: 200, height: 50, color: 0x666666 }; // グレー
    }
    if (key.startsWith('dialog_box')) {
      return { width: 700, height: 200, color: 0x000000 }; // 黒（半透明は後で設定）
    }
    if (key === AssetKeys.UI.StatusBarBg) {
      return { width: 200, height: 30, color: 0x333333 }; // 暗いグレー
    }
    if (key === AssetKeys.UI.StatusBarFill) {
      return { width: 180, height: 20, color: 0x00ff00 }; // 緑（動的に変更）
    }

    // アイコン
    if (key.startsWith('icon_')) {
      return { width: 24, height: 24, color: 0xffffff }; // 白（絵文字使用のため）
    }

    // デフォルト
    return { width: 32, height: 32, color: 0x808080 }; // グレー
  }

  /**
   * アセットパスを取得
   *
   * @param key - アセットキー
   * @returns アセットファイルパス
   */
  static getAssetPath(key: string): string {
    const category = this.getAssetCategory(key);
    return `/assets/${category}/${key}.png`;
  }

  /**
   * アセットカテゴリを取得
   *
   * @param key - アセットキー
   * @returns カテゴリ名
   */
  static getAssetCategory(key: string): string {
    // 背景
    if (key.startsWith('room_')) {
      return 'backgrounds';
    }

    // プレイヤー
    if (key.startsWith('player_')) {
      return 'characters/player';
    }

    // 猫
    if (key.startsWith('cat_')) {
      return 'characters/cat';
    }

    // オブジェクト
    if (
      key.startsWith('bed') ||
      key.startsWith('food_') ||
      key.startsWith('litter_') ||
      key.startsWith('toy_')
    ) {
      return 'objects';
    }

    // UI
    if (
      key.startsWith('button_') ||
      key.startsWith('dialog_') ||
      key.startsWith('status_')
    ) {
      return 'ui';
    }

    // アイコン
    if (key.startsWith('icon_')) {
      return 'icons';
    }

    return 'unknown';
  }

  /**
   * Phaserシーンでアセットを読み込む
   *
   * @param scene - Phaserシーン
   * @param key - アセットキー
   */
  static loadAsset(scene: Phaser.Scene, key: string): void {
    if (this.isMVPMode()) {
      // MVP版: プレースホルダーを動的生成
      this.loadPlaceholder(scene, key);
    } else {
      // 本番版: 実際のアセットファイルを読み込み
      const path = this.getAssetPath(key);
      scene.load.image(key, path);
    }
  }

  /**
   * プレースホルダーを動的生成してテクスチャに登録
   *
   * @param scene - Phaserシーン
   * @param key - アセットキー
   */
  private static loadPlaceholder(scene: Phaser.Scene, key: string): void {
    const config = this.getPlaceholderConfig(key);

    // すでに生成済みの場合はスキップ
    if (scene.textures.exists(key)) {
      return;
    }

    // Graphics で矩形を描画
    const graphics = scene.add.graphics();
    graphics.fillStyle(config.color, 1);
    graphics.fillRect(0, 0, config.width, config.height);

    // ラベルがあれば追加
    if (config.label) {
      const text = scene.add.text(
        config.width / 2,
        config.height / 2,
        config.label,
        {
          fontSize: '16px',
          color: '#ffffff',
        }
      );
      text.setOrigin(0.5, 0.5);
    }

    // テクスチャとして登録
    graphics.generateTexture(key, config.width, config.height);
    graphics.destroy();
  }

  /**
   * すべての必須アセットを一括読み込み
   *
   * @param scene - Phaserシーン
   */
  static loadAllAssets(scene: Phaser.Scene): void {
    // 背景
    Object.values(AssetKeys.Backgrounds).forEach((key) => {
      this.loadAsset(scene, key);
    });

    // プレイヤー
    Object.values(AssetKeys.Player).forEach((key) => {
      this.loadAsset(scene, key);
    });

    // 猫
    Object.values(AssetKeys.Cat).forEach((key) => {
      this.loadAsset(scene, key);
    });

    // オブジェクト
    Object.values(AssetKeys.Objects).forEach((key) => {
      this.loadAsset(scene, key);
    });

    // UI
    Object.values(AssetKeys.UI).forEach((key) => {
      this.loadAsset(scene, key);
    });

    // アイコン
    Object.values(AssetKeys.Icons).forEach((key) => {
      this.loadAsset(scene, key);
    });
  }
}
