/**
 * PhaserActionのテスト
 */

import { PhaserAction } from '@/domain/PhaserAction';
import { ActionType, InteractionAction } from '@/domain/types';

describe('PhaserAction', () => {
  describe('constructor', () => {
    it('should create PhaserAction with MOVE_TO type', () => {
      const action = new PhaserAction({
        type: ActionType.MOVE_TO,
        targetObject: 'bed',
        requiredAction: InteractionAction.PICK_UP,
      });

      expect(action.type).toBe(ActionType.MOVE_TO);
      expect(action.targetObject).toBe('bed');
      expect(action.requiredAction).toBe(InteractionAction.PICK_UP);
    });

    it('should create PhaserAction with INTERACT_WITH type', () => {
      const action = new PhaserAction({
        type: ActionType.INTERACT_WITH,
        targetObject: 'cat',
        requiredAction: InteractionAction.CATCH,
      });

      expect(action.type).toBe(ActionType.INTERACT_WITH);
      expect(action.targetObject).toBe('cat');
      expect(action.requiredAction).toBe(InteractionAction.CATCH);
    });

    it('should create PhaserAction with WAIT type', () => {
      const action = new PhaserAction({
        type: ActionType.WAIT,
        targetObject: '',
        requiredAction: InteractionAction.PET,
      });

      expect(action.type).toBe(ActionType.WAIT);
    });
  });
});
