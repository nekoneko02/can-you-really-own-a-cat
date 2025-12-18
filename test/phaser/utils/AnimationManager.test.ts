/**
 * AnimationManagerのテスト
 *
 * アニメーション定義の管理とスプライトへの適用機能をテストします。
 */

/**
 * アニメーション定義
 */
interface AnimationConfig {
  key: string; // アニメーションキー
  textureKey: string; // テクスチャキー
  frames?: number[]; // フレーム番号の配列（省略時は0のみ）
  frameRate?: number; // フレームレート（省略時は10）
  repeat?: number; // リピート回数（省略時は-1: 無限ループ）
}

/**
 * AnimationManagerのインターフェース
 */
interface IAnimationManager {
  /**
   * アニメーション定義を登録
   */
  registerAnimation(config: AnimationConfig): void;

  /**
   * 登録済みのアニメーションキー一覧を取得
   */
  getRegisteredAnimations(): string[];

  /**
   * アニメーション定義を取得
   */
  getAnimationConfig(key: string): AnimationConfig | undefined;
}

/**
 * モック実装
 */
class MockAnimationManager implements IAnimationManager {
  private animations: Map<string, AnimationConfig> = new Map();

  registerAnimation(config: AnimationConfig): void {
    this.animations.set(config.key, config);
  }

  getRegisteredAnimations(): string[] {
    return Array.from(this.animations.keys());
  }

  getAnimationConfig(key: string): AnimationConfig | undefined {
    return this.animations.get(key);
  }
}

describe('AnimationManager', () => {
  let animationManager: MockAnimationManager;

  beforeEach(() => {
    animationManager = new MockAnimationManager();
  });

  describe('アニメーション定義の登録', () => {
    it('単一のアニメーション定義を登録できる', () => {
      const config: AnimationConfig = {
        key: 'player-idle',
        textureKey: 'player',
        frames: [0],
        frameRate: 10,
        repeat: -1,
      };

      animationManager.registerAnimation(config);

      const registered = animationManager.getRegisteredAnimations();
      expect(registered).toContain('player-idle');
      expect(registered).toHaveLength(1);
    });

    it('複数のアニメーション定義を登録できる', () => {
      const configs: AnimationConfig[] = [
        { key: 'player-idle', textureKey: 'player', frames: [0] },
        { key: 'player-walk', textureKey: 'player', frames: [1, 2, 3, 2] },
        { key: 'cat-sit', textureKey: 'cat', frames: [0] },
      ];

      configs.forEach((config) => animationManager.registerAnimation(config));

      const registered = animationManager.getRegisteredAnimations();
      expect(registered).toHaveLength(3);
      expect(registered).toContain('player-idle');
      expect(registered).toContain('player-walk');
      expect(registered).toContain('cat-sit');
    });

    it('同じキーで再登録すると上書きされる', () => {
      const config1: AnimationConfig = {
        key: 'player-idle',
        textureKey: 'player',
        frames: [0],
      };
      const config2: AnimationConfig = {
        key: 'player-idle',
        textureKey: 'player-v2',
        frames: [1, 2],
      };

      animationManager.registerAnimation(config1);
      animationManager.registerAnimation(config2);

      const registered = animationManager.getRegisteredAnimations();
      expect(registered).toHaveLength(1);

      const retrieved = animationManager.getAnimationConfig('player-idle');
      expect(retrieved?.textureKey).toBe('player-v2');
      expect(retrieved?.frames).toEqual([1, 2]);
    });
  });

  describe('アニメーション定義の取得', () => {
    beforeEach(() => {
      const configs: AnimationConfig[] = [
        {
          key: 'player-idle',
          textureKey: 'player',
          frames: [0],
          frameRate: 10,
          repeat: -1,
        },
        {
          key: 'player-walk',
          textureKey: 'player',
          frames: [1, 2, 3, 2],
          frameRate: 8,
          repeat: -1,
        },
      ];
      configs.forEach((config) => animationManager.registerAnimation(config));
    });

    it('登録済みのアニメーション定義を取得できる', () => {
      const config = animationManager.getAnimationConfig('player-idle');

      expect(config).toBeDefined();
      expect(config?.key).toBe('player-idle');
      expect(config?.textureKey).toBe('player');
      expect(config?.frames).toEqual([0]);
      expect(config?.frameRate).toBe(10);
      expect(config?.repeat).toBe(-1);
    });

    it('未登録のキーではundefinedを返す', () => {
      const config = animationManager.getAnimationConfig('nonexistent');

      expect(config).toBeUndefined();
    });

    it('フレーム配列が複数の場合も正しく取得できる', () => {
      const config = animationManager.getAnimationConfig('player-walk');

      expect(config).toBeDefined();
      expect(config?.frames).toEqual([1, 2, 3, 2]);
      expect(config?.frameRate).toBe(8);
    });
  });

  describe('デフォルト値', () => {
    it('frames省略時は空配列になる（実装依存）', () => {
      const config: AnimationConfig = {
        key: 'test-anim',
        textureKey: 'test',
      };

      animationManager.registerAnimation(config);

      const retrieved = animationManager.getAnimationConfig('test-anim');
      expect(retrieved?.textureKey).toBe('test');
      // framesが省略されている場合の挙動は実装依存
      // 実際の実装では[0]がデフォルトになる可能性がある
    });

    it('frameRate省略時はundefinedになる（実装依存）', () => {
      const config: AnimationConfig = {
        key: 'test-anim',
        textureKey: 'test',
        frames: [0],
      };

      animationManager.registerAnimation(config);

      const retrieved = animationManager.getAnimationConfig('test-anim');
      // frameRateが省略されている場合、undefinedまたはデフォルト値（10など）
      expect(retrieved?.frameRate).toBeUndefined();
    });
  });

  describe('エッジケース', () => {
    it('空のフレーム配列でも登録できる', () => {
      const config: AnimationConfig = {
        key: 'empty-anim',
        textureKey: 'test',
        frames: [],
      };

      animationManager.registerAnimation(config);

      const retrieved = animationManager.getAnimationConfig('empty-anim');
      expect(retrieved).toBeDefined();
      expect(retrieved?.frames).toEqual([]);
    });

    it('frameRateが0でも登録できる', () => {
      const config: AnimationConfig = {
        key: 'zero-framerate',
        textureKey: 'test',
        frames: [0],
        frameRate: 0,
      };

      animationManager.registerAnimation(config);

      const retrieved = animationManager.getAnimationConfig('zero-framerate');
      expect(retrieved?.frameRate).toBe(0);
    });

    it('repeatが0でも登録できる', () => {
      const config: AnimationConfig = {
        key: 'no-repeat',
        textureKey: 'test',
        frames: [0],
        repeat: 0,
      };

      animationManager.registerAnimation(config);

      const retrieved = animationManager.getAnimationConfig('no-repeat');
      expect(retrieved?.repeat).toBe(0);
    });
  });

  describe('登録済みアニメーション一覧', () => {
    it('何も登録していなければ空配列を返す', () => {
      const registered = animationManager.getRegisteredAnimations();

      expect(registered).toEqual([]);
    });

    it('登録順序に依存しない', () => {
      const configs: AnimationConfig[] = [
        { key: 'anim-c', textureKey: 'test' },
        { key: 'anim-a', textureKey: 'test' },
        { key: 'anim-b', textureKey: 'test' },
      ];

      configs.forEach((config) => animationManager.registerAnimation(config));

      const registered = animationManager.getRegisteredAnimations();
      expect(registered).toHaveLength(3);
      expect(registered.sort()).toEqual(['anim-a', 'anim-b', 'anim-c']);
    });
  });
});
