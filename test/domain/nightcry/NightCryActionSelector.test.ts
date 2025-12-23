/**
 * NightCryActionSelector の単体テスト
 *
 * 状態遷移図に基づく選択可能アクションのテスト
 */

import { NightCryActionSelector } from '@/domain/nightcry/NightCryActionSelector';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';

describe('NightCryActionSelector', () => {
  let selector: NightCryActionSelector;

  beforeEach(() => {
    selector = new NightCryActionSelector();
  });

  describe('getAvailableActions', () => {
    describe('初期状態（currentAction = null）', () => {
      it('全ての初期選択肢を返す', () => {
        const actions = selector.getAvailableActions(null);

        expect(actions).toContain(NightCryActionType.PLAYING);
        expect(actions).toContain(NightCryActionType.PETTING);
        expect(actions).toContain(NightCryActionType.FEEDING_SNACK);
        expect(actions).toContain(NightCryActionType.IGNORING);
        expect(actions).toContain(NightCryActionType.CATCHING);
        expect(actions).toHaveLength(5);
      });
    });

    describe('PLAYING状態', () => {
      it('STOP_CAREのみを返す', () => {
        const actions = selector.getAvailableActions(NightCryActionType.PLAYING);

        expect(actions).toEqual([NightCryActionType.STOP_CARE]);
      });
    });

    describe('PETTING状態', () => {
      it('STOP_CAREのみを返す', () => {
        const actions = selector.getAvailableActions(NightCryActionType.PETTING);

        expect(actions).toEqual([NightCryActionType.STOP_CARE]);
      });
    });

    describe('LOCKED_OUT状態', () => {
      it('RETURN_CATのみを返す', () => {
        const actions = selector.getAvailableActions(NightCryActionType.LOCKED_OUT);

        expect(actions).toEqual([NightCryActionType.RETURN_CAT]);
      });
    });

    describe('STOP_CARE状態', () => {
      it('全ての初期選択肢を返す', () => {
        const actions = selector.getAvailableActions(NightCryActionType.STOP_CARE);

        expect(actions).toContain(NightCryActionType.PLAYING);
        expect(actions).toContain(NightCryActionType.PETTING);
        expect(actions).toContain(NightCryActionType.FEEDING_SNACK);
        expect(actions).toContain(NightCryActionType.IGNORING);
        expect(actions).toContain(NightCryActionType.CATCHING);
        expect(actions).toHaveLength(5);
      });
    });

    describe('RETURN_CAT状態', () => {
      it('全ての初期選択肢を返す', () => {
        const actions = selector.getAvailableActions(NightCryActionType.RETURN_CAT);

        expect(actions).toContain(NightCryActionType.PLAYING);
        expect(actions).toContain(NightCryActionType.PETTING);
        expect(actions).toContain(NightCryActionType.FEEDING_SNACK);
        expect(actions).toContain(NightCryActionType.IGNORING);
        expect(actions).toContain(NightCryActionType.CATCHING);
        expect(actions).toHaveLength(5);
      });
    });

    describe('IGNORING状態', () => {
      it('IGNORING以外の初期選択肢を返す', () => {
        const actions = selector.getAvailableActions(NightCryActionType.IGNORING);

        expect(actions).toContain(NightCryActionType.PLAYING);
        expect(actions).toContain(NightCryActionType.PETTING);
        expect(actions).toContain(NightCryActionType.FEEDING_SNACK);
        expect(actions).toContain(NightCryActionType.CATCHING);
        expect(actions).not.toContain(NightCryActionType.IGNORING);
        expect(actions).toHaveLength(4);
      });
    });

    describe('CATCHING状態', () => {
      it('空配列を返す（自動進行）', () => {
        const actions = selector.getAvailableActions(NightCryActionType.CATCHING);

        expect(actions).toEqual([]);
      });
    });

    describe('FEEDING_SNACK状態', () => {
      it('全ての初期選択肢を返す', () => {
        const actions = selector.getAvailableActions(NightCryActionType.FEEDING_SNACK);

        expect(actions).toContain(NightCryActionType.PLAYING);
        expect(actions).toContain(NightCryActionType.PETTING);
        expect(actions).toContain(NightCryActionType.FEEDING_SNACK);
        expect(actions).toContain(NightCryActionType.IGNORING);
        expect(actions).toContain(NightCryActionType.CATCHING);
        expect(actions).toHaveLength(5);
      });
    });
  });

  describe('配列の独立性', () => {
    it('返された配列を変更しても内部状態に影響しない', () => {
      const actions1 = selector.getAvailableActions(null);
      actions1.push(NightCryActionType.LOCKED_OUT);

      const actions2 = selector.getAvailableActions(null);
      expect(actions2).not.toContain(NightCryActionType.LOCKED_OUT);
      expect(actions2).toHaveLength(5);
    });
  });
});
