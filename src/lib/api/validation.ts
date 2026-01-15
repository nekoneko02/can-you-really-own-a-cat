/**
 * APIリクエストのバリデーション関数
 */

import { isValidSessionId } from '@/lib/session/utils';
import {
  ALLOWED_SCENARIO_SLUGS,
  ALLOWED_EXPECTATIONS,
  ALLOWED_AWARENESS,
  ERROR_CODES,
  type ErrorResponse,
  type Awareness,
} from './types';

/**
 * シナリオ識別子のバリデーション
 */
export function isValidScenarioSlug(slug: string): boolean {
  return ALLOWED_SCENARIO_SLUGS.includes(slug as (typeof ALLOWED_SCENARIO_SLUGS)[number]);
}

/**
 * 猫を飼いたい度合いのバリデーション
 */
export function isValidWantToCatLevel(level: unknown): boolean {
  if (typeof level !== 'number') return false;
  if (!Number.isInteger(level)) return false;
  return level >= 1 && level <= 5;
}

/**
 * 気づきの有無のバリデーション
 */
export function isValidAwareness(awareness: unknown): awareness is Awareness {
  if (typeof awareness !== 'string') return false;
  return ALLOWED_AWARENESS.includes(awareness as Awareness);
}

/**
 * 期待値配列のバリデーション
 */
export function isValidExpectations(expectations: unknown): boolean {
  if (expectations === undefined) return true;
  if (!Array.isArray(expectations)) return false;
  return expectations.every(
    (exp) =>
      typeof exp === 'string' &&
      ALLOWED_EXPECTATIONS.includes(exp as (typeof ALLOWED_EXPECTATIONS)[number])
  );
}

/**
 * その他の期待（otherExpectation）のバリデーション
 * 最大200文字
 */
export function isValidOtherExpectation(text: unknown): boolean {
  if (text === undefined) return true;
  if (typeof text !== 'string') return false;
  return text.length <= 200;
}

/**
 * 自由記述テキストのバリデーション
 */
export function isValidFreeText(text: unknown): boolean {
  if (text === undefined) return true;
  if (typeof text !== 'string') return false;
  return text.length <= 1000;
}

/**
 * 開始リクエストのバリデーション
 * @returns エラーがある場合はErrorResponse、有効な場合はnull
 */
export function validateStartRequest(body: unknown): ErrorResponse | null {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body', code: ERROR_CODES.VALIDATION_ERROR };
  }

  const request = body as Record<string, unknown>;

  // sessionIdのバリデーション
  if (!isValidSessionId(request.sessionId as string | undefined)) {
    return { error: 'Invalid or missing sessionId', code: ERROR_CODES.INVALID_SESSION_ID };
  }

  // preSurveyのバリデーション
  if (!request.preSurvey || typeof request.preSurvey !== 'object') {
    return { error: 'Missing preSurvey', code: ERROR_CODES.VALIDATION_ERROR };
  }

  const preSurvey = request.preSurvey as Record<string, unknown>;

  // wantToCatLevelのバリデーション
  if (!isValidWantToCatLevel(preSurvey.wantToCatLevel)) {
    return { error: 'Invalid wantToCatLevel (must be 1-5)', code: ERROR_CODES.VALIDATION_ERROR };
  }

  // expectationsのバリデーション
  if (!isValidExpectations(preSurvey.expectations)) {
    return { error: 'Invalid expectations', code: ERROR_CODES.VALIDATION_ERROR };
  }

  // otherExpectationのバリデーション
  if (!isValidOtherExpectation(preSurvey.otherExpectation)) {
    return { error: 'otherExpectation exceeds 200 characters', code: ERROR_CODES.VALIDATION_ERROR };
  }

  return null;
}

/**
 * シナリオ体験完了リクエストのバリデーション
 * @returns エラーがある場合はErrorResponse、有効な場合はnull
 */
export function validateScenarioCompleteRequest(body: unknown): ErrorResponse | null {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body', code: ERROR_CODES.VALIDATION_ERROR };
  }

  const request = body as Record<string, unknown>;

  // sessionIdのバリデーション
  if (!isValidSessionId(request.sessionId as string | undefined)) {
    return { error: 'Invalid or missing sessionId', code: ERROR_CODES.INVALID_SESSION_ID };
  }

  return null;
}

/**
 * 完了リクエストのバリデーション
 * @returns エラーがある場合はErrorResponse、有効な場合はnull
 */
export function validateCompleteRequest(body: unknown): ErrorResponse | null {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body', code: ERROR_CODES.VALIDATION_ERROR };
  }

  const request = body as Record<string, unknown>;

  // sessionIdのバリデーション
  if (!isValidSessionId(request.sessionId as string | undefined)) {
    return { error: 'Invalid or missing sessionId', code: ERROR_CODES.INVALID_SESSION_ID };
  }

  // postSurveyのバリデーション
  if (!request.postSurvey || typeof request.postSurvey !== 'object') {
    return { error: 'Missing postSurvey', code: ERROR_CODES.VALIDATION_ERROR };
  }

  const postSurvey = request.postSurvey as Record<string, unknown>;

  // wantToCatLevelのバリデーション
  if (!isValidWantToCatLevel(postSurvey.wantToCatLevel)) {
    return { error: 'Invalid wantToCatLevel (must be 1-5)', code: ERROR_CODES.VALIDATION_ERROR };
  }

  // awarenessのバリデーション
  if (!isValidAwareness(postSurvey.awareness)) {
    return { error: 'Invalid awareness', code: ERROR_CODES.VALIDATION_ERROR };
  }

  // freeTextのバリデーション
  if (!isValidFreeText(postSurvey.freeText)) {
    return { error: 'freeText exceeds 1000 characters', code: ERROR_CODES.VALIDATION_ERROR };
  }

  return null;
}
