import { NextRequest, NextResponse } from 'next/server';
import { GameService } from '@/application/GameService';
import { SessionStore } from '@/infrastructure/session';
import { ScenarioRepository } from '@/infrastructure/repositories';

/**
 * 現在のイベント取得
 * POST /api/game/get-current-event
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

    // GameServiceで現在のイベントを取得
    const gameService = new GameService();
    const event = gameService.getCurrentEvent(scenario, gameSession);

    if (!event) {
      return NextResponse.json({ error: 'イベントが見つかりません' }, { status: 404 });
    }

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title.value,
        description: event.description.value,
        choices: event.choices.map((choice) => ({
          id: choice.id,
          text: choice.text,
        })),
      },
    });
  } catch (error) {
    console.error('Error in get-current-event:', error);
    return NextResponse.json(
      { error: 'イベント取得に失敗しました' },
      { status: 500 }
    );
  }
}
