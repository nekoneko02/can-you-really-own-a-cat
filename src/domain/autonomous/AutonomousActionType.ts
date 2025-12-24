/**
 * 自律アクションタイプ
 *
 * 猫が自律的に行うアクションの種類を定義します。
 */

export const AutonomousActionType = {
  SLEEPING: 'SLEEPING', // 眠る
  SITTING: 'SITTING', // 座る
  WANDERING: 'WANDERING', // 歩き回る
  MEOWING: 'MEOWING', // 鳴く
  IDLE_PLAYING: 'IDLE_PLAYING', // 一人遊び
  BEING_PETTED: 'BEING_PETTED', // 撫でられ中
  FLEEING: 'FLEEING', // 逃げる
  WAITING_AFTER_CARE: 'WAITING_AFTER_CARE', // ケア後の待機
  LOCKED_OUT: 'LOCKED_OUT', // 締め出し中
} as const;

export type AutonomousActionType =
  (typeof AutonomousActionType)[keyof typeof AutonomousActionType];
