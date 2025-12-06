import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { Cat, AffectionLevel, StressLevel, Health, Hunger } from '@/domain/cat';
import { GameSession } from '@/domain/game';

/**
 * セッションに保存するデータの型定義
 */
export interface SessionData {
  gameSession?: {
    id: string;
    scenarioId: string;
    currentTurn: number;
    catId: string;
  };
  cat?: {
    id: string;
    name: string;
    affectionLevel: number;
    stressLevel: number;
    health: number;
    hunger: number;
  };
}

/**
 * iron-sessionのラッパークラス
 * セッション管理の抽象化層
 */
export class SessionStore {
  private readonly sessionOptions = {
    password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
    cookieName: 'game_session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60, // 24時間
    },
  };

  /**
   * 現在のセッションを取得（なければ新規作成）
   */
  async getSession(): Promise<IronSession<SessionData>> {
    return getIronSession<SessionData>(await cookies(), this.sessionOptions);
  }

  /**
   * GameSessionをセッションに保存
   */
  async saveGameSession(
    session: IronSession<SessionData>,
    gameSession: GameSession
  ): Promise<void> {
    session.gameSession = {
      id: gameSession.id,
      scenarioId: gameSession.scenarioId,
      currentTurn: gameSession.currentTurn,
      catId: gameSession.catId,
    };
    await session.save();
  }

  /**
   * Catをセッションに保存
   */
  async saveCat(session: IronSession<SessionData>, cat: Cat): Promise<void> {
    session.cat = {
      id: cat.id,
      name: cat.name,
      affectionLevel: cat.affectionLevel.value,
      stressLevel: cat.stressLevel.value,
      health: cat.health.value,
      hunger: cat.hunger.value,
    };
    await session.save();
  }

  /**
   * GameSessionとCatを同時に保存
   */
  async saveSessionAndCat(
    session: IronSession<SessionData>,
    gameSession: GameSession,
    cat: Cat
  ): Promise<void> {
    session.gameSession = {
      id: gameSession.id,
      scenarioId: gameSession.scenarioId,
      currentTurn: gameSession.currentTurn,
      catId: gameSession.catId,
    };
    session.cat = {
      id: cat.id,
      name: cat.name,
      affectionLevel: cat.affectionLevel.value,
      stressLevel: cat.stressLevel.value,
      health: cat.health.value,
      hunger: cat.hunger.value,
    };
    await session.save();
  }

  /**
   * セッションからGameSessionを復元
   */
  restoreGameSession(session: IronSession<SessionData>): GameSession | null {
    if (!session.gameSession) {
      return null;
    }

    return new GameSession(
      session.gameSession.id,
      session.gameSession.catId,
      session.gameSession.scenarioId,
      session.gameSession.currentTurn
    );
  }

  /**
   * セッションからCatを復元
   */
  restoreCat(session: IronSession<SessionData>): Cat | null {
    if (!session.cat) {
      return null;
    }

    // セッションから保存された値でCatを復元
    const cat = Cat.createDefault(session.cat.id, session.cat.name);
    return cat
      .updateAffection(new AffectionLevel(session.cat.affectionLevel))
      .updateStress(new StressLevel(session.cat.stressLevel))
      .updateHealth(new Health(session.cat.health))
      .updateHunger(new Hunger(session.cat.hunger));
  }

  /**
   * セッションを破棄
   */
  async destroySession(session: IronSession<SessionData>): Promise<void> {
    session.destroy();
  }
}
