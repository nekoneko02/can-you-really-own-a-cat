/**
 * シナリオ開始API
 * POST /api/scenarios/{scenarioSlug}/start
 */

import { NextRequest, NextResponse } from 'next/server';
import { isValidScenarioSlug, validateStartRequest } from '@/lib/api/validation';
import { getSurveyStorage } from '@/lib/api/surveyStorage';
import { ERROR_CODES, type StartRequest, type StartResponse, type ErrorResponse } from '@/lib/api/types';

interface RouteParams {
  params: Promise<{
    scenarioSlug: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<StartResponse | ErrorResponse>> {
  try {
    const { scenarioSlug } = await params;

    // シナリオ識別子のバリデーション
    if (!isValidScenarioSlug(scenarioSlug)) {
      return NextResponse.json(
        { error: 'Invalid scenario slug', code: ERROR_CODES.INVALID_SCENARIO },
        { status: 400 }
      );
    }

    // リクエストボディのパース
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body', code: ERROR_CODES.VALIDATION_ERROR },
        { status: 400 }
      );
    }

    // リクエストのバリデーション
    const validationError = validateStartRequest(body);
    if (validationError) {
      return NextResponse.json(validationError, { status: 400 });
    }

    // 型アサーション（バリデーション済み）
    const { sessionId, preSurvey } = body as StartRequest;

    // アンケートデータを保存
    const storage = getSurveyStorage();
    const record = storage.saveStartSurvey(sessionId, scenarioSlug, preSurvey);

    // レスポンス
    const response: StartResponse = {
      success: true,
      startedAt: record.startedAt,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Start API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: ERROR_CODES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
