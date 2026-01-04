/**
 * NightcryScenarioContent のテスト
 */

import { describe, it, expect } from '@jest/globals';
import {
  NightcryScenarioContent,
  getPhaseContent,
  getChoiceResponse,
  getClosingText,
} from '@/domain/scenarios/nightcry/NightcryScenarioContent';
import type { PhaseNumber, PhaseSelection } from '@/domain/scenarios/nightcry/NightcryScenarioState';

describe('NightcryScenarioContent', () => {
  describe('getPhaseContent', () => {
    it('フェーズ1のコンテンツを取得できる', () => {
      const content = getPhaseContent(1);

      expect(content.phase).toBe(1);
      expect(content.theme).toBeDefined();
      expect(content.hasAudio).toBe(true);
      expect(content.timeOfDay).toBe('night');
      expect(content.pages.length).toBeGreaterThan(0);
      expect(content.questionText).toBeDefined();
      expect(content.choices.length).toBe(3);
    });

    it('フェーズ2のコンテンツを取得できる', () => {
      const content = getPhaseContent(2);

      expect(content.phase).toBe(2);
      expect(content.hasAudio).toBe(true);
      expect(content.timeOfDay).toBe('night');
    });

    it('フェーズ3のコンテンツを取得できる', () => {
      const content = getPhaseContent(3);

      expect(content.phase).toBe(3);
      expect(content.hasAudio).toBe(true);
      expect(content.timeOfDay).toBe('dawn');
    });

    it('フェーズ4のコンテンツを取得できる', () => {
      const content = getPhaseContent(4);

      expect(content.phase).toBe(4);
      expect(content.hasAudio).toBe(false);
      expect(content.timeOfDay).toBe('day');
    });

    it('フェーズ5のコンテンツを取得できる', () => {
      const content = getPhaseContent(5);

      expect(content.phase).toBe(5);
      expect(content.hasAudio).toBe(false);
      expect(content.timeOfDay).toBe('night');
    });

    it('各フェーズには3つの選択肢がある', () => {
      const phases: PhaseNumber[] = [1, 2, 3, 4, 5];
      phases.forEach((phase) => {
        const content = getPhaseContent(phase);
        expect(content.choices.length).toBe(3);
        expect(content.choices.map((c) => c.id)).toEqual(['A', 'B', 'C']);
      });
    });
  });

  describe('getChoiceResponse', () => {
    it('フェーズ1の選択Aに対するレスポンスを取得できる', () => {
      const response = getChoiceResponse(1, 'A');
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(0);
    });

    it('フェーズ1の選択Bに対するレスポンスを取得できる', () => {
      const response = getChoiceResponse(1, 'B');
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(0);
    });

    it('フェーズ1の選択Cに対するレスポンスを取得できる', () => {
      const response = getChoiceResponse(1, 'C');
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(0);
    });

    it('全フェーズの全選択肢に対するレスポンスがある', () => {
      const phases: PhaseNumber[] = [1, 2, 3, 4, 5];
      const selections: PhaseSelection[] = ['A', 'B', 'C'];

      phases.forEach((phase) => {
        selections.forEach((selection) => {
          if (selection !== null) {
            const response = getChoiceResponse(phase, selection);
            expect(response).toBeDefined();
          }
        });
      });
    });
  });

  describe('getClosingText', () => {
    it('フェーズ1の締めテキストを取得できる', () => {
      const closingText = getClosingText(1);
      expect(closingText).toBeDefined();
      expect(closingText.length).toBeGreaterThan(0);
    });

    it('各フェーズに締めテキストがある', () => {
      const phases: PhaseNumber[] = [1, 2, 3, 4, 5];
      phases.forEach((phase) => {
        const closingText = getClosingText(phase);
        expect(closingText).toBeDefined();
      });
    });
  });

  describe('NightcryScenarioContent object', () => {
    it('全5フェーズのコンテンツが定義されている', () => {
      expect(Object.keys(NightcryScenarioContent.phases).length).toBe(5);
    });
  });
});
