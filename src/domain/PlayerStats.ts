/**
 * プレイヤーの統計情報
 *
 * 1週間のゲームプレイ中のプレイヤーの行動統計。
 */

export interface PlayerStatsParams {
  totalSleepHours?: number;     // 総睡眠時間（時間）
  interruptionCount?: number;   // 起こされた回数
  playCount?: number;           // 猫と遊んだ回数
}

export class PlayerStats {
  public totalSleepHours: number;
  public interruptionCount: number;
  public playCount: number;

  constructor(params: PlayerStatsParams = {}) {
    this.totalSleepHours = params.totalSleepHours ?? 0;
    this.interruptionCount = params.interruptionCount ?? 0;
    this.playCount = params.playCount ?? 0;
  }

  /**
   * 睡眠時間を追加
   * @param hours 睡眠時間（時間単位、小数可）
   */
  public addSleepHours(hours: number): void {
    this.totalSleepHours += hours;
  }

  /**
   * 起こされた回数をインクリメント
   */
  public incrementInterruptions(): void {
    this.interruptionCount += 1;
  }

  /**
   * 猫と遊んだ回数をインクリメント
   */
  public incrementPlayCount(): void {
    this.playCount += 1;
  }

  /**
   * 統計情報のディープコピーを作成
   */
  public clone(): PlayerStats {
    return new PlayerStats({
      totalSleepHours: this.totalSleepHours,
      interruptionCount: this.interruptionCount,
      playCount: this.playCount,
    });
  }
}
