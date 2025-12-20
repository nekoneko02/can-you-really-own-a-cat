/**
 * PlayerCharacterのテスト
 *
 * プレイヤーキャラクターの表示とアニメーション管理をテストします。
 */

import { PlayerCharacter } from '@/phaser/characters/PlayerCharacter';
import { PlayerViewModel } from '@/application/types';

// Phaserモック型定義
interface MockAnim {
  currentAnim?: {
    key: string;
  } | null;
  play: jest.Mock;
  exists: jest.Mock;
}

interface MockTextureSource {
  width: number;
  height: number;
}

interface MockTexture {
  source: MockTextureSource[];
}

interface MockSprite {
  x: number;
  y: number;
  setPosition: jest.Mock;
  setDisplaySize: jest.Mock;
  setScale: jest.Mock;
  anims: MockAnim;
  play: jest.Mock;
  destroy: jest.Mock;
}

interface MockScene {
  add: {
    sprite: jest.Mock;
  };
  anims: {
    exists: jest.Mock;
  };
  textures: {
    get: jest.Mock;
  };
  sys: {
    game: {
      config: {
        height: number;
      };
    };
  };
}

// モック作成ヘルパー
function createMockScene(): { scene: MockScene; sprite: MockSprite } {
  const mockTexture: MockTexture = {
    source: [
      {
        width: 100,
        height: 100,
      },
    ],
  };

  const mockSprite: MockSprite = {
    x: 0,
    y: 0,
    setPosition: jest.fn((x: number, y: number) => {
      mockSprite.x = x;
      mockSprite.y = y;
    }),
    setDisplaySize: jest.fn(),
    setScale: jest.fn(),
    anims: {
      currentAnim: null,
      play: jest.fn(),
      exists: jest.fn(() => true),
    },
    play: jest.fn(),
    destroy: jest.fn(),
  };

  const mockScene: MockScene = {
    add: {
      sprite: jest.fn(() => mockSprite),
    },
    anims: {
      exists: jest.fn(() => true),
    },
    textures: {
      get: jest.fn(() => mockTexture),
    },
    sys: {
      game: {
        config: {
          height: 600,
        },
      },
    },
  };

  return { scene: mockScene, sprite: mockSprite };
}

describe('PlayerCharacter', () => {
  let mockScene: MockScene;
  let mockSprite: MockSprite;
  let playerCharacter: PlayerCharacter;

  beforeEach(() => {
    const mocks = createMockScene();
    mockScene = mocks.scene;
    mockSprite = mocks.sprite;

    // PlayerCharacterを作成
    playerCharacter = new PlayerCharacter(
      mockScene as any,
      100,
      200,
      'player_idle'
    );
  });

  describe('constructor', () => {
    it('should create sprite with correct parameters', () => {
      expect(mockScene.add.sprite).toHaveBeenCalledWith(100, 200, 'player_idle');
      // スケールが計算されて設定される
      // ゲーム高さ600px、テクスチャ100x100px、目標比率0.2
      // 目標サイズ = 600 * 0.2 = 120px
      // スケール = 120 / 100 = 1.2
      expect(mockSprite.setScale).toHaveBeenCalledWith(1.2);
    });
  });

  describe('update', () => {
    it('should update position based on viewModel', () => {
      const viewModel: PlayerViewModel = {
        x: 150,
        y: 250,
        animation: 'player_idle',
        hasToy: false,
      };

      playerCharacter.update(viewModel);

      expect(mockSprite.setPosition).toHaveBeenCalledWith(150, 250);
    });

    it('should play animation when animation key changes', () => {
      const viewModel: PlayerViewModel = {
        x: 150,
        y: 250,
        animation: 'player_walk_up',
        hasToy: false,
      };

      // アニメーションが存在することを確認
      mockSprite.anims.exists.mockReturnValue(true);

      playerCharacter.update(viewModel);

      expect(mockSprite.play).toHaveBeenCalledWith('player_walk_up');
    });

    it('should not play animation when animation key is the same', () => {
      const viewModel1: PlayerViewModel = {
        x: 150,
        y: 250,
        animation: 'player_walk_up',
        hasToy: false,
      };

      // 現在のアニメーションを設定
      mockSprite.anims.currentAnim = { key: 'player_walk_up' };
      mockSprite.anims.exists.mockReturnValue(true);

      playerCharacter.update(viewModel1);

      // 同じアニメーションの場合、playは呼ばれない
      expect(mockSprite.anims.play).not.toHaveBeenCalled();
    });

    it('should log warning when animation does not exist', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const viewModel: PlayerViewModel = {
        x: 150,
        y: 250,
        animation: 'nonexistent_animation',
        hasToy: false,
      };

      // アニメーションが存在しないことを設定
      mockScene.anims.exists.mockReturnValue(false);

      playerCharacter.update(viewModel);

      // 警告ログが出力されることを確認
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[PlayerCharacter] アニメーション "nonexistent_animation" が存在しません'
      );

      consoleWarnSpy.mockRestore();
    });

    it('should not play animation when animation does not exist', () => {
      const viewModel: PlayerViewModel = {
        x: 150,
        y: 250,
        animation: 'nonexistent_animation',
        hasToy: false,
      };

      // アニメーションが存在しないことを設定
      mockScene.anims.exists.mockReturnValue(false);

      playerCharacter.update(viewModel);

      // playは呼ばれない
      expect(mockSprite.anims.play).not.toHaveBeenCalled();
    });
  });

  describe('getSprite', () => {
    it('should return the sprite instance', () => {
      const sprite = playerCharacter.getSprite();
      expect(sprite).toBe(mockSprite);
    });
  });

  describe('destroy', () => {
    it('should destroy the sprite', () => {
      playerCharacter.destroy();
      expect(mockSprite.destroy).toHaveBeenCalled();
    });
  });
});
