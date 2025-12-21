/**
 * 満足度計算クラス
 *
 * 夜泣きイベントでの猫の満足度を計算します。
 * 満足度は経過時間と完了時間から線形で算出されます。
 */

export class SatisfactionCalculator {
  /**
   * 満足度を計算
   *
   * @param elapsedTime 経過時間（ミリ秒）
   * @param maxTime 完了時間（ミリ秒）
   * @returns 満足度（0.0 - 1.0）
   */
  calculate(elapsedTime: number, maxTime: number): number {
    if (maxTime <= 0) {
      throw new Error('maxTime must be greater than 0');
    }

    // 経過時間が負の場合は0を返す
    if (elapsedTime < 0) {
      return 0;
    }

    // 線形計算: satisfaction = min(1.0, elapsedTime / maxTime)
    return Math.min(1.0, elapsedTime / maxTime);
  }
}
