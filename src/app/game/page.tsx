'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Cat } from '@/domain/cat';
import { GameSession, Scenario, ScenarioName, ScenarioPurpose } from '@/domain/game';
import { GameService } from '@/application/GameService';
import { logInfo, logError } from '@/lib/log';
import { createSampleScenario } from '@/data/sampleScenario';

// Phaserを使用するコンポーネントはSSR時にwindowエラーが出るため動的インポート
const GameCanvas = dynamic(() => import('@/presentation/components/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000'
    }}>
      ゲームを読み込み中...
    </div>
  )
});

export default function GamePage() {
  const [cat, setCat] = useState<Cat | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameEnded, setGameEnded] = useState(false);

  const gameService = new GameService();

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    try {
      setIsLoading(true);
      setError(null);

      logInfo('GamePage: Initializing game');

      // ゲーム開始
      const initialCat = Cat.createDefault('cat-1', 'たま');
      const events = createSampleScenario();
      const initialScenario = new Scenario(
        'scenario-001',
        new ScenarioName('最初のシナリオ'),
        new ScenarioPurpose('猫を飼う大変さを体験する'),
        7, // 1週間
        events
      );
      const initialSession = gameService.startNewSession(
        'session-001',
        initialCat.id,
        initialScenario
      );

      setCat(initialCat);
      setScenario(initialScenario);
      setSession(initialSession);

      logInfo('GamePage: Game initialized successfully', {
        catId: initialCat.id,
        scenarioId: initialScenario.id,
        sessionId: initialSession.id
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ゲームの初期化に失敗しました';
      logError('GamePage: Failed to initialize game', { error: errorMessage });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventComplete = async (eventIndex: number) => {
    if (!session || !scenario || !cat) return;

    try {
      logInfo('GamePage: Event completed', { eventIndex, sessionId: session.id });

      // 次のターンに進む
      const updatedSession = gameService.advanceToNextTurn(session);
      setSession(updatedSession);

      // シナリオ完了チェック
      if (gameService.isScenarioComplete(scenario, updatedSession.currentTurn)) {
        setGameEnded(true);
        logInfo('GamePage: Scenario completed');
      }

      logInfo('GamePage: Session updated', {
        sessionId: updatedSession.id,
        newTurn: updatedSession.currentTurn
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'イベント処理に失敗しました';
      logError('GamePage: Failed to process event', { error: errorMessage });
      setError(errorMessage);
    }
  };

  const handleGameEnd = async () => {
    try {
      logInfo('GamePage: Game ending');

      setGameEnded(true);

      logInfo('GamePage: Game ended successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ゲーム終了処理に失敗しました';
      logError('GamePage: Failed to end game', { error: errorMessage });
      setError(errorMessage);
    }
  };

  const handleError = (errorMessage: string) => {
    logError('GamePage: Game error', { error: errorMessage });
    setError(errorMessage);
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#000000'
      }}>
        読み込み中...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#ff4444',
        backgroundColor: '#000000',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '20px' }}>エラーが発生しました</div>
        <div style={{ fontSize: '14px', color: '#ffffff' }}>{error}</div>
        <button
          onClick={initializeGame}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4444ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          再試行
        </button>
      </div>
    );
  }

  if (gameEnded) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#000000'
      }}>
        <div style={{ marginBottom: '20px' }}>ゲームが終了しました</div>
        <button
          onClick={() => {
            setGameEnded(false);
            initializeGame();
          }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4444ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          最初から始める
        </button>
      </div>
    );
  }

  if (!cat || !scenario || !session) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#000000'
      }}>
        ゲームデータの読み込みに失敗しました
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <GameCanvas
        cat={cat}
        scenario={scenario}
        session={session}
        onGameEnd={handleGameEnd}
        onEventComplete={handleEventComplete}
        onError={handleError}
      />
    </div>
  );
}
