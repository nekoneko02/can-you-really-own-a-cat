/**
 * ゲームセッションエンティティ（値オブジェクト）
 * 1回のプレイセッションを表す
 * 不変性を保つため、すべてのプロパティはreadonlyで管理
 */
export class GameSession {
  constructor(
    private readonly _id: string,
    private readonly _catId: string,
    private readonly _scenarioId: string,
    private readonly _currentTurn: number
  ) {
    if (_currentTurn <= 0) {
      throw new Error('ターンは1以上にしてください');
    }
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
   * ターンを1つ進めた新しいセッションを返す（不変性）
   */
  advanceTurn(): GameSession {
    return new GameSession(
      this._id,
      this._catId,
      this._scenarioId,
      this._currentTurn + 1
    );
  }
}
