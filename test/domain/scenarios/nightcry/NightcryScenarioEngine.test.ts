/**
 * NightcryScenarioEngine のテスト
 */

import { describe, it, expect } from '@jest/globals';
import { NightcryScenarioEngine } from '@/domain/scenarios/nightcry/NightcryScenarioEngine';
import type { EngineState } from '@/domain/scenarios/nightcry/NightcryScenarioEngine';

describe('NightcryScenarioEngine', () => {
  describe('createInitialState', () => {
    it('初期状態を作成できる', () => {
      const state = NightcryScenarioEngine.createInitialState();

      expect(state.phase).toBe(1);
      expect(state.step).toBe('pages');
      expect(state.pageIndex).toBe(0);
      expect(state.selections).toEqual({
        phase1: null,
        phase2: null,
        phase3: null,
        phase4: null,
        phase5: null,
      });
      expect(state.completed).toBe(false);
    });
  });

  describe('getCurrentContent', () => {
    it('現在のフェーズのコンテンツを取得できる', () => {
      const state = NightcryScenarioEngine.createInitialState();
      const content = NightcryScenarioEngine.getCurrentContent(state);

      expect(content.phase).toBe(1);
      expect(content.pages.length).toBeGreaterThan(0);
    });
  });

  describe('getCurrentPage', () => {
    it('現在のページのテキストを取得できる', () => {
      const state = NightcryScenarioEngine.createInitialState();
      const page = NightcryScenarioEngine.getCurrentPage(state);

      expect(page).toBeDefined();
      expect(typeof page).toBe('string');
    });

    it('選択肢ステップでは質問テキストを取得できる', () => {
      let state = NightcryScenarioEngine.createInitialState();
      // ページを進めて選択肢ステップへ
      const content = NightcryScenarioEngine.getCurrentContent(state);
      for (let i = 0; i < content.pages.length; i++) {
        state = NightcryScenarioEngine.advancePage(state);
      }

      expect(state.step).toBe('choices');
      const page = NightcryScenarioEngine.getCurrentPage(state);
      expect(page).toBeDefined();
    });
  });

  describe('advancePage', () => {
    it('ページを1つ進められる', () => {
      const state = NightcryScenarioEngine.createInitialState();
      const newState = NightcryScenarioEngine.advancePage(state);

      expect(newState.pageIndex).toBe(1);
    });

    it('最後のページで進むと選択肢ステップに移行する', () => {
      let state = NightcryScenarioEngine.createInitialState();
      const content = NightcryScenarioEngine.getCurrentContent(state);

      // ページを最後まで進める
      for (let i = 0; i < content.pages.length; i++) {
        state = NightcryScenarioEngine.advancePage(state);
      }

      expect(state.step).toBe('choices');
      expect(state.pageIndex).toBe(0);
    });

    it('元の状態を変更しない（イミュータブル）', () => {
      const state = NightcryScenarioEngine.createInitialState();
      NightcryScenarioEngine.advancePage(state);

      expect(state.pageIndex).toBe(0);
    });
  });

  describe('selectChoice', () => {
    it('選択を記録できる', () => {
      let state = NightcryScenarioEngine.createInitialState();
      const content = NightcryScenarioEngine.getCurrentContent(state);

      // ページを進めて選択肢ステップへ
      for (let i = 0; i < content.pages.length; i++) {
        state = NightcryScenarioEngine.advancePage(state);
      }

      const newState = NightcryScenarioEngine.selectChoice(state, 'A');

      expect(newState.selections.phase1).toBe('A');
      expect(newState.step).toBe('response');
    });

    it('選択肢ステップ以外では選択を記録しない', () => {
      const state = NightcryScenarioEngine.createInitialState();
      const newState = NightcryScenarioEngine.selectChoice(state, 'A');

      expect(newState.selections.phase1).toBeNull();
      expect(newState).toBe(state); // 同じオブジェクト
    });
  });

  describe('advanceFromResponse', () => {
    it('レスポンスステップから締めテキストに進む', () => {
      let state = NightcryScenarioEngine.createInitialState();
      const content = NightcryScenarioEngine.getCurrentContent(state);

      // ページを進めて選択肢ステップへ
      for (let i = 0; i < content.pages.length; i++) {
        state = NightcryScenarioEngine.advancePage(state);
      }

      // 選択する
      state = NightcryScenarioEngine.selectChoice(state, 'A');
      expect(state.step).toBe('response');

      // レスポンスから進む
      state = NightcryScenarioEngine.advanceFromResponse(state);
      expect(state.step).toBe('closing');
    });
  });

  describe('advanceFromClosing', () => {
    it('締めテキストから次のフェーズに進む', () => {
      let state = NightcryScenarioEngine.createInitialState();
      const content = NightcryScenarioEngine.getCurrentContent(state);

      // ページを進めて選択肢ステップへ
      for (let i = 0; i < content.pages.length; i++) {
        state = NightcryScenarioEngine.advancePage(state);
      }

      // 選択する
      state = NightcryScenarioEngine.selectChoice(state, 'A');

      // レスポンスから進む
      state = NightcryScenarioEngine.advanceFromResponse(state);

      // 締めテキストから進む
      state = NightcryScenarioEngine.advanceFromClosing(state);

      expect(state.phase).toBe(2);
      expect(state.step).toBe('pages');
      expect(state.pageIndex).toBe(0);
    });

    it('フェーズ5の締めテキストから進むと完了状態になる', () => {
      const state: EngineState = {
        phase: 5,
        step: 'closing',
        pageIndex: 0,
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: 'C',
          phase4: 'A',
          phase5: 'B',
        },
        completed: false,
      };

      const newState = NightcryScenarioEngine.advanceFromClosing(state);

      expect(newState.completed).toBe(true);
    });
  });

  describe('getTimeOfDay', () => {
    it('フェーズ1はnightを返す', () => {
      const state = NightcryScenarioEngine.createInitialState();
      expect(NightcryScenarioEngine.getTimeOfDay(state)).toBe('night');
    });

    it('フェーズ3はdawnを返す', () => {
      const state: EngineState = {
        phase: 3,
        step: 'pages',
        pageIndex: 0,
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: null,
          phase4: null,
          phase5: null,
        },
        completed: false,
      };
      expect(NightcryScenarioEngine.getTimeOfDay(state)).toBe('dawn');
    });

    it('フェーズ4はdayを返す', () => {
      const state: EngineState = {
        phase: 4,
        step: 'pages',
        pageIndex: 0,
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: 'C',
          phase4: null,
          phase5: null,
        },
        completed: false,
      };
      expect(NightcryScenarioEngine.getTimeOfDay(state)).toBe('day');
    });
  });

  describe('shouldPlayAudio', () => {
    it('フェーズ1-3では音声再生が必要', () => {
      expect(NightcryScenarioEngine.shouldPlayAudio(1)).toBe(true);
      expect(NightcryScenarioEngine.shouldPlayAudio(2)).toBe(true);
      expect(NightcryScenarioEngine.shouldPlayAudio(3)).toBe(true);
    });

    it('フェーズ4-5では音声再生が不要', () => {
      expect(NightcryScenarioEngine.shouldPlayAudio(4)).toBe(false);
      expect(NightcryScenarioEngine.shouldPlayAudio(5)).toBe(false);
    });
  });

  describe('isCompleted', () => {
    it('completedがtrueの場合は完了と判定する', () => {
      const state: EngineState = {
        phase: 5,
        step: 'closing',
        pageIndex: 0,
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: 'C',
          phase4: 'A',
          phase5: 'B',
        },
        completed: true,
      };

      expect(NightcryScenarioEngine.isCompleted(state)).toBe(true);
    });

    it('completedがfalseの場合は未完了と判定する', () => {
      const state = NightcryScenarioEngine.createInitialState();
      expect(NightcryScenarioEngine.isCompleted(state)).toBe(false);
    });
  });

  describe('getChoices', () => {
    it('現在のフェーズの選択肢を取得できる', () => {
      const state = NightcryScenarioEngine.createInitialState();
      const choices = NightcryScenarioEngine.getChoices(state);

      expect(choices.length).toBe(3);
      expect(choices[0].id).toBe('A');
      expect(choices[1].id).toBe('B');
      expect(choices[2].id).toBe('C');
    });
  });

  describe('getResponseText', () => {
    it('選択に対するレスポンステキストを取得できる', () => {
      let state = NightcryScenarioEngine.createInitialState();
      const content = NightcryScenarioEngine.getCurrentContent(state);

      // ページを進めて選択肢ステップへ
      for (let i = 0; i < content.pages.length; i++) {
        state = NightcryScenarioEngine.advancePage(state);
      }

      // 選択する
      state = NightcryScenarioEngine.selectChoice(state, 'A');

      const responseText = NightcryScenarioEngine.getResponseText(state);
      expect(responseText).toBeDefined();
      expect(responseText.length).toBeGreaterThan(0);
    });
  });

  describe('getClosingPages', () => {
    it('締めテキストを取得できる', () => {
      const state = NightcryScenarioEngine.createInitialState();
      const closingPages = NightcryScenarioEngine.getClosingPages(state);

      expect(closingPages).toBeDefined();
      expect(closingPages.length).toBeGreaterThan(0);
    });
  });
});
