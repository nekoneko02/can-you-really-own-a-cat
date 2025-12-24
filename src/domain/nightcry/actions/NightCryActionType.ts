/**
 * 夜泣きアクションタイプ
 *
 * プレイヤーが夜泣きイベント時に選択できるアクションの種類
 */

export const NightCryActionType = {
  PLAYING: 'PLAYING',           // 遊んであげる
  PETTING: 'PETTING',           // 撫でてあげる
  FEEDING_SNACK: 'FEEDING_SNACK', // おやつをあげる
  IGNORING: 'IGNORING',         // 無視して寝続ける
  CATCHING: 'CATCHING',         // 猫を捕まえようとする
  LOCKED_OUT: 'LOCKED_OUT',     // 猫を締め出し中
  STOP_CARE: 'STOP_CARE',       // 遊ぶ/撫でるをやめる
  RETURN_CAT: 'RETURN_CAT',     // 締め出しから猫を戻す
} as const;

export type NightCryActionType =
  typeof NightCryActionType[keyof typeof NightCryActionType];
