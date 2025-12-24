/**
 * Application層の型定義
 *
 * PhaserとDomainを仲介するためのインターフェース。
 */

import { Direction } from '@/domain/types';
import { GamePhase, CatState, CatMood } from '@/domain/types';
import { GameEvent } from '@/domain/GameEvent';
import { EventStep } from '@/domain/EventStep';
import { CatStatus } from '@/domain/CatStatus';
import { PlayerStats } from '@/domain/PlayerStats';
import { EmotionData } from '@/domain/EventRecord';

/**
 * Phaserからの入力データ
 */
export interface PlayerInput {
  direction?: Direction;
  interact?: boolean;
  choice?: string;
  emotion?: EmotionData;
}

/**
 * Phaserへの描画データ（ViewModel）
 */
export interface PlayerViewModel {
  x: number;
  y: number;
  animation: string;
  hasToy: boolean;
}

export interface CatViewModel {
  name: string;
  x: number;
  y: number;
  state: CatState;
  mood: CatMood;
  animation: string;
  isVisible: boolean;
}

export interface GameView {
  phase: GamePhase;
  time: number;
  day: number;
  player: PlayerViewModel;
  cat: CatViewModel;
  currentEvent: GameEvent | null;
  /** @deprecated 旧EventScenarioシステムは廃止されました */
  currentScenario: null;
  currentScenarioStep: EventStep | null;
  catStatus: CatStatus;
  playerStats: PlayerStats;
  isWaitingForEmotionInput: boolean;
}
