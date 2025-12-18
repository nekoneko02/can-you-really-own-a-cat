/**
 * 選択肢
 *
 * イベントにおけるプレイヤーの選択肢を表現します。
 * 選択肢によっては、Phaserでのアクション実行が必要な場合があります。
 */

import { PhaserAction } from './PhaserAction';
import { Consequence } from './Consequence';

export interface ChoiceParams {
  id: string;
  text: string;
  phaserAction?: PhaserAction | null;
  consequenceText: string;
  execute: () => Consequence;
  nextStepId?: string | null;
}

export class Choice {
  public id: string;
  public text: string;
  public phaserAction: PhaserAction | null;
  public consequenceText: string;
  public nextStepId: string | null;
  private executeCallback: () => Consequence;

  constructor(params: ChoiceParams) {
    this.id = params.id;
    this.text = params.text;
    this.phaserAction = params.phaserAction ?? null;
    this.consequenceText = params.consequenceText;
    this.nextStepId = params.nextStepId ?? null;
    this.executeCallback = params.execute;
  }

  /**
   * 選択肢を実行し、結果を返す
   */
  public execute(): Consequence {
    return this.executeCallback();
  }
}
