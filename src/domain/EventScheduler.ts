/**
 * イベントスケジューラー
 *
 * 1週間のイベント発生スケジュールを管理します。
 */
export class EventScheduler {
  private schedule: Map<number, string>; // day → eventId

  constructor() {
    this.schedule = this.generateSchedule();
  }

  /**
   * スケジュールを生成
   * - 初日（1日目）: 確定発生
   * - 2-7日目: ランダムに2回発生
   */
  private generateSchedule(): Map<number, string> {
    const schedule = new Map<number, string>();

    // 初日は確定
    schedule.set(1, 'night_crying_day1');

    // 2-7日目でランダムに2回
    const availableDays = [2, 3, 4, 5, 6, 7];
    const selectedDays = this.selectRandomDays(availableDays, 2);

    selectedDays.forEach((day, index) => {
      schedule.set(day, `night_crying_occurrence_${index + 2}`);
    });

    console.log('[EventScheduler] スケジュールを生成しました:', Array.from(schedule.entries()));

    return schedule;
  }

  /**
   * ランダムに指定数の日を選択
   */
  private selectRandomDays(days: number[], count: number): number[] {
    const shuffled = [...days].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).sort((a, b) => a - b);
  }

  /**
   * 指定日にイベントがあるか判定
   */
  public hasEventOnDay(day: number): boolean {
    return this.schedule.has(day);
  }

  /**
   * 指定日のイベントIDを取得
   */
  public getEventIdForDay(day: number): string | null {
    return this.schedule.get(day) ?? null;
  }

  /**
   * 全スケジュールを取得（デバッグ用）
   */
  public getSchedule(): Map<number, string> {
    return new Map(this.schedule);
  }
}