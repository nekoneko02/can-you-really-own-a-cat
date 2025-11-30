import { ParameterChange } from './ParameterChange';

/**
 * イベント結果を表す値オブジェクト
 * 選択肢に応じたパラメータ変化をまとめたもの
 */
export class EventResult {
  constructor(
    private readonly _resultText: string,
    private readonly _changes: ParameterChange[]
  ) {}

  get resultText(): string {
    return this._resultText;
  }

  get changes(): ParameterChange[] {
    return this._changes;
  }
}
