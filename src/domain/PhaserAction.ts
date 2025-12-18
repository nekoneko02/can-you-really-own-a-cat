/**
 * Phaserアクション
 *
 * Domainからvectorへの指示を表現します。
 * 選択肢によっては、プレイヤーが実際にPhaserでアクションを実行する必要があります。
 */

import { ActionType, InteractionAction } from './types';

export interface PhaserActionParams {
  type: ActionType;
  targetObject: string;
  requiredAction: InteractionAction;
}

export class PhaserAction {
  public type: ActionType;
  public targetObject: string;
  public requiredAction: InteractionAction;

  constructor(params: PhaserActionParams) {
    this.type = params.type;
    this.targetObject = params.targetObject;
    this.requiredAction = params.requiredAction;
  }
}
