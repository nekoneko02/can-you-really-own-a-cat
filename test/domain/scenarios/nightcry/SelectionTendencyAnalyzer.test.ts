/**
 * SelectionTendencyAnalyzer のテスト
 */

import { describe, it, expect } from '@jest/globals';
import { SelectionTendencyAnalyzer } from '@/domain/scenarios/nightcry/SelectionTendencyAnalyzer';
import type { PhaseSelections } from '@/domain/scenarios/nightcry/NightcryScenarioState';

describe('SelectionTendencyAnalyzer', () => {
  describe('analyze', () => {
    describe('resilient（Aが3つ以上）', () => {
      it('Aが3つの場合、resilientと判定する', () => {
        const selections: PhaseSelections = {
          phase1: 'A',
          phase2: 'A',
          phase3: 'A',
          phase4: 'B',
          phase5: 'C',
        };

        const result = SelectionTendencyAnalyzer.analyze(selections);

        expect(result).toBe('resilient');
      });

      it('Aが5つの場合、resilientと判定する', () => {
        const selections: PhaseSelections = {
          phase1: 'A',
          phase2: 'A',
          phase3: 'A',
          phase4: 'A',
          phase5: 'A',
        };

        const result = SelectionTendencyAnalyzer.analyze(selections);

        expect(result).toBe('resilient');
      });
    });

    describe('struggling（Cが3つ以上）', () => {
      it('Cが3つの場合、strugglingと判定する', () => {
        const selections: PhaseSelections = {
          phase1: 'C',
          phase2: 'C',
          phase3: 'C',
          phase4: 'A',
          phase5: 'B',
        };

        const result = SelectionTendencyAnalyzer.analyze(selections);

        expect(result).toBe('struggling');
      });

      it('Cが5つの場合、strugglingと判定する', () => {
        const selections: PhaseSelections = {
          phase1: 'C',
          phase2: 'C',
          phase3: 'C',
          phase4: 'C',
          phase5: 'C',
        };

        const result = SelectionTendencyAnalyzer.analyze(selections);

        expect(result).toBe('struggling');
      });
    });

    describe('aware（Bが3つ以上）', () => {
      it('Bが3つの場合、awareと判定する', () => {
        const selections: PhaseSelections = {
          phase1: 'B',
          phase2: 'B',
          phase3: 'B',
          phase4: 'A',
          phase5: 'C',
        };

        const result = SelectionTendencyAnalyzer.analyze(selections);

        expect(result).toBe('aware');
      });

      it('Bが5つの場合、awareと判定する', () => {
        const selections: PhaseSelections = {
          phase1: 'B',
          phase2: 'B',
          phase3: 'B',
          phase4: 'B',
          phase5: 'B',
        };

        const result = SelectionTendencyAnalyzer.analyze(selections);

        expect(result).toBe('aware');
      });
    });

    describe('mixed（上記以外）', () => {
      it('A/B/Cがそれぞれ2つ以下の場合、mixedと判定する', () => {
        const selections: PhaseSelections = {
          phase1: 'A',
          phase2: 'B',
          phase3: 'C',
          phase4: 'A',
          phase5: 'B',
        };

        const result = SelectionTendencyAnalyzer.analyze(selections);

        expect(result).toBe('mixed');
      });

      it('A:2, B:2, C:1の場合、mixedと判定する', () => {
        const selections: PhaseSelections = {
          phase1: 'A',
          phase2: 'A',
          phase3: 'B',
          phase4: 'B',
          phase5: 'C',
        };

        const result = SelectionTendencyAnalyzer.analyze(selections);

        expect(result).toBe('mixed');
      });
    });

    describe('優先順位', () => {
      it('AとCが両方3つ以上の場合、resilientを優先する', () => {
        // 5フェーズなので両方3つ以上は不可能だが、念のためロジックを確認
        const selections: PhaseSelections = {
          phase1: 'A',
          phase2: 'A',
          phase3: 'A',
          phase4: 'C',
          phase5: 'C',
        };

        const result = SelectionTendencyAnalyzer.analyze(selections);

        expect(result).toBe('resilient');
      });
    });

    describe('未選択を含む場合', () => {
      it('一部がnullでも選択済みの傾向で判定する', () => {
        const selections: PhaseSelections = {
          phase1: 'A',
          phase2: 'A',
          phase3: 'A',
          phase4: null,
          phase5: null,
        };

        const result = SelectionTendencyAnalyzer.analyze(selections);

        expect(result).toBe('resilient');
      });

      it('すべてnullの場合、mixedと判定する', () => {
        const selections: PhaseSelections = {
          phase1: null,
          phase2: null,
          phase3: null,
          phase4: null,
          phase5: null,
        };

        const result = SelectionTendencyAnalyzer.analyze(selections);

        expect(result).toBe('mixed');
      });
    });
  });

  describe('countSelections', () => {
    it('各選択肢のカウントを取得できる', () => {
      const selections: PhaseSelections = {
        phase1: 'A',
        phase2: 'A',
        phase3: 'B',
        phase4: 'C',
        phase5: 'C',
      };

      const counts = SelectionTendencyAnalyzer.countSelections(selections);

      expect(counts.A).toBe(2);
      expect(counts.B).toBe(1);
      expect(counts.C).toBe(2);
    });

    it('nullはカウントしない', () => {
      const selections: PhaseSelections = {
        phase1: 'A',
        phase2: null,
        phase3: null,
        phase4: null,
        phase5: null,
      };

      const counts = SelectionTendencyAnalyzer.countSelections(selections);

      expect(counts.A).toBe(1);
      expect(counts.B).toBe(0);
      expect(counts.C).toBe(0);
    });
  });
});
