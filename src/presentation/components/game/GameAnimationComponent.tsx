'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { logDebug, logError, logInfo } from '@/lib/log';

/**
 * GameAnimationComponent
 *
 * 設計原則（シーケンス図準拠）:
 * - Phaserインスタンス管理
 * - GameAnimation (Phaser Scene) の初期化
 * - 背景画像と猫のイラストの表示のみ
 * - シナリオUIとは完全に独立
 */

interface GameAnimationComponentProps {
  onReady?: () => void;
  onError?: (error: string) => void;
}

export function GameAnimationComponent({ onReady, onError }: GameAnimationComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const isInitializedRef = useRef(false);

  useLayoutEffect(() => {
    let mounted = true;

    const initializePhaser = async () => {
      try {
        if (!containerRef.current) return;

        // React Strict Mode対策: 既に初期化済みの場合はスキップ
        if (isInitializedRef.current) {
          logDebug('GameAnimationComponent: Already initialized, skipping');
          return;
        }

        isInitializedRef.current = true;
        logInfo('GameAnimationComponent: Initializing Phaser');

        // GameAnimationScene を動的インポート
        const { default: GameAnimationScene } = await import('@/presentation/game/GameAnimationScene');

        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          width: 800,
          height: 300, // 上半分のみ
          parent: containerRef.current,
          backgroundColor: '#87CEEB',
          render: {
            antialias: true,
            pixelArt: false,
            transparent: false,
          },
          scene: GameAnimationScene,
        };

        phaserGameRef.current = new Phaser.Game(config);

        // Phaser初期化完了を待つ
        await new Promise<void>((resolve, reject) => {
          if (!phaserGameRef.current) {
            reject(new Error('Failed to create Phaser game'));
            return;
          }

          const timeoutId = setTimeout(() => {
            reject(new Error('Phaser initialization timeout'));
          }, 10000);

          phaserGameRef.current.events.once('ready', () => {
            clearTimeout(timeoutId);
            logInfo('GameAnimationComponent: Phaser ready');
            resolve();
          });
        });

        if (mounted && onReady) {
          onReady();
        }

        logInfo('GameAnimationComponent: Initialization completed');
      } catch (error) {
        logError('GameAnimationComponent: Failed to initialize', {
          error: error instanceof Error ? error.message : String(error)
        });

        if (mounted && onError) {
          onError('アニメーションの初期化に失敗しました');
        }

        isInitializedRef.current = false;
      }
    };

    initializePhaser();

    return () => {
      mounted = false;

      if (phaserGameRef.current) {
        logInfo('GameAnimationComponent: Destroying Phaser instance');
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ width: '800px', height: '300px' }}
    />
  );
}
