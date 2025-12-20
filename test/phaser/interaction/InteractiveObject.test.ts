/**
 * InteractiveObject のテスト
 *
 * オブジェクトの画像表示機能（Sprite/Graphicsフォールバック）をテストします。
 */

import { InteractiveObject } from '@/phaser/interaction/InteractiveObject';

// Phaserモック型定義
interface MockSprite {
  x: number;
  y: number;
  setDisplaySize: jest.Mock;
  setTint: jest.Mock;
  clearTint: jest.Mock;
  destroy: jest.Mock;
}

interface MockGraphics {
  clear: jest.Mock;
  fillStyle: jest.Mock;
  fillRect: jest.Mock;
  destroy: jest.Mock;
}

interface MockTextures {
  exists: jest.Mock;
}

interface MockScene {
  add: {
    sprite: jest.Mock;
    graphics: jest.Mock;
  };
  textures: MockTextures;
}

// モック作成ヘルパー
function createMockScene(textureExists: boolean = false): {
  scene: MockScene;
  sprite: MockSprite;
  graphics: MockGraphics;
} {
  const mockSprite: MockSprite = {
    x: 0,
    y: 0,
    setDisplaySize: jest.fn(),
    setTint: jest.fn(),
    clearTint: jest.fn(),
    destroy: jest.fn(),
  };

  const mockGraphics: MockGraphics = {
    clear: jest.fn().mockReturnThis(),
    fillStyle: jest.fn().mockReturnThis(),
    fillRect: jest.fn().mockReturnThis(),
    destroy: jest.fn(),
  };

  const mockScene: MockScene = {
    add: {
      sprite: jest.fn((x: number, y: number) => {
        mockSprite.x = x;
        mockSprite.y = y;
        return mockSprite;
      }),
      graphics: jest.fn(() => mockGraphics),
    },
    textures: {
      exists: jest.fn(() => textureExists),
    },
  };

  return { scene: mockScene, sprite: mockSprite, graphics: mockGraphics };
}

describe('InteractiveObject', () => {
  describe('画像表示機能（Sprite/Graphicsフォールバック）', () => {
    it('テクスチャが存在する場合、Spriteで表示される', () => {
      const { scene, sprite } = createMockScene(true);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      // テクスチャの存在確認が呼ばれる
      expect(scene.textures.exists).toHaveBeenCalledWith('bed');

      // Spriteが作成される
      expect(scene.add.sprite).toHaveBeenCalledWith(100, 200, 'bed');
      expect(sprite.setDisplaySize).toHaveBeenCalledWith(64, 48);

      // Graphicsは作成されない
      expect(scene.add.graphics).not.toHaveBeenCalled();
    });

    it('テクスチャが存在しない場合、Graphicsで表示される（フォールバック）', () => {
      const { scene, graphics } = createMockScene(false);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      // テクスチャの存在確認が呼ばれる
      expect(scene.textures.exists).toHaveBeenCalledWith('bed');

      // Graphicsが作成される
      expect(scene.add.graphics).toHaveBeenCalled();
      expect(graphics.fillStyle).toHaveBeenCalledWith(0x8b4513, 1);
      expect(graphics.fillRect).toHaveBeenCalledWith(68, 176, 64, 48);

      // Spriteは作成されない
      expect(scene.add.sprite).not.toHaveBeenCalled();
    });

    it('textureKeyが指定されていない場合、Graphicsで表示される', () => {
      const { scene, graphics } = createMockScene(false);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
      });

      // Graphicsが作成される
      expect(scene.add.graphics).toHaveBeenCalled();
      expect(graphics.fillStyle).toHaveBeenCalledWith(0x8b4513, 1);

      // Spriteは作成されない
      expect(scene.add.sprite).not.toHaveBeenCalled();
    });
  });

  describe('getPosition()', () => {
    it('Sprite使用時、正しい座標を返す', () => {
      const { scene } = createMockScene(true);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      const position = obj.getPosition();
      expect(position).toEqual({ x: 100, y: 200 });
    });

    it('Graphics使用時、正しい座標を返す', () => {
      const { scene } = createMockScene(false);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      const position = obj.getPosition();
      expect(position).toEqual({ x: 100, y: 200 });
    });
  });

  describe('highlight()', () => {
    it('Sprite使用時、setTint()でハイライトされる', () => {
      const { scene, sprite } = createMockScene(true);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      obj.highlight();

      // setTint()が呼ばれる（ハイライトカラー: 0xffffff）
      expect(sprite.setTint).toHaveBeenCalledWith(0xffffff);
    });

    it('Graphics使用時、色を明るくして再描画される', () => {
      const { scene, graphics } = createMockScene(false);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      // 初期描画後のclearをリセット
      graphics.clear.mockClear();
      graphics.fillStyle.mockClear();
      graphics.fillRect.mockClear();

      obj.highlight();

      // 再描画される（ハイライトカラー: 0x8b4513 + 0x333333）
      expect(graphics.clear).toHaveBeenCalled();
      expect(graphics.fillStyle).toHaveBeenCalledWith(0xbe7846, 1);
      expect(graphics.fillRect).toHaveBeenCalledWith(68, 176, 64, 48);
    });

    it('既にハイライト中の場合、何もしない', () => {
      const { scene, sprite } = createMockScene(true);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      obj.highlight();
      sprite.setTint.mockClear();

      // 2回目のhighlight()
      obj.highlight();

      // setTint()は呼ばれない
      expect(sprite.setTint).not.toHaveBeenCalled();
    });
  });

  describe('unhighlight()', () => {
    it('Sprite使用時、clearTint()でハイライト解除される', () => {
      const { scene, sprite } = createMockScene(true);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      obj.highlight();
      obj.unhighlight();

      // clearTint()が呼ばれる
      expect(sprite.clearTint).toHaveBeenCalled();
    });

    it('Graphics使用時、元の色で再描画される', () => {
      const { scene, graphics } = createMockScene(false);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      obj.highlight();

      // unhighlight前のclearをリセット
      graphics.clear.mockClear();
      graphics.fillStyle.mockClear();
      graphics.fillRect.mockClear();

      obj.unhighlight();

      // 元の色で再描画される
      expect(graphics.clear).toHaveBeenCalled();
      expect(graphics.fillStyle).toHaveBeenCalledWith(0x8b4513, 1);
      expect(graphics.fillRect).toHaveBeenCalledWith(68, 176, 64, 48);
    });

    it('ハイライト中でない場合、何もしない', () => {
      const { scene, sprite } = createMockScene(true);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      // highlight()を呼ばずにunhighlight()
      obj.unhighlight();

      // clearTint()は呼ばれない
      expect(sprite.clearTint).not.toHaveBeenCalled();
    });
  });

  describe('destroy()', () => {
    it('Sprite使用時、Spriteが破棄される', () => {
      const { scene, sprite, graphics } = createMockScene(true);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      obj.destroy();

      // Spriteのdestroy()が呼ばれる
      expect(sprite.destroy).toHaveBeenCalled();

      // Graphicsのdestroy()は呼ばれない
      expect(graphics.destroy).not.toHaveBeenCalled();
    });

    it('Graphics使用時、Graphicsが破棄される', () => {
      const { scene, sprite, graphics } = createMockScene(false);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      obj.destroy();

      // Graphicsのdestroy()が呼ばれる
      expect(graphics.destroy).toHaveBeenCalled();

      // Spriteのdestroy()は呼ばれない
      expect(sprite.destroy).not.toHaveBeenCalled();
    });
  });

  describe('既存機能の互換性', () => {
    it('getDistanceFrom()が正常に動作する', () => {
      const { scene } = createMockScene(true);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        textureKey: 'bed',
      });

      const distance = obj.getDistanceFrom(130, 240);
      // sqrt((130-100)^2 + (240-200)^2) = sqrt(900 + 1600) = 50
      expect(distance).toBe(50);
    });

    it('isInRange()が正常に動作する', () => {
      const { scene } = createMockScene(true);

      const obj = new InteractiveObject(scene as any, {
        id: 'test-obj',
        x: 100,
        y: 200,
        width: 64,
        height: 48,
        color: 0x8b4513,
        radius: 60,
        textureKey: 'bed',
      });

      // 範囲内（距離50）
      expect(obj.isInRange(130, 240)).toBe(true);

      // 範囲外（距離100）
      expect(obj.isInRange(100, 300)).toBe(false);
    });
  });
});
