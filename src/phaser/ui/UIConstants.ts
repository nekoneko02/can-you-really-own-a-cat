/**
 * UIConstants
 *
 * UI共通の定数ファイル。
 * 色、フォント、サイズ、レイアウト定数を一元管理します。
 */

/**
 * UIカラーパレット
 */
export const UIColors = {
  // プライマリカラー（ボタン）
  primary: 0x4a6fa5, // 落ち着いた青
  primaryHover: 0x5a82b5, // ホバー時

  // セカンダリカラー
  secondary: 0x6a6a6a, // 灰色
  secondaryHover: 0x8a8a8a, // ホバー時

  // アクセントカラー
  accent: 0x5cb85c, // 緑（ポジティブアクション）
  warning: 0xf0ad4e, // 黄色（警告）
  danger: 0xd9534f, // 赤（危険）

  // テキスト
  textLight: 0xffffff, // 白（暗い背景用）
  textDark: 0x333333, // 濃灰（明るい背景用）
  textMuted: 0xcccccc, // 薄灰（副次的テキスト）
  textHighlight: 0xffdd44, // 黄色（猫の様子など）

  // 背景
  dialogBg: 0x000000, // ダイアログ背景
  dialogBgAlpha: 0.85, // ダイアログ透明度

  // ステータスバー
  statusAffection: 0xff6b9d, // なつき度（ピンク）
  statusStress: 0xffaa00, // ストレス（オレンジ）
  statusHealth: 0x4caf50, // 健康度（緑）
  statusHunger: 0xffd54f, // 空腹度（黄）
} as const;

/**
 * UIフォントスタイル
 */
export const UIFonts = {
  family: 'Arial, sans-serif',

  // フォントサイズ
  titleLarge: '28px', // シーンタイトル
  titleMedium: '22px', // ダイアログタイトル
  body: '18px', // 本文
  bodySmall: '16px', // 副次的本文
  button: '18px', // ボタン
  label: '14px', // ラベル
  indicator: '14px', // 進行インジケーター
} as const;

/**
 * UIボタンサイズ
 */
export const UIButtonSizes = {
  // 選択肢ボタン（右端配置用）
  choice: { width: 170, height: 40, radius: 8 },

  // プライマリボタン（シーン遷移など）
  primary: { width: 200, height: 50, radius: 10 },

  // セカンダリボタン（モーダル内など）
  secondary: { width: 120, height: 36, radius: 6 },
} as const;

/**
 * UIレイアウト定数
 */
export const UILayout = {
  // 画面サイズ
  screen: { width: 800, height: 600 },

  // エリア定義
  playArea: { x: 0, y: 0, width: 590, height: 470 },
  statusArea: { x: 600, y: 10, width: 190, height: 130 },
  choiceArea: { x: 600, y: 140, width: 190, height: 340 },
  dialogArea: { x: 0, y: 480, width: 800, height: 120 },

  // 選択肢ボタン配置
  choiceButton: {
    x: 695, // 右端中央 (600 + 190/2)
    startY: 160, // 最初のボタンのY座標
    spacing: 50, // ボタン間隔
  },

  // ダイアログ内テキスト配置
  dialog: {
    textX: 30,
    textY: 500,
    textWidth: 700, // テキスト折り返し幅
    indicatorX: 750, // 進行インジケーター位置
    indicatorY: 580,
  },
} as const;
