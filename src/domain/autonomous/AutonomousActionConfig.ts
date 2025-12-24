/**
 * 自律アクションの時間設定
 *
 * 全ての時間パラメータを一元管理します。
 */
export const AutonomousActionConfig = {
  // 鳴くアクション
  meowing: {
    interval: 1000, // 鳴く間隔（ミリ秒）
    baseDuration: 30000, // 基本持続時間
  },

  // 座るアクション
  sitting: {
    duration: 3000, // 持続時間（ミリ秒）
  },

  // 歩き回るアクション
  wandering: {
    duration: 3000, // 持続時間（ミリ秒）
    targetChangeInterval: 2000,
    moveSpeed: 50,
  },

  // 一人遊びアクション（自動遷移なし）
  idlePlaying: {
    // 自動遷移しないため持続時間なし
  },

  // 撫でられ中アクション（自動遷移なし）
  beingPetted: {
    // 自動遷移しないため持続時間なし
  },

  // ケア後の待機アクション
  waitingAfterCare: {
    duration: 3000, // 持続時間（ミリ秒）
  },

  // 逃げるアクション
  fleeing: {
    moveSpeed: 80, // 移動速度（通常より速い）
    minDistanceFromPlayer: 150,
  },

  // 朝遷移条件
  morningTransition: {
    meowingOrLockedOutThreshold: 15000, // MEOWING + LOCKED_OUT >= 15秒
    feedingOrPlayingThreshold: 15000, // FEEDING + PLAYING >= 15秒
  },
} as const;

export type AutonomousActionConfigType = typeof AutonomousActionConfig;
