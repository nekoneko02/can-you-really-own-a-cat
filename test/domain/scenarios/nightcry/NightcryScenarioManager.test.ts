/**
 * NightcryScenarioManager のテスト
 */

import { describe, it, expect } from '@jest/globals';
import { NightcryScenarioManager } from '@/domain/scenarios/nightcry/NightcryScenarioManager';
import type { NightcryScenarioState } from '@/domain/scenarios/nightcry/NightcryScenarioState';

describe('NightcryScenarioManager', () => {
  describe('createInitialState', () => {
    it('初期状態を作成できる', () => {
      const state = NightcryScenarioManager.createInitialState();

      expect(state.currentPhase).toBe(1);
      expect(state.selections.phase1).toBeNull();
      expect(state.selections.phase2).toBeNull();
      expect(state.selections.phase3).toBeNull();
      expect(state.selections.phase4).toBeNull();
      expect(state.selections.phase5).toBeNull();
      expect(state.completed).toBe(false);
    });
  });

  describe('recordSelection', () => {
    it('フェーズ1の選択を記録できる', () => {
      const state = NightcryScenarioManager.createInitialState();

      const newState = NightcryScenarioManager.recordSelection(state, 1, 'A');

      expect(newState.selections.phase1).toBe('A');
      expect(newState.currentPhase).toBe(1); // フェーズはまだ進まない
    });

    it('フェーズ2の選択を記録できる', () => {
      let state = NightcryScenarioManager.createInitialState();
      state = NightcryScenarioManager.recordSelection(state, 1, 'B');
      state = NightcryScenarioManager.advancePhase(state);

      const newState = NightcryScenarioManager.recordSelection(state, 2, 'C');

      expect(newState.selections.phase2).toBe('C');
    });

    it('選択肢A/B/Cのいずれかを記録できる', () => {
      const state = NightcryScenarioManager.createInitialState();

      const stateA = NightcryScenarioManager.recordSelection(state, 1, 'A');
      const stateB = NightcryScenarioManager.recordSelection(state, 1, 'B');
      const stateC = NightcryScenarioManager.recordSelection(state, 1, 'C');

      expect(stateA.selections.phase1).toBe('A');
      expect(stateB.selections.phase1).toBe('B');
      expect(stateC.selections.phase1).toBe('C');
    });

    it('元の状態を変更しない（イミュータブル）', () => {
      const state = NightcryScenarioManager.createInitialState();

      NightcryScenarioManager.recordSelection(state, 1, 'A');

      expect(state.selections.phase1).toBeNull();
    });
  });

  describe('advancePhase', () => {
    it('フェーズ1から2に進められる', () => {
      let state = NightcryScenarioManager.createInitialState();
      state = NightcryScenarioManager.recordSelection(state, 1, 'A');

      const newState = NightcryScenarioManager.advancePhase(state);

      expect(newState.currentPhase).toBe(2);
    });

    it('フェーズ4から5に進められる', () => {
      let state: NightcryScenarioState = {
        currentPhase: 4,
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: 'C',
          phase4: 'A',
          phase5: null,
        },
        completed: false,
      };

      const newState = NightcryScenarioManager.advancePhase(state);

      expect(newState.currentPhase).toBe(5);
    });

    it('フェーズ5では進行できない（フェーズ5のまま）', () => {
      const state: NightcryScenarioState = {
        currentPhase: 5,
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: 'C',
          phase4: 'A',
          phase5: 'B',
        },
        completed: false,
      };

      const newState = NightcryScenarioManager.advancePhase(state);

      expect(newState.currentPhase).toBe(5);
    });

    it('元の状態を変更しない（イミュータブル）', () => {
      let state = NightcryScenarioManager.createInitialState();
      state = NightcryScenarioManager.recordSelection(state, 1, 'A');

      NightcryScenarioManager.advancePhase(state);

      expect(state.currentPhase).toBe(1);
    });
  });

  describe('completeScenario', () => {
    it('シナリオを完了状態にできる', () => {
      const state: NightcryScenarioState = {
        currentPhase: 5,
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: 'C',
          phase4: 'A',
          phase5: 'B',
        },
        completed: false,
      };

      const newState = NightcryScenarioManager.completeScenario(state);

      expect(newState.completed).toBe(true);
    });

    it('元の状態を変更しない（イミュータブル）', () => {
      const state: NightcryScenarioState = {
        currentPhase: 5,
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: 'C',
          phase4: 'A',
          phase5: 'B',
        },
        completed: false,
      };

      NightcryScenarioManager.completeScenario(state);

      expect(state.completed).toBe(false);
    });
  });

  describe('isCompleted', () => {
    it('completedがtrueの場合、完了と判定する', () => {
      const state: NightcryScenarioState = {
        currentPhase: 5,
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: 'C',
          phase4: 'A',
          phase5: 'B',
        },
        completed: true,
      };

      expect(NightcryScenarioManager.isCompleted(state)).toBe(true);
    });

    it('completedがfalseの場合、未完了と判定する', () => {
      const state: NightcryScenarioState = {
        currentPhase: 3,
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: null,
          phase4: null,
          phase5: null,
        },
        completed: false,
      };

      expect(NightcryScenarioManager.isCompleted(state)).toBe(false);
    });
  });

  describe('canAdvancePhase', () => {
    it('現在のフェーズで選択が記録されていれば進行可能', () => {
      let state = NightcryScenarioManager.createInitialState();
      state = NightcryScenarioManager.recordSelection(state, 1, 'A');

      expect(NightcryScenarioManager.canAdvancePhase(state)).toBe(true);
    });

    it('現在のフェーズで選択が記録されていなければ進行不可', () => {
      const state = NightcryScenarioManager.createInitialState();

      expect(NightcryScenarioManager.canAdvancePhase(state)).toBe(false);
    });

    it('フェーズ5では進行不可', () => {
      const state: NightcryScenarioState = {
        currentPhase: 5,
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: 'C',
          phase4: 'A',
          phase5: 'B',
        },
        completed: false,
      };

      expect(NightcryScenarioManager.canAdvancePhase(state)).toBe(false);
    });
  });

  describe('getSelectionForPhase', () => {
    it('指定フェーズの選択を取得できる', () => {
      const state: NightcryScenarioState = {
        currentPhase: 3,
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: null,
          phase4: null,
          phase5: null,
        },
        completed: false,
      };

      expect(NightcryScenarioManager.getSelectionForPhase(state, 1)).toBe('A');
      expect(NightcryScenarioManager.getSelectionForPhase(state, 2)).toBe('B');
      expect(NightcryScenarioManager.getSelectionForPhase(state, 3)).toBeNull();
    });
  });
});
