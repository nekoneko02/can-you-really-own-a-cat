/**
 * 猫ステータスマネージャー
 *
 * 猫のステータス（愛着度、ストレス等）を管理します。
 */

import { CatStatus, CatStatusParams } from './CatStatus';

export class CatStatusManager {
  private status: CatStatus;

  constructor() {
    this.status = new CatStatus();
  }

  /**
   * ステータスを更新する
   * @param changes 変更量（差分）
   */
  public updateStatus(changes: Partial<CatStatusParams>): void {
    this.status.update(changes);
  }

  /**
   * 現在のステータスを取得する
   */
  public getStatus(): CatStatus {
    return this.status;
  }
}
