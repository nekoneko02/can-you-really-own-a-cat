/**
 * AnimationPlayerのテスト
 *
 * スプライトのアニメーション再生をテストします。
 */

import { AnimationPlayer } from '@/phaser/utils/AnimationPlayer';

// Phaserモック型定義
interface MockAnim {
  currentAnim?: {
    key: string;
  } | null;
  exists: jest.Mock;
}

interface MockSprite {
  anims: MockAnim;
  play: jest.Mock;
}

interface MockScene {
  anims: {
    exists: jest.Mock;
  };
}

// モック作成ヘルパー
function createMockSpriteAndScene(
  currentAnimKey?: string,
  animExists: boolean = true
): { sprite: MockSprite; scene: MockScene } {
  const mockSprite: MockSprite = {
    anims: {
      currentAnim: currentAnimKey ? { key: currentAnimKey } : null,
      exists: jest.fn(() => animExists),
    },
    play: jest.fn(),
  };

  const mockScene: MockScene = {
    anims: {
      exists: jest.fn(() => animExists),
    },
  };

  return { sprite: mockSprite, scene: mockScene };
}

describe('AnimationPlayer', () => {
  describe('play', () => {
    it('should play animation when it exists and is different from current', () => {
      const { sprite, scene } = createMockSpriteAndScene('old_animation', true);

      AnimationPlayer.play(sprite as any, scene as any, 'new_animation', '[Test]');

      // アニメーションが再生される
      expect(sprite.play).toHaveBeenCalledWith('new_animation');
    });

    it('should not play animation when it is the same as current', () => {
      const { sprite, scene } = createMockSpriteAndScene('same_animation', true);

      AnimationPlayer.play(sprite as any, scene as any, 'same_animation', '[Test]');

      // 同じアニメーションの場合、再生しない
      expect(sprite.play).not.toHaveBeenCalled();
    });

    it('should play animation when current animation is null', () => {
      const { sprite, scene } = createMockSpriteAndScene(undefined, true);

      AnimationPlayer.play(sprite as any, scene as any, 'new_animation', '[Test]');

      // 現在のアニメーションがnullの場合、再生される
      expect(sprite.play).toHaveBeenCalledWith('new_animation');
    });

    it('should log warning when animation does not exist', () => {
      const { sprite, scene } = createMockSpriteAndScene(undefined, false);
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      AnimationPlayer.play(
        sprite as any,
        scene as any,
        'nonexistent_animation',
        '[Test]'
      );

      // 警告ログが出力される
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[Test] アニメーション "nonexistent_animation" が存在しません'
      );

      // アニメーションは再生されない
      expect(sprite.play).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should not play animation when it does not exist', () => {
      const { sprite, scene } = createMockSpriteAndScene(undefined, false);

      AnimationPlayer.play(
        sprite as any,
        scene as any,
        'nonexistent_animation',
        '[Test]'
      );

      // アニメーションは再生されない
      expect(sprite.play).not.toHaveBeenCalled();
    });

    it('should use scene.anims.exists to check animation existence', () => {
      const { sprite, scene } = createMockSpriteAndScene(undefined, true);

      AnimationPlayer.play(sprite as any, scene as any, 'test_animation', '[Test]');

      // scene.anims.existsが呼ばれることを確認
      expect(scene.anims.exists).toHaveBeenCalledWith('test_animation');
    });

    it('should handle different log prefixes correctly', () => {
      const { sprite, scene } = createMockSpriteAndScene(undefined, false);
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      AnimationPlayer.play(
        sprite as any,
        scene as any,
        'nonexistent_animation',
        '[PlayerCharacter]'
      );

      // カスタムログプレフィックスが使用される
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[PlayerCharacter] アニメーション "nonexistent_animation" が存在しません'
      );

      consoleWarnSpy.mockRestore();
    });
  });
});
