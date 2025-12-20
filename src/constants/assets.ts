/**
 * アセット定義の一元管理
 *
 * すべてのアセット（スプライト・画像・UI素材）の設定を管理します。
 * アセット差し替え時はこのファイルを編集すればOK。
 *
 * @remarks
 * - frameWidth/frameHeightは不要（Phaserが自動認識）
 * - フレーム数は frames 配列の長さで動的に決定
 * - MVP版ではプレースホルダーを使用、本番版では実際のパスを設定
 */

/**
 * アニメーション用アセット設定（複数フレーム）
 */
export interface AssetFrameConfig {
  key: string;
  frames: string[];
  frameRate: number;
}

/**
 * 単一画像アセット設定
 */
export interface AssetImageConfig {
  key: string;
  url: string;
}

/**
 * 背景画像アセット
 */
export const BACKGROUND_ASSETS: AssetImageConfig[] = [
  {
    key: 'room_night',
    url: '/assets/backgrounds/room_night.png',
  },
  {
    key: 'room_midnight',
    url: '/assets/backgrounds/room_midnight.png',
  },
  {
    key: 'room_morning',
    url: '/assets/backgrounds/room_morning.png',
  },
];

/**
 * プレイヤースプライトアセット
 */
export const PLAYER_ASSETS: AssetFrameConfig[] = [
  {
    key: 'player_idle',
    frames: ['/assets/characters/player/idle.png'],
    frameRate: 2,
  },
  {
    key: 'player_walk_up',
    frames: [
      '/assets/characters/player/walk_up_1.png',
      '/assets/characters/player/walk_up_2.png',
      '/assets/characters/player/walk_up_3.png',
      '/assets/characters/player/walk_up_4.png',
    ],
    frameRate: 8,
  },
  {
    key: 'player_walk_down',
    frames: [
      '/assets/characters/player/walk_down_1.png',
      '/assets/characters/player/walk_down_2.png',
      '/assets/characters/player/walk_down_3.png',
      '/assets/characters/player/walk_down_4.png',
    ],
    frameRate: 8,
  },
  {
    key: 'player_walk_left',
    frames: [
      '/assets/characters/player/walk_left_1.png',
      '/assets/characters/player/walk_left_2.png',
      '/assets/characters/player/walk_left_3.png',
      '/assets/characters/player/walk_left_4.png',
    ],
    frameRate: 8,
  },
  {
    key: 'player_walk_right',
    frames: [
      '/assets/characters/player/walk_right_1.png',
      '/assets/characters/player/walk_right_2.png',
      '/assets/characters/player/walk_right_3.png',
      '/assets/characters/player/walk_right_4.png',
    ],
    frameRate: 8,
  },
  {
    key: 'player_interact',
    frames: [
      '/assets/characters/player/interact_1.png',
      '/assets/characters/player/interact_2.png',
    ],
    frameRate: 4,
  },
];

/**
 * 猫スプライトアセット
 */
export const CAT_ASSETS: AssetFrameConfig[] = [
  {
    key: 'cat_sleeping',
    frames: [
      '/assets/characters/cat/sleeping_1.png',
      '/assets/characters/cat/sleeping_2.png',
    ],
    frameRate: 2,
  },
  {
    key: 'cat_sitting',
    frames: [
      '/assets/characters/cat/sitting_1.png',
      '/assets/characters/cat/sitting_2.png'
    ],
    frameRate: 2,
  },
  {
    key: 'cat_standing',
    frames: ['/assets/characters/cat/standing.png'],
    frameRate: 1,
  },
  {
    key: 'cat_walking',
    frames: [
      '/assets/characters/cat/walking_1.png',
      '/assets/characters/cat/walking_2.png',
    ],
    frameRate: 6,
  },
  {
    key: 'cat_running',
    frames: [
      '/assets/characters/cat/running_1.png',
      '/assets/characters/cat/running_2.png',
    ],
    frameRate: 8,
  },
  {
    key: 'cat_meowing',
    frames: [
      '/assets/characters/cat/meowing_1.png',
      '/assets/characters/cat/meowing_2.png',
    ],
    frameRate: 4,
  },
  {
    key: 'cat_playing',
    frames: [
      '/assets/characters/cat/playing_1.png',
      '/assets/characters/cat/playing_2.png',
    ],
    frameRate: 6,
  },
];

/**
 * オブジェクトアセット
 */
export const OBJECT_ASSETS: AssetImageConfig[] = [
  {
    key: 'bed',
    url: '/assets/objects/bed.png',
  },
  {
    key: 'food_bowl',
    url: '/assets/objects/food_bowl.png',
  },
  {
    key: 'litter_box',
    url: '/assets/objects/litter_box.png',
  },
  {
    key: 'toy_shelf',
    url: '/assets/objects/toy_shelf.png',
  },
  {
    key: 'toy_ball',
    url: '/assets/objects/toy_ball.png',
  },
  {
    key: 'toy_mouse',
    url: '/assets/objects/toy_mouse.png',
  },
];

/**
 * UIアセット
 */
export const UI_ASSETS: AssetImageConfig[] = [
  {
    key: 'button_normal',
    url: '/assets/ui/button_normal.png',
  },
  {
    key: 'button_hover',
    url: '/assets/ui/button_hover.png',
  },
  {
    key: 'button_pressed',
    url: '/assets/ui/button_pressed.png',
  },
  {
    key: 'dialog_box',
    url: '/assets/ui/dialog_box.png',
  },
  {
    key: 'dialog_box_small',
    url: '/assets/ui/dialog_box_small.png',
  },
  {
    key: 'status_bar_bg',
    url: '/assets/ui/status_bar_bg.png',
  },
  {
    key: 'status_bar_fill',
    url: '/assets/ui/status_bar_fill.png',
  },
];

/**
 * アイコンアセット（絵文字をフォールバックとして使用）
 */
export const ICON_ASSETS: AssetImageConfig[] = [
  {
    key: 'icon_affection',
    url: '/assets/icons/affection.png',
  },
  {
    key: 'icon_stress',
    url: '/assets/icons/stress.png',
  },
  {
    key: 'icon_health',
    url: '/assets/icons/health.png',
  },
  {
    key: 'icon_hunger',
    url: '/assets/icons/hunger.png',
  },
  {
    key: 'icon_sleep',
    url: '/assets/icons/sleep.png',
  },
  {
    key: 'icon_clock',
    url: '/assets/icons/clock.png',
  },
];

// ===== ヘルパー関数 =====

/**
 * すべての猫アニメーションキーを取得
 */
export const getAllCatAnimationKeys = (): string[] => {
  return CAT_ASSETS.map((asset) => asset.key);
};

/**
 * すべてのプレイヤーアニメーションキーを取得
 */
export const getAllPlayerAnimationKeys = (): string[] => {
  return PLAYER_ASSETS.map((asset) => asset.key);
};

/**
 * 指定キーの猫アセット設定を取得
 */
export const getCatAssetConfig = (key: string): AssetFrameConfig | undefined => {
  return CAT_ASSETS.find((asset) => asset.key === key);
};

/**
 * 指定キーのプレイヤーアセット設定を取得
 */
export const getPlayerAssetConfig = (key: string): AssetFrameConfig | undefined => {
  return PLAYER_ASSETS.find((asset) => asset.key === key);
};

/**
 * 指定キーのオブジェクトアセット設定を取得
 */
export const getObjectAssetConfig = (key: string): AssetImageConfig | undefined => {
  return OBJECT_ASSETS.find((asset) => asset.key === key);
};

/**
 * Phaser用の全フレームアセット一覧を取得
 */
export const getAllFrameAssets = (): AssetFrameConfig[] => {
  return [...PLAYER_ASSETS, ...CAT_ASSETS];
};

/**
 * Phaser用の全画像アセット一覧を取得
 */
export const getAllImageAssets = (): AssetImageConfig[] => {
  return [...BACKGROUND_ASSETS, ...OBJECT_ASSETS, ...UI_ASSETS, ...ICON_ASSETS];
};
