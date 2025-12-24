/**
 * PhaseBasedActionSelector のテスト
 */

import { PhaseBasedActionSelector } from '@/domain/autonomous/selectors/PhaseBasedActionSelector';
import { GamePhase } from '@/domain/types';
import { AutonomousActionType } from '@/domain/autonomous/AutonomousActionType';

describe('PhaseBasedActionSelector', () => {
  const selector = new PhaseBasedActionSelector();

  describe('select', () => {
    it('NIGHT_PREPフェーズではSLEEPINGを返す', () => {
      const result = selector.select(GamePhase.NIGHT_PREP);
      expect(result).toBe(AutonomousActionType.SLEEPING);
    });

    it('MIDNIGHT_EVENTフェーズではMEOWINGを返す', () => {
      const result = selector.select(GamePhase.MIDNIGHT_EVENT);
      expect(result).toBe(AutonomousActionType.MEOWING);
    });

    it('MORNING_OUTROフェーズではSITTINGを返す', () => {
      const result = selector.select(GamePhase.MORNING_OUTRO);
      expect(result).toBe(AutonomousActionType.SITTING);
    });

    it('GAME_ENDフェーズではSITTINGを返す', () => {
      const result = selector.select(GamePhase.GAME_END);
      expect(result).toBe(AutonomousActionType.SITTING);
    });
  });
});
