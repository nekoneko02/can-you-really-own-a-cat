/**
 * 選択の結果
 *
 * 選択肢を実行した結果として生じる変化を表現します。
 */

import { CatStatusParams } from './CatStatus';
import { PlayerStatsParams } from './PlayerStats';

export interface ConsequenceParams {
  text: string;
  catStateChanges?: Partial<CatStatusParams>;
  playerStatsChanges?: Partial<PlayerStatsParams>;
  eventCompleted: boolean;
}

export class Consequence {
  public text: string;
  public catStateChanges: Partial<CatStatusParams>;
  public playerStatsChanges: Partial<PlayerStatsParams>;
  public eventCompleted: boolean;

  constructor(params: ConsequenceParams) {
    this.text = params.text;
    this.catStateChanges = params.catStateChanges ?? {};
    this.playerStatsChanges = params.playerStatsChanges ?? {};
    this.eventCompleted = params.eventCompleted;
  }
}
