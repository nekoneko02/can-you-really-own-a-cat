/**
 * AnimationManager
 *
 * アニメーション定義を一元管理するユーティリティクラス。
 * スプライトアニメーションの定義と適用を簡素化します。
 */

/**
 * アニメーション定義
 */
export interface AnimationConfig {
  key: string; // アニメーションキー
  textureKey: string; // テクスチャキー
  frames?: number[]; // フレーム番号の配列（省略時は[0]）
  frameRate?: number; // フレームレート（省略時は10）
  repeat?: number; // リピート回数（省略時は-1: 無限ループ）
}

/**
 * AnimationManager
 *
 * アニメーション定義を管理し、スプライトへの適用を簡素化します。
 */
export class AnimationManager {
  private static animations: Map<string, AnimationConfig> = new Map();

  /**
   * アニメーション定義を登録
   *
   * @param config - アニメーション設定
   */
  static registerAnimation(config: AnimationConfig): void {
    this.animations.set(config.key, config);
  }

  /**
   * 複数のアニメーション定義を一括登録
   *
   * @param configs - アニメーション設定の配列
   */
  static registerAnimations(configs: AnimationConfig[]): void {
    configs.forEach((config) => this.registerAnimation(config));
  }

  /**
   * 登録済みのアニメーションキー一覧を取得
   *
   * @returns アニメーションキーの配列
   */
  static getRegisteredAnimations(): string[] {
    return Array.from(this.animations.keys());
  }

  /**
   * アニメーション定義を取得
   *
   * @param key - アニメーションキー
   * @returns アニメーション設定（未登録の場合はundefined）
   */
  static getAnimationConfig(key: string): AnimationConfig | undefined {
    return this.animations.get(key);
  }

  /**
   * 全てのアニメーション定義をクリア
   *
   * テスト用途など、定義をリセットする際に使用。
   */
  static clearAll(): void {
    this.animations.clear();
  }
}
