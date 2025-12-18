/**
 * InteractionManager のテスト
 *
 * インタラクション範囲判定とPhaserAction実行ロジックをテストします。
 * 描画部分（ハイライト表示）はテスト対象外です。
 */

import { InteractionManager } from '@/phaser/interaction/InteractionManager';
import { InteractiveObject } from '@/phaser/interaction/InteractiveObject';

describe('InteractionManager', () => {
  let mockScene: Phaser.Scene;
  let manager: InteractionManager;

  beforeEach(() => {
    // Sceneのモック
    mockScene = {
      add: {
        graphics: jest.fn(() => ({
          clear: jest.fn().mockReturnThis(),
          fillStyle: jest.fn().mockReturnThis(),
          fillRect: jest.fn().mockReturnThis(),
          destroy: jest.fn(),
        })),
      },
    } as unknown as Phaser.Scene;

    manager = new InteractionManager(mockScene);
  });

  describe('インタラクション範囲判定ロジック', () => {
    it('プレイヤーとオブジェクトの距離が50px以内の場合、インタラクト可能', () => {
      const obj = new InteractiveObject(mockScene, {
        id: 'test-object',
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        color: 0xff0000,
        radius: 50,
      });

      manager.addObject(obj);

      // プレイヤーが範囲内（距離30px）
      manager.update(120, 120);

      expect(manager.getNearestObject()).toBe(obj);
    });

    it('プレイヤーとオブジェクトの距離が50pxより遠い場合、インタラクト不可', () => {
      const obj = new InteractiveObject(mockScene, {
        id: 'test-object',
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        color: 0xff0000,
        radius: 50,
      });

      manager.addObject(obj);

      // プレイヤーが範囲外（距離100px）
      manager.update(200, 100);

      expect(manager.getNearestObject()).toBeNull();
    });

    it('複数のオブジェクトがある場合、最も近いオブジェクトをインタラクト対象とする', () => {
      const obj1 = new InteractiveObject(mockScene, {
        id: 'object-1',
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        color: 0xff0000,
        radius: 50,
      });

      const obj2 = new InteractiveObject(mockScene, {
        id: 'object-2',
        x: 150,
        y: 150,
        width: 32,
        height: 32,
        color: 0x00ff00,
        radius: 80,
      });

      manager.addObject(obj1);
      manager.addObject(obj2);

      // プレイヤーが(130, 130)にいる場合、obj2が最も近い
      // obj1との距離: sqrt((130-100)^2 + (130-100)^2) = sqrt(1800) ≈ 42.4
      // obj2との距離: sqrt((150-130)^2 + (150-130)^2) = sqrt(800) ≈ 28.3
      manager.update(130, 130);

      const nearest = manager.getNearestObject();
      expect(nearest).toBe(obj2);
    });

    it('インタラクト可能なオブジェクトがない場合、nullを返す', () => {
      const obj = new InteractiveObject(mockScene, {
        id: 'test-object',
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        color: 0xff0000,
        radius: 50,
      });

      manager.addObject(obj);

      // プレイヤーがすべてのオブジェクトから離れている
      manager.update(500, 500);

      expect(manager.getNearestObject()).toBeNull();
    });
  });

  describe('PhaserAction実行ロジック', () => {
    it('interact()が呼ばれた時、最も近いオブジェクトとのインタラクションを実行', () => {
      const obj = new InteractiveObject(mockScene, {
        id: 'test-object',
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        color: 0xff0000,
        radius: 50,
      });

      manager.addObject(obj);
      manager.update(110, 110);

      // consoleのスパイ
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      manager.interact();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[InteractionManager] インタラクト: test-object'
      );

      consoleSpy.mockRestore();
    });

    it('インタラクト可能なオブジェクトがない場合、interact()は何もしない', () => {
      const obj = new InteractiveObject(mockScene, {
        id: 'test-object',
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        color: 0xff0000,
        radius: 50,
      });

      manager.addObject(obj);
      manager.update(500, 500); // 範囲外

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      manager.interact();

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('インタラクト可能オブジェクトのハイライト', () => {
    it('インタラクト可能なオブジェクトに近づくと、ハイライト表示される', () => {
      const obj = new InteractiveObject(mockScene, {
        id: 'test-object',
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        color: 0xff0000,
        radius: 50,
      });

      const highlightSpy = jest.spyOn(obj, 'highlight');

      manager.addObject(obj);

      // プレイヤーが範囲内
      manager.update(110, 110);

      expect(highlightSpy).toHaveBeenCalled();

      highlightSpy.mockRestore();
    });

    it('インタラクト可能なオブジェクトから離れると、ハイライトが解除される', () => {
      const obj = new InteractiveObject(mockScene, {
        id: 'test-object',
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        color: 0xff0000,
        radius: 50,
      });

      const unhighlightSpy = jest.spyOn(obj, 'unhighlight');

      manager.addObject(obj);

      // 最初は範囲内
      manager.update(110, 110);

      // 範囲外に移動
      manager.update(500, 500);

      expect(unhighlightSpy).toHaveBeenCalled();

      unhighlightSpy.mockRestore();
    });

    it('複数のオブジェクトがある場合、最も近いオブジェクトのみハイライト', () => {
      const obj1 = new InteractiveObject(mockScene, {
        id: 'object-1',
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        color: 0xff0000,
        radius: 50,
      });

      const obj2 = new InteractiveObject(mockScene, {
        id: 'object-2',
        x: 150,
        y: 150,
        width: 32,
        height: 32,
        color: 0x00ff00,
        radius: 80,
      });

      const highlightSpy1 = jest.spyOn(obj1, 'highlight');
      const highlightSpy2 = jest.spyOn(obj2, 'highlight');

      manager.addObject(obj1);
      manager.addObject(obj2);

      // プレイヤーが(130, 130)にいる場合、obj2のみハイライト
      manager.update(130, 130);

      expect(highlightSpy2).toHaveBeenCalled();
      expect(highlightSpy1).not.toHaveBeenCalled();

      highlightSpy1.mockRestore();
      highlightSpy2.mockRestore();
    });
  });

  describe('エッジケース', () => {
    it('オブジェクトが0個の場合でも動作する', () => {
      manager.update(100, 100);

      expect(manager.getNearestObject()).toBeNull();
    });

    it('プレイヤー位置が不正な値の場合でもエラーにならない', () => {
      const obj = new InteractiveObject(mockScene, {
        id: 'test-object',
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        color: 0xff0000,
        radius: 50,
      });

      manager.addObject(obj);

      // 不正な値でもエラーにならない
      expect(() => manager.update(NaN, NaN)).not.toThrow();
      expect(() => manager.update(Infinity, Infinity)).not.toThrow();
    });

    it('同じ位置に複数のオブジェクトがある場合、最初のオブジェクトを選択', () => {
      const obj1 = new InteractiveObject(mockScene, {
        id: 'object-1',
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        color: 0xff0000,
        radius: 50,
      });

      const obj2 = new InteractiveObject(mockScene, {
        id: 'object-2',
        x: 100,
        y: 100,
        width: 32,
        height: 32,
        color: 0x00ff00,
        radius: 50,
      });

      manager.addObject(obj1);
      manager.addObject(obj2);

      manager.update(100, 100);

      // 同じ距離の場合、最初に追加されたオブジェクトが選択される
      const nearest = manager.getNearestObject();
      expect(nearest?.id).toBe('object-1');
    });
  });
});
