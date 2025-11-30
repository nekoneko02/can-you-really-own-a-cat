/**
 * ゲームセッションエンティティ
 * 1回のプレイセッションを表す
 */
export class GameSession {
  private _currentTurn: number;

  constructor(
    private readonly _id: string,
    private readonly _catId: string,
    private readonly _scenarioId: string,
    currentTurn: number
  ) {
    if (currentTurn <= 0) {
      throw new Error('ターンは1以上にしてください');
    }

    this._currentTurn = currentTurn;
  }

  get id(): string {
    return this._id;
  }

  get catId(): string {
    return this._catId;
  }

  get scenarioId(): string {
    return this._scenarioId;
  }

  get currentTurn(): number {
    return this._currentTurn;
  }

  /**
   * ターンを1つ進める
   */
  advanceTurn(): void {
    this._currentTurn++;
  }
}
