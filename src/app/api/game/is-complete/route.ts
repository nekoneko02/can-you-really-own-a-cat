import { NextRequest, NextResponse } from 'next/server';
import { GameService } from '@/application/GameService';
import { SessionStore } from '@/infrastructure/session';
import { ScenarioRepository } from '@/infrastructure/repositories';

/**
 * シナリオ完了判定
 * POST /api/game/is-complete
 */
export async function POST(request: NextRequest) {
  try {
    const { scenarioId } = await request.json();

    if (!scenarioId) {
      return NextResponse.json({ error: 'scenarioIdが必要です' }, { status: 400 });
    }

    // セッションから現在の状態を取得
    const sessionStore = new SessionStore();
    const session = await sessionStore.getSession();
    const gameSession = sessionStore.restoreGameSession(session);

    if (!gameSession) {
      return NextResponse.json({ error: 'セッションが存在しません' }, { status: 400 });
    }

    // Scenarioをリポジトリから取得
    const scenarioRepo = new ScenarioRepository();
    const scenario = await scenarioRepo.findById(scenarioId);

    if (!scenario) {
      return NextResponse.json({ error: 'シナリオが見つかりません' }, { status: 404 });
    }

    // GameServiceで完了判定
    const gameService = new GameService();
    const isComplete = gameService.isScenarioComplete(scenario, gameSession);

    return NextResponse.json({ isComplete });
  } catch (error) {
    console.error('Error in is-complete:', error);
    return NextResponse.json(
      { error: 'シナリオ完了判定に失敗しました' },
      { status: 500 }
    );
  }
}
