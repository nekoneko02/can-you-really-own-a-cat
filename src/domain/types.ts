/**
 * Domain層の基本型定義
 *
 * このファイルはDomain層で使用される全てのEnum定義を含みます。
 * これらの型はDomain層で定義し、他の層（Application, Phaser, React）から参照されます。
 */

/**
 * ゲームフェーズ
 */
export const GamePhase = {
  NIGHT_PREP: 'NIGHT_PREP',         // 夜フェーズ（就寝準備）
  MIDNIGHT_EVENT: 'MIDNIGHT_EVENT', // 夜中フェーズ（イベント発生）
  MORNING_OUTRO: 'MORNING_OUTRO',   // 朝フェーズ（起床・振り返り）
  GAME_END: 'GAME_END',             // ゲーム終了
} as const;
export type GamePhase = typeof GamePhase[keyof typeof GamePhase];

/**
 * 時間帯
 */
export const TimeOfDay = {
  NIGHT: 'NIGHT',       // 夜（22:00-）
  MIDNIGHT: 'MIDNIGHT', // 夜中（1:00-4:00）
  MORNING: 'MORNING',   // 朝（7:00-）
} as const;
export type TimeOfDay = typeof TimeOfDay[keyof typeof TimeOfDay];

/**
 * 猫の状態
 */
export const CatState = {
  SLEEPING: 'SLEEPING', // 眠っている
  SITTING: 'SITTING',   // 座っている
  STANDING: 'STANDING', // 立っている
  WALKING: 'WALKING',   // 歩いている
  RUNNING: 'RUNNING',   // 走っている
  MEOWING: 'MEOWING',   // 鳴いている
  PLAYING: 'PLAYING',   // 遊んでいる
} as const;
export type CatState = typeof CatState[keyof typeof CatState];

/**
 * 猫の気分
 */
export const CatMood = {
  NEUTRAL: 'NEUTRAL', // 普通
  HAPPY: 'HAPPY',     // 嬉しい
  ANGRY: 'ANGRY',     // 怒っている
  SCARED: 'SCARED',   // 怖がっている
  SLEEPY: 'SLEEPY',   // 眠い
} as const;
export type CatMood = typeof CatMood[keyof typeof CatMood];

/**
 * おもちゃの種類
 */
export const ToyType = {
  BALL: 'BALL',       // ボール
  MOUSE: 'MOUSE',     // ネズミのおもちゃ
  FEATHER: 'FEATHER', // 羽のおもちゃ
} as const;
export type ToyType = typeof ToyType[keyof typeof ToyType];

/**
 * 移動方向
 */
export const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  NONE: 'NONE',
} as const;
export type Direction = typeof Direction[keyof typeof Direction];

/**
 * Phaserアクションのタイプ
 */
export const ActionType = {
  MOVE_TO: 'MOVE_TO',           // 特定の場所に移動
  INTERACT_WITH: 'INTERACT_WITH', // 対象とインタラクト
  WAIT: 'WAIT',                 // 待機
} as const;
export type ActionType = typeof ActionType[keyof typeof ActionType];

/**
 * インタラクションアクション
 */
export const InteractionAction = {
  CATCH: 'CATCH',     // 捕まえる
  PET: 'PET',         // 撫でる
  PICK_UP: 'PICK_UP', // 拾う（おもちゃ等）
  PLAY: 'PLAY',       // 遊ぶ
} as const;
export type InteractionAction = typeof InteractionAction[keyof typeof InteractionAction];
