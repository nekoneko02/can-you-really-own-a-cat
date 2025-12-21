/**
 * GlobalRegistry のテスト
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { GlobalRegistry } from '@/lib/GlobalRegistry';

describe('GlobalRegistry', () => {
  beforeEach(() => {
    // 各テストの前にシングルトンをリセット
    GlobalRegistry.resetForTesting();
  });

  describe('シングルトンパターン', () => {
    it('同じインスタンスを返す', () => {
      const instance1 = GlobalRegistry.getInstance();
      const instance2 = GlobalRegistry.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('resetForTesting', () => {
    it('シングルトンインスタンスをリセットできる', () => {
      const instance1 = GlobalRegistry.getInstance();

      GlobalRegistry.resetForTesting();

      const instance2 = GlobalRegistry.getInstance();
      expect(instance1).not.toBe(instance2);
    });
  });
});
