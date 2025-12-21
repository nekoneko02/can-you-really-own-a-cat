/**
 * グローバルレジストリ
 *
 * ゲーム全体で共有するシングルトンオブジェクトを管理します。
 * テスト時にモックを注入できるように設計されています。
 */

export class GlobalRegistry {
  private static instance: GlobalRegistry | null = null;

  private constructor() {
    // 将来の拡張用
  }

  /**
   * シングルトンインスタンスを取得
   */
  static getInstance(): GlobalRegistry {
    if (!GlobalRegistry.instance) {
      GlobalRegistry.instance = new GlobalRegistry();
    }
    return GlobalRegistry.instance;
  }

  /**
   * シングルトンインスタンスをリセット（テスト用）
   */
  static resetForTesting(): void {
    GlobalRegistry.instance = null;
  }
}
