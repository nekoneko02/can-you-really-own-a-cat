/**
 * MorningMessageGenerator - 朝のメッセージ生成
 *
 * 夜泣きイベントの結果に基づいて、朝のセリフを生成します。
 * 事実ベースの表現で、気持ちの決めつけを避けます。
 */

import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';

/**
 * 夜泣きイベント結果の型
 */
export interface NightCryResultForMessage {
  /** 夜泣きイベントがあったかどうか */
  hadNightCryEvent: boolean;
  /** 最後に選択したアクション（イベントがあった場合） */
  lastAction?: NightCryActionType | null;
  /** どちらで完了したか（満足 or 諦め） */
  completedBy?: 'satisfaction' | 'resignation' | null;
}

/**
 * 朝のメッセージ
 */
export interface MorningMessage {
  /** 睡眠の質に関するセリフ（1行目） */
  sleepQualityLine: string;
  /** 対応方法振り返りセリフ（2行目、イベントなしの場合はnull） */
  reflectionLine: string | null;
}

/**
 * 朝のメッセージを生成
 *
 * @param result 夜泣きイベントの結果
 * @returns 朝のメッセージ
 */
export function generateMorningMessage(
  result: NightCryResultForMessage
): MorningMessage {
  const sleepQualityLine = generateSleepQualityLine(result.hadNightCryEvent);
  const reflectionLine = generateReflectionLine(result);

  return {
    sleepQualityLine,
    reflectionLine,
  };
}

/**
 * 睡眠の質セリフを生成（1行目）
 */
function generateSleepQualityLine(hadNightCryEvent: boolean): string {
  if (hadNightCryEvent) {
    return '（途中で起きたせいか、なんだかスッキリしない…）';
  }
  return '（よく眠れた…）';
}

/**
 * 対応方法振り返りセリフを生成（2行目）
 */
function generateReflectionLine(
  result: NightCryResultForMessage
): string | null {
  if (!result.hadNightCryEvent) {
    return null;
  }

  const lastAction = result.lastAction;

  // 締め出した場合
  if (lastAction === NightCryActionType.LOCKED_OUT) {
    return '別の部屋に出しちゃったけど…大丈夫かな';
  }

  // 満足で終了した場合（遊ぶ/撫でる）
  if (result.completedBy === 'satisfaction') {
    return '昨夜は付き合ってあげたな…';
  }

  // 諦めで終了した場合（無視）
  if (result.completedBy === 'resignation') {
    return '昨夜は構ってあげられなかった…';
  }

  // その他（おやつなど）
  return '昨夜は構ってあげられなかった…';
}
