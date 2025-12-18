/**
 * アセットキー定数
 *
 * すべてのアセット（画像・スプライト・UI素材）のキーを一元管理します。
 * アセット差し替え時はこのファイルのみを変更すればOK。
 */

/**
 * 背景画像のキー
 */
export const BackgroundKeys = {
  RoomNight: 'room_night',
  RoomMidnight: 'room_midnight',
  RoomMorning: 'room_morning',
} as const;

/**
 * プレイヤースプライトのキー
 */
export const PlayerKeys = {
  Idle: 'player_idle',
  WalkUp: 'player_walk_up',
  WalkDown: 'player_walk_down',
  WalkLeft: 'player_walk_left',
  WalkRight: 'player_walk_right',
  Interact: 'player_interact',
} as const;

/**
 * 猫スプライトのキー
 */
export const CatKeys = {
  Sleeping: 'cat_sleeping',
  Sitting: 'cat_sitting',
  Standing: 'cat_standing',
  Walking: 'cat_walking',
  Running: 'cat_running',
  Meowing: 'cat_meowing',
  Playing: 'cat_playing',
} as const;

/**
 * オブジェクト画像のキー
 */
export const ObjectKeys = {
  Bed: 'bed',
  FoodBowl: 'food_bowl',
  LitterBox: 'litter_box',
  ToyShelf: 'toy_shelf',
  ToyBall: 'toy_ball',
  ToyMouse: 'toy_mouse',
} as const;

/**
 * UI素材のキー
 */
export const UIKeys = {
  ButtonNormal: 'button_normal',
  ButtonHover: 'button_hover',
  ButtonPressed: 'button_pressed',
  DialogBox: 'dialog_box',
  DialogBoxSmall: 'dialog_box_small',
  StatusBarBg: 'status_bar_bg',
  StatusBarFill: 'status_bar_fill',
} as const;

/**
 * アイコンのキー
 */
export const IconKeys = {
  Affection: 'icon_affection',
  Stress: 'icon_stress',
  Health: 'icon_health',
  Hunger: 'icon_hunger',
  Sleep: 'icon_sleep',
  Clock: 'icon_clock',
} as const;

/**
 * すべてのアセットキーを統合
 */
export const AssetKeys = {
  Backgrounds: BackgroundKeys,
  Player: PlayerKeys,
  Cat: CatKeys,
  Objects: ObjectKeys,
  UI: UIKeys,
  Icons: IconKeys,
} as const;

/**
 * アセットキーの型
 */
export type BackgroundKey = (typeof BackgroundKeys)[keyof typeof BackgroundKeys];
export type PlayerKey = (typeof PlayerKeys)[keyof typeof PlayerKeys];
export type CatKey = (typeof CatKeys)[keyof typeof CatKeys];
export type ObjectKey = (typeof ObjectKeys)[keyof typeof ObjectKeys];
export type UIKey = (typeof UIKeys)[keyof typeof UIKeys];
export type IconKey = (typeof IconKeys)[keyof typeof IconKeys];
