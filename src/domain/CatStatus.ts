/**
 * 猫のステータス
 *
 * 猫の状態を表す数値パラメータ。
 * 全てのパラメータは0-100の範囲でクランプされます。
 */

export interface CatStatusParams {
  affection?: number;  // 愛着度（0-100）
  stress?: number;     // ストレス（0-100）
  health?: number;     // 健康度（0-100）
  hunger?: number;     // 空腹度（0-100）
}

export class CatStatus {
  public affection: number;
  public stress: number;
  public health: number;
  public hunger: number;

  constructor(params: CatStatusParams = {}) {
    this.affection = params.affection ?? 50;
    this.stress = params.stress ?? 0;
    this.health = params.health ?? 100;
    this.hunger = params.hunger ?? 0;
  }

  /**
   * ステータスを更新する（差分を加算）
   * @param changes 変更量（正の値で増加、負の値で減少）
   */
  public update(changes: Partial<CatStatusParams>): void {
    if (changes.affection !== undefined) {
      this.affection = this.clamp(this.affection + changes.affection);
    }
    if (changes.stress !== undefined) {
      this.stress = this.clamp(this.stress + changes.stress);
    }
    if (changes.health !== undefined) {
      this.health = this.clamp(this.health + changes.health);
    }
    if (changes.hunger !== undefined) {
      this.hunger = this.clamp(this.hunger + changes.hunger);
    }
  }

  /**
   * 値を0-100の範囲にクランプする
   */
  private clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
  }

  /**
   * ステータスのディープコピーを作成
   */
  public clone(): CatStatus {
    return new CatStatus({
      affection: this.affection,
      stress: this.stress,
      health: this.health,
      hunger: this.hunger,
    });
  }
}
