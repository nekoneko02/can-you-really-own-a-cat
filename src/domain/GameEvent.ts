/**
 * ゲームイベント
 *
 * 夜泣きイベントなど、ゲーム内で発生するイベントを表現します。
 * プレイヤーの選択に応じて結果が変わります。
 */

import { TimeOfDay } from './types';
import { Choice } from './Choice';
import { Consequence } from './Consequence';
import { PhaserAction } from './PhaserAction';

export interface GameEventParams {
  id: string;
  day: number;
  timeOfDay: TimeOfDay;
  title: string;
  description: string;
  catStateDescription: string[];
  choices: Choice[];
}

export class GameEvent {
  public id: string;
  public day: number;
  public timeOfDay: TimeOfDay;
  public title: string;
  public description: string;
  public catStateDescription: string[];
  public choices: Choice[];

  private triggered: boolean = false;
  private completedActions: Set<string> = new Set();

  constructor(params: GameEventParams) {
    this.id = params.id;
    this.day = params.day;
    this.timeOfDay = params.timeOfDay;
    this.title = params.title;
    this.description = params.description;
    this.catStateDescription = params.catStateDescription;
    this.choices = params.choices;
  }

  /**
   * イベントを発火する
   */
  public trigger(): void {
    this.triggered = true;
  }

  /**
   * イベントが発火されたかどうか
   */
  public isTriggered(): boolean {
    return this.triggered;
  }

  /**
   * 選択肢を実行し、結果を返す
   * @param choiceId 選択肢のID
   */
  public executeChoice(choiceId: string): Consequence {
    const choice = this.choices.find((c) => c.id === choiceId);

    if (!choice) {
      throw new Error(`Choice not found: ${choiceId}`);
    }

    return choice.execute();
  }

  /**
   * 指定した選択肢のPhaserActionを取得
   * @param choiceId 選択肢のID
   */
  public getPhaserAction(choiceId: string): PhaserAction | null {
    const choice = this.choices.find((c) => c.id === choiceId);

    if (!choice) {
      throw new Error(`Choice not found: ${choiceId}`);
    }

    return choice.phaserAction;
  }

  /**
   * アクションを完了済みとしてマークする
   * @param actionId アクションID
   */
  public completeAction(actionId: string): void {
    this.completedActions.add(actionId);
  }

  /**
   * アクションが完了済みかどうか
   * @param actionId アクションID
   */
  public isActionCompleted(actionId: string): boolean {
    return this.completedActions.has(actionId);
  }

  /**
   * 時間制限をチェックする（MVP版では未実装）
   * @returns 時間切れの場合true
   */
  public checkTimeLimit(): boolean {
    // MVP版では時間制限なし
    return false;
  }
}
