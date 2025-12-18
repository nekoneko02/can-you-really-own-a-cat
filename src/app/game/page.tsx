'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameResult } from '@/phaser/bridge/types';

export default function GamePage() {
  const router = useRouter();
  const gameRef = useRef<any>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // window.onGameCompleteコールバックを設定
    (window as any).onGameComplete = (result: GameResult) => {
      console.log('ゲーム結果を受信:', result);
      setGameResult(result);
      // ゲーム結果をlocalStorageに保存
      localStorage.setItem('gameResult', JSON.stringify(result));
      // レポートページに遷移
      router.push('/report');
    };

    // Phaserを動的にインポートして初期化
    const initializeGame = async () => {
      try {
        const Phaser = await import('phaser');
        const { gameConfig } = await import('@/phaser/config');
        const { BootScene } = await import('@/phaser/scenes/BootScene');

        if (!gameRef.current) {
          const config = {
            ...gameConfig,
            scene: [BootScene],
          };
          gameRef.current = new Phaser.Game(config);

          // BootSceneにscenarioIdを渡す
          gameRef.current.scene.start('BootScene', {
            scenarioId: 'night_crying',
          });

          setIsLoading(false);
        }
      } catch (error) {
        console.error('Phaserの初期化に失敗しました:', error);
        setIsLoading(false);
      }
    };

    initializeGame();

    // クリーンアップ
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      delete (window as any).onGameComplete;
    };
  }, []);

  // ゲーム結果を表示
  if (gameResult) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>ゲーム結果</h1>
        <div style={{ marginTop: '20px' }}>
          <h2>プレイヤー統計</h2>
          <p>総睡眠時間: {gameResult.playerStats.totalSleepTime}時間</p>
          <p>起こされた回数: {gameResult.playerStats.interruptedCount}回</p>
          <p>遊んだ回数: {gameResult.playerStats.playedCount}回</p>
          <p>撫でた回数: {gameResult.playerStats.pettedCount}回</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h2>猫の最終状態</h2>
          <p>なつき度: {gameResult.finalCatStatus.affection}</p>
          <p>ストレス: {gameResult.finalCatStatus.stress}</p>
          <p>健康度: {gameResult.finalCatStatus.health}</p>
          <p>空腹度: {gameResult.finalCatStatus.hunger}</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h2>レポート</h2>
          <p>{gameResult.report.summary}</p>
          {gameResult.report.strengths.length > 0 && (
            <div>
              <h3>得意だったこと</h3>
              <ul>
                {gameResult.report.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
          {gameResult.report.weaknesses.length > 0 && (
            <div>
              <h3>苦手だったこと</h3>
              <ul>
                {gameResult.report.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div style={{ marginTop: '20px' }}>
          <h2>イベント履歴</h2>
          {gameResult.eventHistory.length > 0 ? (
            <ul>
              {gameResult.eventHistory.map((event, index) => (
                <li key={index}>
                  Day {event.day} ({event.time}時) - {event.resultText}
                </li>
              ))}
            </ul>
          ) : (
            <p>イベント履歴はありません</p>
          )}
        </div>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={async () => {
              setGameResult(null);
              if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
              }
              setIsLoading(true);

              // Phaserを再初期化
              const Phaser = await import('phaser');
              const { gameConfig } = await import('@/phaser/config');
              const { BootScene } = await import('@/phaser/scenes/BootScene');

              const config = {
                ...gameConfig,
                scene: [BootScene],
              };
              gameRef.current = new Phaser.Game(config);
              gameRef.current.scene.start('BootScene', {
                scenarioId: 'night_crying',
              });
              setIsLoading(false);
            }}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            もう一度プレイ
          </button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>詳細データ（JSON）</h3>
          <pre style={{ background: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(gameResult, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
        猫飼育シミュレーション
      </h1>
      {isLoading && (
        <p style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
          ゲームを読み込んでいます...
        </p>
      )}
      <div id="phaser-game" />
    </div>
  );
}
