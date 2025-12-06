import { NextRequest, NextResponse } from 'next/server';
import { GameService } from '@/application/GameService';
import { SessionStore } from '@/infrastructure/session';
import { ScenarioRepository } from '@/infrastructure/repositories';
import { Cat } from '@/domain/cat';

/**
 * ゲーム開始・セッション初期化
 * POST /api/game/load-scenario
 */
export async function POST(request: NextRequest) {
  try {
    const { scenarioId } = await request.json();

    if (!scenarioId) {
      return NextResponse.json({ error: 'scenarioIdが必要です' }, { status: 400 });
    }

    // Scenarioをリポジトリから取得
    const scenarioRepo = new ScenarioRepository();
    const scenario = await scenarioRepo.findById(scenarioId);

    if (!scenario) {
      return NextResponse.json({ error: 'シナリオが見つかりません' }, { status: 404 });
    }

    // セッション取得または作成
    const sessionStore = new SessionStore();
    const session = await sessionStore.getSession();

    // GameSessionとCatを生成
    const gameService = new GameService();
    const cat = Cat.createDefault('cat-1', 'たま');
    const gameSession = gameService.startNewSession('session-1', cat.id, scenario);

    // セッションに保存
    await sessionStore.saveSessionAndCat(session, gameSession, cat);

    return NextResponse.json({
      scenario: {
        id: scenario.id,
        name: scenario.name.value,
        purpose: scenario.purpose.value,
        duration: scenario.duration,
      },
    });
  } catch (error) {
    console.error('Error in load-scenario:', error);
    return NextResponse.json(
      { error: 'シナリオの読み込みに失敗しました' },
      { status: 500 }
    );
  }
}
