/**
 * ScaledTime - スケール適用時間
 *
 * アクション毎に異なるスケールを適用して、経過時間を計算します。
 * 例: 遊ぶアクションは30倍速（現実1秒 = ゲーム内30秒）
 */
export class ScaledTime {
  private startTime: number;
  private timeScale: number;

  /**
   * コンストラクタ
   * @param startTime 開始時刻（GameClockの経過時間）
   * @param timeScale スケール倍率（デフォルト: 1.0）
   */
  constructor(startTime: number, timeScale: number = 1.0) {
    this.startTime = startTime;
    this.timeScale = Math.max(0, timeScale);
  }

  /**
   * スケール適用した経過時間を取得
   * @param currentTime 現在時刻（GameClockの経過時間）
   * @returns スケール適用後の経過時間（ミリ秒）
   */
  getScaledElapsed(currentTime: number): number {
    const elapsed = currentTime - this.startTime;
    if (elapsed < 0) {
      return 0;
    }
    return elapsed * this.timeScale;
  }

  /**
   * 開始時刻を取得
   */
  getStartTime(): number {
    return this.startTime;
  }

  /**
   * スケールを取得
   */
  getTimeScale(): number {
    return this.timeScale;
  }

  /**
   * スケールを設定
   * @param scale スケール倍率（負の値は0に補正）
   */
  setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale);
  }

  /**
   * 開始時刻をリセット
   * @param startTime 新しい開始時刻
   */
  resetStartTime(startTime: number): void {
    this.startTime = startTime;
  }
}
