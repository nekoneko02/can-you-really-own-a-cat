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

});
