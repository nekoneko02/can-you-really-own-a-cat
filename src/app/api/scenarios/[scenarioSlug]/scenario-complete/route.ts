/**
 * シナリオ体験完了API
 * POST /api/scenarios/{scenarioSlug}/scenario-complete
 *
 * シナリオ体験完了（レポート表示）時に呼び出され、
 * scenarioCompletedAtをDynamoDBに記録する。
 */

import { NextRequest, NextResponse } from 'next/server';
import { isValidScenarioSlug, validateScenarioCompleteRequest } from '@/lib/api/validation';
import { getSurveyStorage } from '@/lib/api/surveyStorage';
import { ERROR_CODES, type ScenarioCompleteRequest, type ScenarioCompleteResponse, type ErrorResponse } from '@/lib/api/types';

interface RouteParams {
  params: Promise<{
    scenarioSlug: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ScenarioCompleteResponse | ErrorResponse>> {
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
    const validationError = validateScenarioCompleteRequest(body);
    if (validationError) {
      return NextResponse.json(validationError, { status: 400 });
    }

    // 型アサーション（バリデーション済み）
    const { sessionId } = body as ScenarioCompleteRequest;

    // シナリオ完了を保存
    const storage = await getSurveyStorage();
    const record = await storage.saveScenarioComplete(sessionId);

    // 開始記録が見つからない場合
    if (!record) {
      return NextResponse.json(
        { error: 'Start record not found', code: ERROR_CODES.SESSION_NOT_FOUND },
        { status: 404 }
      );
    }

    // レスポンス
    const response: ScenarioCompleteResponse = {
      scenarioCompletedAt: record.scenarioCompletedAt!,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Scenario complete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: ERROR_CODES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
