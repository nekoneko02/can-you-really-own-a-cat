import { NextRequest, NextResponse } from 'next/server';
import { GameService } from '@/application/GameService';
import { SessionStore } from '@/infrastructure/session';

/**
 * ターン進行
 * POST /api/game/advance-turn
 */
export async function POST(request: NextRequest) {
  try {
    // セッションから現在の状態を取得
    const sessionStore = new SessionStore();
    const session = await sessionStore.getSession();
    const gameSession = sessionStore.restoreGameSession(session);

    if (!gameSession) {
      return NextResponse.json({ error: 'セッションが存在しません' }, { status: 400 });
    }

    // GameServiceでターンを進める
    const gameService = new GameService();
    const updatedSession = gameService.advanceToNextTurn(gameSession);

    // セッションに保存
    await sessionStore.saveGameSession(session, updatedSession);

    return NextResponse.json({
      session: {
        id: updatedSession.id,
        scenarioId: updatedSession.scenarioId,
        currentTurn: updatedSession.currentTurn,
        catId: updatedSession.catId,
      },
    });
  } catch (error) {
    console.error('Error in advance-turn:', error);
    return NextResponse.json(
      { error: 'ターン進行に失敗しました' },
      { status: 500 }
    );
  }
}
