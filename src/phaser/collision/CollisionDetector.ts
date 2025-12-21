/**
 * CollisionDetector
 *
 * プレイヤーと猫の衝突判定を行うクラス
 * シンプルな距離計算による衝突検出を提供
 */
export class CollisionDetector {
  private readonly CATCH_DISTANCE = 50; // pixels

  /**
   * 2つの座標間で衝突が発生しているかを判定
   *
   * @param x1 - 最初のオブジェクトのX座標
   * @param y1 - 最初のオブジェクトのY座標
   * @param x2 - 2番目のオブジェクトのX座標
   * @param y2 - 2番目のオブジェクトのY座標
   * @returns 衝突している場合はtrue、それ以外はfalse
   */
  isColliding(x1: number, y1: number, x2: number, y2: number): boolean {
    const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    return distance < this.CATCH_DISTANCE;
  }

  /**
   * 衝突判定に使用される距離を取得
   *
   * @returns 衝突判定距離（ピクセル）
   */
  getCatchDistance(): number {
    return this.CATCH_DISTANCE;
  }
}
