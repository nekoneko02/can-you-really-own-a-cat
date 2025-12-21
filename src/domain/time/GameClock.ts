/**
 * GameClock - グローバル時刻管理
 *
 * update() 単位で進む基準時刻を管理します。
 * 現実時間に依存せず、ゲームループのupdate呼び出しに基づいて時刻を進めます。
 * 一時停止にも対応しています。
 */
export class GameClock {
  private elapsedMs: number = 0;
  private ticks: number = 0;
  private paused: boolean = false;

  /**
   * 時刻を進める
   * @param deltaMs 経過ミリ秒
   */
  update(deltaMs: number): void {
    if (this.paused) {
      return;
    }
    this.elapsedMs += deltaMs;
    this.ticks++;
  }

  /**
   * 経過時間を取得（ミリ秒）
   */
  getElapsedMs(): number {
    return this.elapsedMs;
  }

  /**
   * tick数を取得
   */
  getTicks(): number {
    return this.ticks;
  }

  /**
   * 一時停止状態かどうか
   */
  isPaused(): boolean {
    return this.paused;
  }

  /**
   * 一時停止
   */
  pause(): void {
    this.paused = true;
  }

  /**
   * 再開
   */
  resume(): void {
    this.paused = false;
  }

  /**
   * リセット
   */
  reset(): void {
    this.elapsedMs = 0;
    this.ticks = 0;
    this.paused = false;
  }
}
