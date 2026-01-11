/**
 * シナリオレジストリ
 *
 * 全シナリオのメタデータを一元管理する
 */

export interface ScenarioMetadata {
  /** シナリオID */
  id: string;
  /** シナリオ名 */
  title: string;
  /** 短い説明（カード表示用） */
  shortDescription: string;
  /** 詳細説明（アコーディオン展開時） */
  fullDescription: string;
  /** 所要時間目安 */
  estimatedTime: string;
  /** テーマ/カテゴリ */
  theme: string;
  /** アイコン名 */
  icon: string;
}

/**
 * 登録済みシナリオ一覧
 */
const scenarios: ScenarioMetadata[] = [
  {
    id: 'nightcry',
    title: '夜泣き・睡眠不足',
    shortDescription: '猫の夜泣きを5日間体験...',
    fullDescription:
      '猫を迎えて数週間。ある夜、鳴き声で目が覚めた——この体験では、夜泣きによる睡眠不足がどのように日常に影響するかを体験します。',
    estimatedTime: '約5〜10分',
    theme: '睡眠',
    icon: 'moon',
  },
];

/**
 * 全シナリオを取得
 */
export function getAllScenarios(): ScenarioMetadata[] {
  return [...scenarios];
}

/**
 * IDでシナリオを取得
 */
export function getScenarioById(id: string): ScenarioMetadata | undefined {
  return scenarios.find((s) => s.id === id);
}
