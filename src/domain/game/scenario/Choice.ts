/**
 * イベントの選択肢を表す値オブジェクト
 */
export class Choice {
  constructor(
    private readonly _id: string,
    private readonly _text: string
  ) {}

  get id(): string {
    return this._id;
  }

  get text(): string {
    return this._text;
  }
}
