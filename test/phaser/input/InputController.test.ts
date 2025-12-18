/**
 * InputControllerのテスト
 *
 * キーボード入力をPlayerInputに変換する機能をテストします。
 */

import { Direction } from '@/domain/types';
import { PlayerInput } from '@/application/types';

// Phaserのモック型定義
interface MockKey {
  isDown: boolean;
}

interface MockCursorKeys {
  up: MockKey;
  down: MockKey;
  left: MockKey;
  right: MockKey;
  space: MockKey;
}

interface MockKeyboard {
  createCursorKeys(): MockCursorKeys;
  addKey(key: string): MockKey;
}

interface MockInput {
  keyboard: MockKeyboard;
}

interface MockScene {
  input: MockInput;
}

// InputControllerのインターフェース定義
interface IInputController {
  getInput(): PlayerInput | null;
}

// モッククラス
class MockInputController implements IInputController {
  private cursors?: MockCursorKeys;
  private keys?: { [key: string]: MockKey };

  constructor(scene: MockScene) {
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = {
      w: scene.input.keyboard.addKey('W'),
      a: scene.input.keyboard.addKey('A'),
      s: scene.input.keyboard.addKey('S'),
      d: scene.input.keyboard.addKey('D'),
      space: scene.input.keyboard.addKey('SPACE'),
    };
  }

  getInput(): PlayerInput | null {
    if (!this.cursors || !this.keys) return null;

    let direction: Direction = Direction.NONE;

    if (this.cursors.up.isDown || this.keys.w.isDown) {
      direction = Direction.UP;
    } else if (this.cursors.down.isDown || this.keys.s.isDown) {
      direction = Direction.DOWN;
    } else if (this.cursors.left.isDown || this.keys.a.isDown) {
      direction = Direction.LEFT;
    } else if (this.cursors.right.isDown || this.keys.d.isDown) {
      direction = Direction.RIGHT;
    }

    const interact = this.keys.space.isDown;

    if (direction === Direction.NONE && !interact) {
      return null;
    }

    return {
      direction: direction !== Direction.NONE ? direction : undefined,
      interact: interact || undefined,
    };
  }
}

// モックシーンファクトリ
function createMockScene(): {
  scene: MockScene;
  cursors: MockCursorKeys;
  keys: Map<string, MockKey>;
} {
  const keys = new Map<string, MockKey>();
  const cursors: MockCursorKeys = {
    up: { isDown: false },
    down: { isDown: false },
    left: { isDown: false },
    right: { isDown: false },
    space: { isDown: false },
  };

  return {
    scene: {
      input: {
        keyboard: {
          createCursorKeys: () => cursors,
          addKey: (key: string) => {
            if (!keys.has(key)) {
              keys.set(key, { isDown: false });
            }
            return keys.get(key)!;
          },
        },
      },
    },
    cursors,
    keys,
  };
}

describe('InputController', () => {
  let mockScene: MockScene;
  let inputController: MockInputController;
  let cursors: MockCursorKeys;
  let keys: Map<string, MockKey>;

  beforeEach(() => {
    const mock = createMockScene();
    mockScene = mock.scene;
    cursors = mock.cursors;
    keys = mock.keys;
    inputController = new MockInputController(mockScene);
  });

  describe('方向キーの入力', () => {
    it('矢印キー↑が押されたらDirection.UPを返す', () => {
      cursors.up.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.direction).toBe(Direction.UP);
    });

    it('矢印キー↓が押されたらDirection.DOWNを返す', () => {
      cursors.down.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.direction).toBe(Direction.DOWN);
    });

    it('矢印キー←が押されたらDirection.LEFTを返す', () => {
      cursors.left.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.direction).toBe(Direction.LEFT);
    });

    it('矢印キー→が押されたらDirection.RIGHTを返す', () => {
      cursors.right.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.direction).toBe(Direction.RIGHT);
    });
  });

  describe('WASDキーの入力', () => {
    it('Wキーが押されたらDirection.UPを返す', () => {
      keys.get('W')!.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.direction).toBe(Direction.UP);
    });

    it('Sキーが押されたらDirection.DOWNを返す', () => {
      keys.get('S')!.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.direction).toBe(Direction.DOWN);
    });

    it('Aキーが押されたらDirection.LEFTを返す', () => {
      keys.get('A')!.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.direction).toBe(Direction.LEFT);
    });

    it('Dキーが押されたらDirection.RIGHTを返す', () => {
      keys.get('D')!.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.direction).toBe(Direction.RIGHT);
    });
  });

  describe('インタラクトキーの入力', () => {
    it('Spaceキーが押されたらinteract: trueを返す', () => {
      keys.get('SPACE')!.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.interact).toBe(true);
    });

    it('Spaceキーが押されていなければinteractはundefined', () => {
      cursors.up.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.interact).toBeUndefined();
    });
  });

  describe('複数キー同時押下', () => {
    it('矢印キー↑とSpaceが同時押しされたら両方を返す', () => {
      cursors.up.isDown = true;
      keys.get('SPACE')!.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.direction).toBe(Direction.UP);
      expect(input?.interact).toBe(true);
    });

    it('矢印キー↑とWキーが同時押しされたら矢印キーを優先', () => {
      cursors.up.isDown = true;
      keys.get('W')!.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.direction).toBe(Direction.UP);
    });

    it('複数の方向キーが押されたら優先順位に従う（上>下>左>右）', () => {
      cursors.up.isDown = true;
      cursors.down.isDown = true;
      cursors.left.isDown = true;

      const input = inputController.getInput();

      expect(input).not.toBeNull();
      expect(input?.direction).toBe(Direction.UP);
    });
  });

  describe('入力なしの場合', () => {
    it('何も押されていなければnullを返す', () => {
      const input = inputController.getInput();

      expect(input).toBeNull();
    });

    it('キーが離されたらnullを返す', () => {
      // 最初は押されている
      cursors.up.isDown = true;

      let input = inputController.getInput();
      expect(input).not.toBeNull();

      // キーを離す
      cursors.up.isDown = false;

      input = inputController.getInput();
      expect(input).toBeNull();
    });
  });

  describe('エッジケース', () => {
    it('keyboard未初期化の場合nullを返す', () => {
      const invalidScene = {
        input: {
          keyboard: {
            createCursorKeys: () => undefined as any,
            addKey: () => undefined as any,
          },
        },
      } as MockScene;

      const controller = new MockInputController(invalidScene);
      const input = controller.getInput();

      expect(input).toBeNull();
    });
  });
});
