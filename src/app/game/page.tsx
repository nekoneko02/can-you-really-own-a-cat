'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { logInfo, logError } from '@/lib/log';

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
  const [error, setError] = useState<string | null>(null);
  const [gameEnded, setGameEnded] = useState(false);

  // MVP期：固定のシナリオID（ScenarioRepositoryと一致させる）
  const scenarioId = 'scenario-1';

  const handleGameEnd = () => {
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
          onClick={() => window.location.reload()}
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
          onClick={() => window.location.reload()}
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

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000'
    }}>
      <GameCanvas
        scenarioId={scenarioId}
        onGameEnd={handleGameEnd}
        onError={handleError}
      />
    </div>
  );
}
