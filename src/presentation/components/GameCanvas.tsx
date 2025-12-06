'use client';

import { useState } from 'react';
import { GameAnimationComponent } from './game/GameAnimationComponent';
import { ScenarioUI } from './game/ScenarioUI';
import { logInfo } from '@/lib/log';

/**
 * GameCanvas
 *
 * 設計原則（シーケンス図準拠）:
 * - 上半分: GameAnimationComponent（背景・猫）
 * - 下半分: シナリオUI（イベント表示・選択肢・結果）
 * - 2つのコンポーネントは独立
 */

interface GameCanvasProps {
  scenarioId: string;
  onGameEnd?: () => void;
  onError?: (error: string) => void;
}

export default function GameCanvas({
  scenarioId,
  onGameEnd,
  onError
}: GameCanvasProps) {
  logInfo('GameCanvas: Component render', {
    scenarioId
  });

  const [animationReady, setAnimationReady] = useState(false);
  const [animationError, setAnimationError] = useState<string | null>(null);

  const handleAnimationReady = () => {
    logInfo('GameCanvas: Animation ready');
    setAnimationReady(true);
  };

  const handleAnimationError = (error: string) => {
    logInfo('GameCanvas: Animation error', { error });
    setAnimationError(error);
    if (onError) {
      onError(error);
    }
  };

  const handleGameEnd = () => {
    logInfo('GameCanvas: Game ended');
    if (onGameEnd) {
      onGameEnd();
    }
  };

  return (
    <div className="w-[800px] h-[600px] border-2 border-gray-300 rounded-lg shadow-lg bg-white relative flex flex-col">
      {/* 上半分: GameAnimationComponent (Phaser) */}
      <div className="w-full h-[300px] bg-sky-100">
        <GameAnimationComponent
          onReady={handleAnimationReady}
          onError={handleAnimationError}
        />
      </div>

      {/* 下半分: ScenarioUI (React) */}
      <div className="w-full h-[300px] bg-gray-50 overflow-y-auto">
        {animationError && (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-600 text-center">
              <div className="mb-2">⚠️ エラー</div>
              <div className="text-sm">{animationError}</div>
            </div>
          </div>
        )}
        {!animationError && !animationReady && (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-600">読み込み中...</div>
          </div>
        )}
        {!animationError && animationReady && (
          <ScenarioUI
            scenarioId={scenarioId}
            onGameEnd={handleGameEnd}
          />
        )}
      </div>
    </div>
  );
}