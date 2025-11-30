'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { PhaserGame } from '@/types/game';
import { Cat } from '@/domain/cat';
import { GameSession, Scenario } from '@/domain/game';
import { GameManager } from '@/lib/GameManager';
import { logDebug, logError, logInfo } from '@/lib/log';

interface GameCanvasProps {
  cat: Cat;
  scenario: Scenario;
  session: GameSession;
  onGameReady?: (game: PhaserGame, gameManager: GameManager) => void;
  onGameEnd?: () => Promise<void>;
  onEventComplete?: (eventIndex: number) => Promise<void>;
  onError?: (error: string) => void;
}

export default function GameCanvas({
  cat,
  scenario,
  session,
  onGameReady,
  onGameEnd,
  onEventComplete,
  onError
}: GameCanvasProps) {
  logInfo('GameCanvas: Component render', {
    hasCat: !!cat,
    hasScenario: !!scenario,
    hasSession: !!session
  });

  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<PhaserGame | null>(null);
  const gameManagerRef = useRef<GameManager | null>(null);
  const isInitializedRef = useRef(false);
  const initPromiseRef = useRef<Promise<void> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  logInfo('GameCanvas: Render state', { isLoaded, loadError });

  useLayoutEffect(() => {
    logInfo('GameCanvas: useLayoutEffect triggered', {
      hasCat: !!cat,
      hasScenario: !!scenario,
      hasSession: !!session
    });
    let mounted = true;

    const initializeGame = async () => {
      try {
        if (!gameRef.current) return;

        // React Strict Mode対策: 既に初期化済みの場合はスキップ
        if (isInitializedRef.current) {
          logDebug('GameCanvas: Already initialized, skipping');
          return;
        }

        isInitializedRef.current = true;

        gameManagerRef.current = new GameManager();
        logDebug('GameCanvas: Created new GameManager instance');

        logInfo('GameCanvas: Initializing game with scenario', {
          scenarioId: scenario.id,
          sessionId: session.id,
          turn: session.currentTurn
        });

        const gameConfig = {
          cat: cat,
          scenario: scenario,
          session: session,
          onGameEnd: onGameEnd,
          onEventComplete: onEventComplete
        };

        const success = await gameManagerRef.current.startGame(
          gameRef.current,
          gameConfig,
          {
            onGameReady: (game) => {
              logInfo('GameCanvas: onGameReady callback called', { mounted });
              if (mounted) {
                logInfo('GameCanvas: Setting isLoaded to true');
                phaserGameRef.current = game;
                setIsLoaded(true);
                setLoadError(null);
                if (onGameReady && gameManagerRef.current) {
                  onGameReady(game, gameManagerRef.current);
                }
              } else {
                logInfo('GameCanvas: onGameReady called but mounted is false');
              }
            },
            onStateChange: (state) => {
              if (state === 'error') {
                setLoadError('ゲームの初期化に失敗しました。');
              }
            }
          }
        );

        if (!success) {
          setLoadError('ゲームの開始に失敗しました。');
        }
      } catch (error) {
        logError('Failed to initialize game', { error: error instanceof Error ? error.message : String(error) });
        if (mounted) {
          setLoadError('ゲームの初期化に失敗しました。ページを再読み込みしてください。');
        }
        // エラー時は初期化フラグをリセット（再試行可能にする）
        isInitializedRef.current = false;
      }
    };

    // 初期化 Promise を保存
    initPromiseRef.current = initializeGame();

    return () => {
      logInfo('GameCanvas: useLayoutEffect cleanup triggered');
      mounted = false;

      // 初期化が完了するまで待ってから cleanup を実行
      const cleanup = async () => {
        if (initPromiseRef.current) {
          try {
            await initPromiseRef.current;
          } catch (e) {
            // 初期化エラーは無視（既にハンドリング済み）
          }
        }

        if (gameManagerRef.current) {
          gameManagerRef.current.destroy();
          gameManagerRef.current = null;
        }
        if (phaserGameRef.current) {
          phaserGameRef.current = null;
        }
      };

      cleanup();
    };
  }, [cat, scenario, session]);

  return (
    <div ref={gameRef} className="w-[800px] h-[600px] border-2 border-gray-300 rounded-lg shadow-lg bg-sky-100 relative">
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-sky-100/80 z-10">
          <div className="text-gray-600">ゲームを読み込んでいます...</div>
        </div>
      )}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <div className="text-red-600 text-center">
            <div className="mb-4 text-2xl">⚠️ エラー</div>
            <div>{loadError}</div>
          </div>
        </div>
      )}
    </div>
  );
}