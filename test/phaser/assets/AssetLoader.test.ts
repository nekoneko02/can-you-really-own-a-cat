/**
 * AssetLoaderのテスト
 *
 * TDDの原則に従い、実装前にテストを作成します。
 */

import { AssetLoader, PlaceholderConfig } from '@/phaser/assets/AssetLoader';
import { AssetKeys } from '@/phaser/assets/AssetKeys';

describe('AssetLoader', () => {
  describe('プレースホルダー生成', () => {
    it('背景用のプレースホルダー設定を返すこと', () => {
      const config = AssetLoader.getPlaceholderConfig(
        AssetKeys.Backgrounds.RoomNight
      );

      expect(config).toBeDefined();
      expect(config.width).toBe(800);
      expect(config.height).toBe(600);
      expect(config.color).toBe(0x1a1a3e); // 濃紺
    });

    it('プレイヤー用のプレースホルダー設定を返すこと', () => {
      const config = AssetLoader.getPlaceholderConfig(AssetKeys.Player.Idle);

      expect(config).toBeDefined();
      expect(config.width).toBe(32);
      expect(config.height).toBe(48);
      expect(config.color).toBe(0x0000ff); // 青
    });

    it('猫用のプレースホルダー設定を返すこと', () => {
      const config = AssetLoader.getPlaceholderConfig(AssetKeys.Cat.Sitting);

      expect(config).toBeDefined();
      expect(config.width).toBe(32);
      expect(config.height).toBe(32);
      expect(config.color).toBe(0xffa500); // オレンジ
    });

    it('オブジェクト用のプレースホルダー設定を返すこと', () => {
      const config = AssetLoader.getPlaceholderConfig(AssetKeys.Objects.Bed);

      expect(config).toBeDefined();
      expect(config.width).toBe(96);
      expect(config.height).toBe(64);
      expect(config.color).toBe(0x8b4513); // 茶色
    });

    it('未知のキーの場合、デフォルト設定を返すこと', () => {
      const config = AssetLoader.getPlaceholderConfig('unknown_key');

      expect(config).toBeDefined();
      expect(config.width).toBe(32);
      expect(config.height).toBe(32);
      expect(config.color).toBe(0x808080); // グレー
    });
  });

  describe('アセットパス解決', () => {
    it('背景アセットのパスを返すこと', () => {
      const path = AssetLoader.getAssetPath(AssetKeys.Backgrounds.RoomNight);

      expect(path).toBe('/assets/backgrounds/room_night.png');
    });

    it('プレイヤーアセットのパスを返すこと', () => {
      const path = AssetLoader.getAssetPath(AssetKeys.Player.WalkUp);

      expect(path).toBe('/assets/characters/player/player_walk_up.png');
    });

    it('猫アセットのパスを返すこと', () => {
      const path = AssetLoader.getAssetPath(AssetKeys.Cat.Running);

      expect(path).toBe('/assets/characters/cat/cat_running.png');
    });

    it('オブジェクトアセットのパスを返すこと', () => {
      const path = AssetLoader.getAssetPath(AssetKeys.Objects.ToyBall);

      expect(path).toBe('/assets/objects/toy_ball.png');
    });

    it('UIアセットのパスを返すこと', () => {
      const path = AssetLoader.getAssetPath(AssetKeys.UI.ButtonNormal);

      expect(path).toBe('/assets/ui/button_normal.png');
    });
  });

  describe('アセットカテゴリ判定', () => {
    it('背景キーの場合、"backgrounds"を返すこと', () => {
      const category = AssetLoader.getAssetCategory(
        AssetKeys.Backgrounds.RoomNight
      );

      expect(category).toBe('backgrounds');
    });

    it('プレイヤーキーの場合、"characters/player"を返すこと', () => {
      const category = AssetLoader.getAssetCategory(AssetKeys.Player.Idle);

      expect(category).toBe('characters/player');
    });

    it('猫キーの場合、"characters/cat"を返すこと', () => {
      const category = AssetLoader.getAssetCategory(AssetKeys.Cat.Meowing);

      expect(category).toBe('characters/cat');
    });

    it('オブジェクトキーの場合、"objects"を返すこと', () => {
      const category = AssetLoader.getAssetCategory(AssetKeys.Objects.Bed);

      expect(category).toBe('objects');
    });

    it('UIキーの場合、"ui"を返すこと', () => {
      const category = AssetLoader.getAssetCategory(AssetKeys.UI.DialogBox);

      expect(category).toBe('ui');
    });

    it('アイコンキーの場合、"icons"を返すこと', () => {
      const category = AssetLoader.getAssetCategory(AssetKeys.Icons.Affection);

      expect(category).toBe('icons');
    });

    it('未知のキーの場合、"unknown"を返すこと', () => {
      const category = AssetLoader.getAssetCategory('unknown_key');

      expect(category).toBe('unknown');
    });
  });

  describe('MVP判定', () => {
    it('MVP版の場合、trueを返すこと', () => {
      const isMVP = AssetLoader.isMVPMode();

      // 環境変数やフラグで制御（デフォルトはMVP版）
      expect(isMVP).toBe(true);
    });
  });
});
