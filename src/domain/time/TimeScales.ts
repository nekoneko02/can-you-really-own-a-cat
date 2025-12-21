/**
 * TimeScales - アクション毎のスケール定義
 *
 * 各アクションに対応する時間スケールを定義します。
 * スケール値が大きいほど、ゲーム内時間が速く進みます。
 *
 * 例: スケール30.0 = 現実1秒でゲーム内30秒が経過
 *     → 現実30秒でゲーム内15分（900秒）が経過
 */

import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';

/**
 * 時間スケール定義
 */
export const TimeScales = {
  /** 遊ぶアクション: 30倍速（現実30秒 = ゲーム内15分） */
  PLAYING: 30.0,

  /** 撫でるアクション: 30倍速（現実30秒 = ゲーム内15分） */
  PETTING: 30.0,

  /** 無視するアクション: 30倍速（現実30秒 = ゲーム内15分） */
  IGNORING: 30.0,

  /** 締め出しアクション: 30倍速（現実30秒 = ゲーム内15分） */
  LOCKED_OUT: 30.0,

  /** デフォルトスケール（等倍） */
  DEFAULT: 1.0,
} as const;

/**
 * アクションタイプからスケールを取得
 * @param actionType アクションタイプ（nullの場合はDEFAULT）
 * @returns スケール倍率
 */
export function getTimeScale(actionType: NightCryActionType | null): number {
  if (actionType === null) {
    return TimeScales.DEFAULT;
  }

  switch (actionType) {
    case NightCryActionType.PLAYING:
      return TimeScales.PLAYING;
    case NightCryActionType.PETTING:
      return TimeScales.PETTING;
    case NightCryActionType.IGNORING:
      return TimeScales.IGNORING;
    case NightCryActionType.LOCKED_OUT:
      return TimeScales.LOCKED_OUT;
    default:
      return TimeScales.DEFAULT;
  }
}
