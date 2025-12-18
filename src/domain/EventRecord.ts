/**
 * イベント記録
 *
 * プレイヤーがイベントで行った選択と感情の記録。
 */

export interface EmotionData {
  satisfaction: number; // 満足度（1-5）
  burden: number;       // 負担感（1-5）
  freeText?: string;    // 自由記述
}

export interface EventRecord {
  eventId: string;
  day: number;
  choiceId: string;
  emotion: EmotionData;
  timestamp: number;
}
