/**
 * NightcryStorage のテスト
 */

import { NightcryStorage } from '@/lib/storage/NightcryStorage';
import type { NightcryScenarioState } from '@/domain/scenarios/nightcry';

describe('NightcryStorage', () => {
  let storage: NightcryStorage;

  beforeEach(() => {
    // jsdom の localStorage をクリア
    localStorage.clear();
    storage = new NightcryStorage();
  });

  describe('saveScenarioState', () => {
    it('should save scenario state to localStorage', () => {
      const state: NightcryScenarioState = {
        currentPhase: 1,
        selections: {
          phase1: null,
          phase2: null,
          phase3: null,
          phase4: null,
          phase5: null,
        },
        completed: false,
      };

      storage.saveScenarioState(state);

      const saved = localStorage.getItem('nightcry_scenario_state');
      expect(saved).toBe(JSON.stringify(state));
    });

    it('should overwrite existing state', () => {
      const initialState: NightcryScenarioState = {
        currentPhase: 1,
        selections: {
          phase1: null,
          phase2: null,
          phase3: null,
          phase4: null,
          phase5: null,
        },
        completed: false,
      };

      const updatedState: NightcryScenarioState = {
        currentPhase: 2,
        selections: {
          phase1: 'A',
          phase2: null,
          phase3: null,
          phase4: null,
          phase5: null,
        },
        completed: false,
      };

      storage.saveScenarioState(initialState);
      storage.saveScenarioState(updatedState);

      const saved = localStorage.getItem('nightcry_scenario_state');
      expect(saved).toBe(JSON.stringify(updatedState));
    });
  });

  describe('loadScenarioState', () => {
    it('should return null when no state exists', () => {
      const result = storage.loadScenarioState();
      expect(result).toBeNull();
    });

    it('should return saved state', () => {
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

      storage.saveScenarioState(state);
      const result = storage.loadScenarioState();

      expect(result).toEqual(state);
    });

    it('should return null for invalid JSON', () => {
      localStorage.setItem('nightcry_scenario_state', 'invalid json');

      const result = storage.loadScenarioState();

      expect(result).toBeNull();
    });
  });

  describe('clearScenarioState', () => {
    it('should remove state from localStorage', () => {
      const state: NightcryScenarioState = {
        currentPhase: 1,
        selections: {
          phase1: null,
          phase2: null,
          phase3: null,
          phase4: null,
          phase5: null,
        },
        completed: false,
      };

      storage.saveScenarioState(state);
      storage.clearScenarioState();

      const result = localStorage.getItem('nightcry_scenario_state');
      expect(result).toBeNull();
    });
  });

  describe('hasScenarioState', () => {
    it('should return false when no state exists', () => {
      expect(storage.hasScenarioState()).toBe(false);
    });

    it('should return true when state exists', () => {
      const state: NightcryScenarioState = {
        currentPhase: 1,
        selections: {
          phase1: null,
          phase2: null,
          phase3: null,
          phase4: null,
          phase5: null,
        },
        completed: false,
      };

      storage.saveScenarioState(state);

      expect(storage.hasScenarioState()).toBe(true);
    });
  });

  describe('getInitialState', () => {
    it('should return initial scenario state', () => {
      const initial = NightcryStorage.getInitialState();

      expect(initial).toEqual({
        currentPhase: 1,
        selections: {
          phase1: null,
          phase2: null,
          phase3: null,
          phase4: null,
          phase5: null,
        },
        completed: false,
      });
    });
  });
});
