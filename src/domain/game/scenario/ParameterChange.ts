/**
 * パラメータ変化を表す値オブジェクト
 * イベント結果として猫の状態・プレイヤー状態・環境がどう変化するかを表現
 */
export type ParameterType =
  | 'affection' // 猫のなつき度
  | 'stress' // 猫のストレス度
  | 'health' // 猫の健康度
  | 'hunger' // 猫の空腹度
  | 'playerStress' // プレイヤーのストレス
  | 'playerFatigue' // プレイヤーの疲労度
  | 'playerEnergy' // プレイヤーの体力
  | 'roomCleanliness' // 部屋の清潔度
  | 'totalCost'; // 累積費用

export class ParameterChange {
  constructor(
    private readonly _parameterType: ParameterType,
    private readonly _changeAmount: number
  ) {}

  get parameterType(): ParameterType {
    return this._parameterType;
  }

  get changeAmount(): number {
    return this._changeAmount;
  }
}
