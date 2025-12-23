/**
 * NightCryActionSelector
 *
 * 夜泣きイベントにおける選択可能なアクションを決定するドメインロジック
 * UI層から状態遷移ロジックを分離し、テスト可能にする
 */

import { NightCryActionType } from './actions/NightCryActionType';

/**
 * 初期選択肢（MEOWINGからの遷移）
 */
const INITIAL_CHOICES: NightCryActionType[] = [
  NightCryActionType.PLAYING,
  NightCryActionType.PETTING,
  NightCryActionType.FEEDING_SNACK,
  NightCryActionType.IGNORING,
  NightCryActionType.CATCHING,
];

/**
 * 無視中の選択肢（IGNORINGを除く）
 */
const IGNORING_CHOICES: NightCryActionType[] = [
  NightCryActionType.PLAYING,
  NightCryActionType.PETTING,
  NightCryActionType.FEEDING_SNACK,
  NightCryActionType.CATCHING,
];

export class NightCryActionSelector {
  /**
   * 現在の状態から選択可能なアクション一覧を取得
   *
   * @param currentAction 現在実行中のアクション（null = 初期状態）
   * @returns 選択可能なアクションの配列
   */
  getAvailableActions(currentAction: NightCryActionType | null): NightCryActionType[] {
    if (currentAction === null) {
      // 初期状態
      return [...INITIAL_CHOICES];
    }

    switch (currentAction) {
      case NightCryActionType.PLAYING:
      case NightCryActionType.PETTING:
        // 遊ぶ/撫でる中は「やめる」のみ
        return [NightCryActionType.STOP_CARE];

      case NightCryActionType.LOCKED_OUT:
        // 締め出し中は「戻す」のみ
        return [NightCryActionType.RETURN_CAT];

      case NightCryActionType.STOP_CARE:
      case NightCryActionType.RETURN_CAT:
        // やめる/戻す後は再度選択肢を表示
        return [...INITIAL_CHOICES];

      case NightCryActionType.IGNORING:
        // 無視中も選択肢を表示（ただしIGNORINGは除く）
        return [...IGNORING_CHOICES];

      case NightCryActionType.CATCHING:
        // 捕まえ中は選択肢なし（自動進行）
        return [];

      case NightCryActionType.FEEDING_SNACK:
        // おやつ後は選択肢を表示
        return [...INITIAL_CHOICES];

      default:
        return [];
    }
  }
}
