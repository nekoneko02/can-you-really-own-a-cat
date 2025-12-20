/**
 * CharacterScaleCalculatorのテスト
 *
 * キャラクターのスケール計算をテストします。
 */

import { CharacterScaleCalculator } from '@/phaser/utils/CharacterScaleCalculator';

// Phaserモック型定義
interface MockTextureSource {
  width: number;
  height: number;
}

interface MockTexture {
  source: MockTextureSource[];
}

interface MockTextures {
  get: jest.Mock;
}

interface MockGame {
  config: {
    height: number;
  };
}

interface MockScene {
  textures: MockTextures;
  sys: {
    game: MockGame;
  };
}

// モック作成ヘルパー
function createMockScene(
  gameHeight: number,
  textureWidth: number,
  textureHeight: number,
  textureExists: boolean = true
): MockScene {
  const mockTexture: MockTexture = {
    source: [
      {
        width: textureWidth,
        height: textureHeight,
      },
    ],
  };

  const mockTextures: MockTextures = {
    get: jest.fn((key: string) => {
      if (!textureExists) {
        return null;
      }
      // フレームキー（例: "cat_idle_frame_0"）の場合
      if (key.includes('_frame_')) {
        return mockTexture;
      }
      // 通常のキー（例: "cat_idle"）の場合
      return mockTexture;
    }),
  };

  const mockScene: MockScene = {
    textures: mockTextures,
    sys: {
      game: {
        config: {
          height: gameHeight,
        },
      },
    },
  };

  return mockScene;
}

describe('CharacterScaleCalculator', () => {
  describe('calculate', () => {
    it('should calculate scale correctly for a square texture (100x100) with default ratio', () => {
      // ゲーム高さ600px、テクスチャサイズ100x100px
      // 目標サイズ = 600 * 0.2 = 120px
      // スケール = 120 / 100 = 1.2
      const mockScene = createMockScene(600, 100, 100);

      const scale = CharacterScaleCalculator.calculate(
        mockScene as any,
        'test_texture'
      );

      expect(scale).toBe(1.2);
    });

    it('should calculate scale correctly for a rectangular texture (width > height)', () => {
      // ゲーム高さ600px、テクスチャサイズ200x100px
      // 目標サイズ = 600 * 0.2 = 120px
      // 最大寸法 = 200px
      // スケール = 120 / 200 = 0.6
      const mockScene = createMockScene(600, 200, 100);

      const scale = CharacterScaleCalculator.calculate(
        mockScene as any,
        'test_texture'
      );

      expect(scale).toBe(0.6);
    });

    it('should calculate scale correctly for a rectangular texture (height > width)', () => {
      // ゲーム高さ600px、テクスチャサイズ100x200px
      // 目標サイズ = 600 * 0.2 = 120px
      // 最大寸法 = 200px
      // スケール = 120 / 200 = 0.6
      const mockScene = createMockScene(600, 100, 200);

      const scale = CharacterScaleCalculator.calculate(
        mockScene as any,
        'test_texture'
      );

      expect(scale).toBe(0.6);
    });

    it('should calculate scale correctly with custom target size ratio', () => {
      // ゲーム高さ600px、テクスチャサイズ100x100px
      // 目標サイズ = 600 * 0.3 = 180px
      // スケール = 180 / 100 = 1.8
      const mockScene = createMockScene(600, 100, 100);

      const scale = CharacterScaleCalculator.calculate(
        mockScene as any,
        'test_texture',
        0.3
      );

      expect(scale).toBe(1.8);
    });

    it('should return 1.0 when texture does not exist', () => {
      // テクスチャが存在しない場合
      const mockScene = createMockScene(600, 100, 100, false);

      const scale = CharacterScaleCalculator.calculate(
        mockScene as any,
        'nonexistent_texture'
      );

      // デフォルトスケール1.0が返される
      expect(scale).toBe(1.0);
    });

    it('should handle frame key (e.g., "texture_frame_0")', () => {
      // フレームキーの場合も正しく処理される
      const mockScene = createMockScene(600, 100, 100);

      const scale = CharacterScaleCalculator.calculate(
        mockScene as any,
        'test_texture'
      );

      // フレームキー "test_texture_frame_0" でテクスチャを取得
      expect(mockScene.textures.get).toHaveBeenCalledWith('test_texture_frame_0');
      expect(scale).toBe(1.2);
    });

    it('should fall back to original key when frame key does not exist', () => {
      // フレームキーが存在しない場合、元のキーで再試行
      const mockTexture: MockTexture = {
        source: [
          {
            width: 100,
            height: 100,
          },
        ],
      };

      const mockTextures: MockTextures = {
        get: jest.fn((key: string) => {
          // フレームキーの場合はnullを返す
          if (key.includes('_frame_')) {
            return null;
          }
          // 元のキーの場合はテクスチャを返す
          return mockTexture;
        }),
      };

      const mockScene: MockScene = {
        textures: mockTextures,
        sys: {
          game: {
            config: {
              height: 600,
            },
          },
        },
      };

      const scale = CharacterScaleCalculator.calculate(
        mockScene as any,
        'test_texture'
      );

      // 元のキー "test_texture" でテクスチャを取得
      expect(mockTextures.get).toHaveBeenCalledWith('test_texture');
      expect(scale).toBe(1.2);
    });
  });
});
