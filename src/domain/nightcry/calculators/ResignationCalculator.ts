/**
 * 諦め度計算クラス
 *
 * 夜泣きイベントでの猫の諦め度を計算します。
 * 諦め度は経過時間と完了時間から線形で算出されます。
 */

export class ResignationCalculator {
  /**
   * 諦め度を計算
   *
   * @param elapsedTime 経過時間（ミリ秒）
   * @param maxTime 完了時間（ミリ秒）
   * @returns 諦め度（0.0 - 1.0）
   */
  calculate(elapsedTime: number, maxTime: number): number {
    if (maxTime <= 0) {
      throw new Error('maxTime must be greater than 0');
    }

    // 経過時間が負の場合は0を返す
    if (elapsedTime < 0) {
      return 0;
    }

    // 線形計算: resignation = min(1.0, elapsedTime / maxTime)
    return Math.min(1.0, elapsedTime / maxTime);
  }
}
