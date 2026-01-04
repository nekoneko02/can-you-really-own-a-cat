/**
 * アンケートAPI型定義
 * OpenAPI仕様 (docs/api/openapi.yaml) に準拠
 */

/**
 * 許可されるシナリオ識別子
 */
export const ALLOWED_SCENARIO_SLUGS = ['night-crying'] as const;
export type ScenarioSlug = (typeof ALLOWED_SCENARIO_SLUGS)[number];

/**
 * 猫を飼いたい度合い (1-5)
 * - 1: とても飼いたい
 * - 2: やや飼いたい
 * - 3: 迷っている
 * - 4: あまり飼いたくない
 * - 5: 飼うつもりはない
 */
export type WantToCatLevel = 1 | 2 | 3 | 4 | 5;

/**
 * 許可される期待値
 */
export const ALLOWED_EXPECTATIONS = [
  '飼育の大変さを知りたい',
  '猫との生活をイメージしたい',
  '飼う前に気づきを得たい',
  'その他',
] as const;
export type Expectation = (typeof ALLOWED_EXPECTATIONS)[number];

/**
 * 気づきの有無
 */
export const ALLOWED_AWARENESS = ['new', 'realized', 'none'] as const;
export type Awareness = (typeof ALLOWED_AWARENESS)[number];

/**
 * 開始時アンケート
 */
export interface PreSurvey {
  wantToCatLevel: WantToCatLevel;
  expectations?: Expectation[];
}

/**
 * 終了時アンケート
 */
export interface PostSurvey {
  wantToCatLevel: WantToCatLevel;
  awareness: Awareness;
  freeText?: string;
}

/**
 * シナリオ開始リクエスト
 */
export interface StartRequest {
  sessionId: string;
  preSurvey: PreSurvey;
}

/**
 * シナリオ完了リクエスト
 */
export interface CompleteRequest {
  sessionId: string;
  postSurvey: PostSurvey;
}

/**
 * シナリオ開始レスポンス
 */
export interface StartResponse {
  success: boolean;
  startedAt: string;
}

/**
 * シナリオ完了レスポンス
 */
export interface CompleteResponse {
  success: boolean;
  completedAt: string;
}

/**
 * エラーレスポンス
 */
export interface ErrorResponse {
  error: string;
  code: string;
}

/**
 * エラーコード
 */
export const ERROR_CODES = {
  INVALID_SESSION_ID: 'INVALID_SESSION_ID',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_SCENARIO: 'INVALID_SCENARIO',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
