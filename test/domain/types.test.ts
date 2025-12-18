/**
 * Domain層の型定義のテスト
 */

import {
  GamePhase,
  TimeOfDay,
  CatState,
  CatMood,
  ToyType,
  Direction,
  ActionType,
  InteractionAction,
} from '@/domain/types';

describe('Domain Types', () => {
  describe('GamePhase', () => {
    it('should have all required phases', () => {
      expect(GamePhase.NIGHT_PREP).toBe('NIGHT_PREP');
      expect(GamePhase.MIDNIGHT_EVENT).toBe('MIDNIGHT_EVENT');
      expect(GamePhase.MORNING_OUTRO).toBe('MORNING_OUTRO');
      expect(GamePhase.GAME_END).toBe('GAME_END');
    });
  });

  describe('TimeOfDay', () => {
    it('should have all required time periods', () => {
      expect(TimeOfDay.NIGHT).toBe('NIGHT');
      expect(TimeOfDay.MIDNIGHT).toBe('MIDNIGHT');
      expect(TimeOfDay.MORNING).toBe('MORNING');
    });
  });

  describe('CatState', () => {
    it('should have all required states', () => {
      expect(CatState.SLEEPING).toBe('SLEEPING');
      expect(CatState.SITTING).toBe('SITTING');
      expect(CatState.STANDING).toBe('STANDING');
      expect(CatState.WALKING).toBe('WALKING');
      expect(CatState.RUNNING).toBe('RUNNING');
      expect(CatState.MEOWING).toBe('MEOWING');
      expect(CatState.PLAYING).toBe('PLAYING');
    });
  });

  describe('CatMood', () => {
    it('should have all required moods', () => {
      expect(CatMood.NEUTRAL).toBe('NEUTRAL');
      expect(CatMood.HAPPY).toBe('HAPPY');
      expect(CatMood.ANGRY).toBe('ANGRY');
      expect(CatMood.SCARED).toBe('SCARED');
      expect(CatMood.SLEEPY).toBe('SLEEPY');
    });
  });

  describe('ToyType', () => {
    it('should have all required toy types', () => {
      expect(ToyType.BALL).toBe('BALL');
      expect(ToyType.MOUSE).toBe('MOUSE');
      expect(ToyType.FEATHER).toBe('FEATHER');
    });
  });

  describe('Direction', () => {
    it('should have all required directions', () => {
      expect(Direction.UP).toBe('UP');
      expect(Direction.DOWN).toBe('DOWN');
      expect(Direction.LEFT).toBe('LEFT');
      expect(Direction.RIGHT).toBe('RIGHT');
      expect(Direction.NONE).toBe('NONE');
    });
  });

  describe('ActionType', () => {
    it('should have all required action types', () => {
      expect(ActionType.MOVE_TO).toBe('MOVE_TO');
      expect(ActionType.INTERACT_WITH).toBe('INTERACT_WITH');
      expect(ActionType.WAIT).toBe('WAIT');
    });
  });

  describe('InteractionAction', () => {
    it('should have all required interaction actions', () => {
      expect(InteractionAction.CATCH).toBe('CATCH');
      expect(InteractionAction.PET).toBe('PET');
      expect(InteractionAction.PICK_UP).toBe('PICK_UP');
      expect(InteractionAction.PLAY).toBe('PLAY');
    });
  });
});
