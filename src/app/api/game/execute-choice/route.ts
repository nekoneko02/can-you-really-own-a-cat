import { NextRequest, NextResponse } from 'next/server';
import { GameService } from '@/application/GameService';
import { SessionStore } from '@/infrastructure/session';
import { ScenarioRepository } from '@/infrastructure/repositories';

/**
 * 選択肢実行・Cat更新
 * POST /api/game/execute-choice
 */
export async function POST(request: NextRequest) {
  try {
    const { scenarioId, choiceId } = await request.json();

    if (!scenarioId || !choiceId) {
      return NextResponse.json(
        { error: 'scenarioIdとchoiceIdが必要です' },
        { status: 400 }
      );
    }

    // セッションから現在の状態を取得
    const sessionStore = new SessionStore();
    const session = await sessionStore.getSession();
    const gameSession = sessionStore.restoreGameSession(session);
    const cat = sessionStore.restoreCat(session);

    if (!gameSession || !cat) {
      return NextResponse.json({ error: 'セッションが存在しません' }, { status: 400 });
    }

    // Scenarioをリポジトリから取得
    const scenarioRepo = new ScenarioRepository();
    const scenario = await scenarioRepo.findById(scenarioId);

    if (!scenario) {
      return NextResponse.json({ error: 'シナリオが見つかりません' }, { status: 404 });
    }

    // GameServiceで選択肢を実行
    const gameService = new GameService();
    const currentEvent = gameService.getCurrentEvent(scenario, gameSession);

    if (!currentEvent) {
      return NextResponse.json({ error: 'イベントが見つかりません' }, { status: 404 });
    }

    const updatedCat = gameService.executeChoice(cat, currentEvent, choiceId);

    // セッションに保存
    await sessionStore.saveCat(session, updatedCat);

    return NextResponse.json({
      cat: {
        id: updatedCat.id,
        name: updatedCat.name,
        affectionLevel: updatedCat.affectionLevel.value,
        stressLevel: updatedCat.stressLevel.value,
        health: updatedCat.health.value,
        hunger: updatedCat.hunger.value,
      },
    });
  } catch (error) {
    console.error('Error in execute-choice:', error);
    return NextResponse.json(
      { error: '選択肢の実行に失敗しました' },
      { status: 500 }
    );
  }
}
