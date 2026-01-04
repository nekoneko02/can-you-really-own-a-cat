/**
 * APIクライアント
 * フロントエンドからAPIを呼び出すためのクライアント
 */

import type {
  PreSurvey,
  PostSurvey,
  StartResponse,
  CompleteResponse,
  ErrorResponse,
} from './types';

/**
 * APIエラー
 */
export class ApiError extends Error {
  constructor(
    public readonly error: string,
    public readonly code: string
  ) {
    super(error);
    this.name = 'ApiError';
  }
}

/**
 * アンケートAPIクライアント
 */
export const surveyApiClient = {
  /**
   * シナリオ開始を記録
   */
  async startScenario(
    scenarioSlug: string,
    sessionId: string,
    preSurvey: PreSurvey
  ): Promise<StartResponse> {
    const response = await fetch(`/api/scenarios/${scenarioSlug}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        preSurvey,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ErrorResponse;
      throw new ApiError(errorData.error, errorData.code);
    }

    return data as StartResponse;
  },

  /**
   * シナリオ完了を記録
   */
  async completeScenario(
    scenarioSlug: string,
    sessionId: string,
    postSurvey: PostSurvey
  ): Promise<CompleteResponse> {
    const response = await fetch(`/api/scenarios/${scenarioSlug}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        postSurvey,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ErrorResponse;
      throw new ApiError(errorData.error, errorData.code);
    }

    return data as CompleteResponse;
  },
};
