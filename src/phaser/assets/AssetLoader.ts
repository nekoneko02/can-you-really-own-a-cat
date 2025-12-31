/**
 * アセット読み込み管理
 *
 * 常に実際のアセットファイルを読み込み、失敗時のみプレースホルダーを生成します。
 */

import { AssetKeys } from './AssetKeys';
import {
  getAllFrameAssets,
  getAllImageAssets,
  getAllAudioAssets,
  type AssetFrameConfig,
  type AssetImageConfig,
  type AssetAudioConfig,
} from '@/constants/assets';

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
  private static failedAssets: Set<string> = new Set();

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
   * @remarks 読み込み失敗時は自動的にプレースホルダーを生成します
   */
  static loadAllAssets(scene: Phaser.Scene): void {
    // エラーハンドリング: 読み込み失敗時にプレースホルダーを生成
    scene.load.on('loaderror', (file: { key: string; url: string }) => {
      console.error(`[AssetLoader] アセット読み込み失敗: ${file.key} (${file.url})`);
      this.failedAssets.add(file.key);
    });

    // 読み込み完了後にプレースホルダーを生成
    scene.load.on('complete', () => {
      this.createPlaceholdersForFailedAssets(scene);
    });

    // アニメーション用アセット（プレイヤー・猫）
    this.loadFrameAssets(scene);

    // 単一画像アセット（背景・オブジェクト・UI・アイコン）
    this.loadImageAssets(scene);

    // 音声アセット
    this.loadAudioAssets(scene);
  }

  /**
   * アニメーション用アセットを読み込む（各フレームを個別に読み込み）
   *
   * @param scene - Phaserシーン
   */
  private static loadFrameAssets(scene: Phaser.Scene): void {
    const frameAssets = getAllFrameAssets();

    for (const assetConfig of frameAssets) {
      assetConfig.frames.forEach((frameUrl, index) => {
        const frameKey = `${assetConfig.key}_frame_${index}`;
        scene.load.image(frameKey, frameUrl);
      });
    }
  }

  /**
   * 単一画像アセットを読み込む
   *
   * @param scene - Phaserシーン
   */
  private static loadImageAssets(scene: Phaser.Scene): void {
    const imageAssets = getAllImageAssets();

    for (const assetConfig of imageAssets) {
      scene.load.image(assetConfig.key, assetConfig.url);
    }
  }

  /**
   * 音声アセットを読み込む
   *
   * @param scene - Phaserシーン
   */
  private static loadAudioAssets(scene: Phaser.Scene): void {
    const audioAssets = getAllAudioAssets();

    for (const assetConfig of audioAssets) {
      scene.load.audio(assetConfig.key, assetConfig.url);
    }
  }

  /**
   * 読み込み失敗したアセットのプレースホルダーを生成
   *
   * @param scene - Phaserシーン
   */
  private static createPlaceholdersForFailedAssets(scene: Phaser.Scene): void {
    if (this.failedAssets.size === 0) {
      return;
    }

    console.warn(
      `[AssetLoader] ${this.failedAssets.size}個のアセット読み込みに失敗しました。プレースホルダーを生成します。`
    );

    // 失敗したアセットに対してプレースホルダーを生成
    for (const failedKey of this.failedAssets) {
      // フレームキー（例: cat_walking_frame_0）からベースキー（例: cat_walking）を抽出
      const baseKey = failedKey.replace(/_frame_\d+$/, '');

      if (!scene.textures.exists(baseKey)) {
        this.loadPlaceholder(scene, baseKey);
        console.log(`[AssetLoader] プレースホルダー生成: ${baseKey}`);
      }
    }
  }

  /**
   * アセット読み込み完了後にアニメーションを生成
   *
   * @param scene - Phaserシーン
   * @remarks Phaserのload.onイベント（'complete'）内で呼び出すこと
   */
  static createAnimations(scene: Phaser.Scene): void {
    const frameAssets = getAllFrameAssets();

    for (const assetConfig of frameAssets) {
      // すでにアニメーションが存在する場合はスキップ
      if (scene.anims.exists(assetConfig.key)) {
        continue;
      }

      const validFrames: Array<{ key: string; frame: number }> = [];

      // 実際のアセットフレームを収集
      assetConfig.frames.forEach((_, index) => {
        const frameKey = `${assetConfig.key}_frame_${index}`;
        if (scene.textures.exists(frameKey)) {
          validFrames.push({ key: frameKey, frame: 0 });
        }
      });

      // 実際のフレームがない場合、プレースホルダーを使用
      if (validFrames.length === 0 && scene.textures.exists(assetConfig.key)) {
        validFrames.push({ key: assetConfig.key, frame: 0 });
        console.warn(
          `[AssetLoader] アニメーション ${assetConfig.key} はプレースホルダーを使用しています`
        );
      }

      // 有効なフレームがある場合のみアニメーション作成
      if (validFrames.length > 0) {
        scene.anims.create({
          key: assetConfig.key,
          frames: validFrames,
          frameRate: assetConfig.frameRate,
          repeat: -1,
        });
      } else {
        console.error(
          `[AssetLoader] アニメーション ${assetConfig.key} の作成に失敗: 有効なフレームがありません`
        );
      }
    }
  }
}
