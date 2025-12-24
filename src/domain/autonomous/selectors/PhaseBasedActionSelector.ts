/**
 * フェーズに基づくアクション選択
 *
 * ゲームフェーズに応じて適切なアクションを選択します。
 */

import { GamePhase } from '@/domain/types';
import { AutonomousActionType } from '../AutonomousActionType';

export class PhaseBasedActionSelector {
  /**
   * フェーズに応じたアクションを選択
   * @param phase ゲームフェーズ
   * @returns 選択されたアクションタイプ
   */
  select(phase: GamePhase): AutonomousActionType {
    switch (phase) {
      case GamePhase.NIGHT_PREP:
        return AutonomousActionType.SLEEPING;
      case GamePhase.MIDNIGHT_EVENT:
        return AutonomousActionType.MEOWING;
      case GamePhase.MORNING_OUTRO:
        return AutonomousActionType.SITTING;
      case GamePhase.GAME_END:
        return AutonomousActionType.SITTING;
      default:
        return AutonomousActionType.SITTING;
    }
  }
}
