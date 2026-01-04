/**
 * 夜泣きシナリオの進行ロジック
 *
 * シナリオの状態遷移を管理します。
 * すべてのメソッドは純粋関数として実装され、イミュータブルな状態管理を行います。
 */

import type {
  PhaseNumber,
  PhaseSelection,
  PhaseSelections,
} from './NightcryScenarioState';
import type { TimeOfDay } from '@/components/scenario/SceneBackground';
import {
  getPhaseContent,
  getChoiceResponse,
  getClosingText,
  type ScenarioChoice,
  type PhaseContent,
} from './NightcryScenarioContent';

/** ステップの型 */
export type EngineStep = 'pages' | 'choices' | 'response' | 'closing';

/** エンジン状態の型 */
export interface EngineState {
  phase: PhaseNumber;
  step: EngineStep;
  pageIndex: number;
  selections: PhaseSelections;
  completed: boolean;
}

/**
 * 夜泣きシナリオエンジン
 */
export class NightcryScenarioEngine {
  /**
   * 初期状態を作成
   */
  static createInitialState(): EngineState {
    return {
      phase: 1,
      step: 'pages',
      pageIndex: 0,
      selections: {
        phase1: null,
        phase2: null,
        phase3: null,
        phase4: null,
        phase5: null,
      },
      completed: false,
    };
  }

  /**
   * 現在のフェーズのコンテンツを取得
   */
  static getCurrentContent(state: EngineState): PhaseContent {
    return getPhaseContent(state.phase);
  }

  /**
   * 現在のページのテキストを取得
   */
  static getCurrentPage(state: EngineState): string {
    const content = this.getCurrentContent(state);

    switch (state.step) {
      case 'pages':
        return content.pages[state.pageIndex] ?? '';
      case 'choices':
        return content.questionText;
      case 'response':
        return this.getResponseText(state);
      case 'closing':
        return content.closingPages[state.pageIndex] ?? '';
      default:
        return '';
    }
  }

  /**
   * ページを1つ進める
   */
  static advancePage(state: EngineState): EngineState {
    const content = this.getCurrentContent(state);

    if (state.step === 'pages') {
      const nextIndex = state.pageIndex + 1;
      if (nextIndex >= content.pages.length) {
        // ページが終わったら選択肢ステップへ
        return {
          ...state,
          step: 'choices',
          pageIndex: 0,
        };
      }
      return {
        ...state,
        pageIndex: nextIndex,
      };
    }

    if (state.step === 'closing') {
      const nextIndex = state.pageIndex + 1;
      if (nextIndex >= content.closingPages.length) {
        // 締めが終わったら次のフェーズへ
        return this.advanceToNextPhase(state);
      }
      return {
        ...state,
        pageIndex: nextIndex,
      };
    }

    return state;
  }

  /**
   * 選択を記録
   */
  static selectChoice(
    state: EngineState,
    selection: 'A' | 'B' | 'C'
  ): EngineState {
    if (state.step !== 'choices') {
      return state;
    }

    const phaseKey =
      `phase${state.phase}` as keyof EngineState['selections'];

    return {
      ...state,
      step: 'response',
      selections: {
        ...state.selections,
        [phaseKey]: selection,
      },
    };
  }

  /**
   * レスポンスステップから進む
   */
  static advanceFromResponse(state: EngineState): EngineState {
    if (state.step !== 'response') {
      return state;
    }

    const content = this.getCurrentContent(state);

    // 締めテキストがあれば締めステップへ、なければ次のフェーズへ
    if (content.closingPages.length > 0) {
      return {
        ...state,
        step: 'closing',
        pageIndex: 0,
      };
    }

    return this.advanceToNextPhase(state);
  }

  /**
   * 締めステップから進む
   */
  static advanceFromClosing(state: EngineState): EngineState {
    if (state.step !== 'closing') {
      return state;
    }

    return this.advanceToNextPhase(state);
  }

  /**
   * 次のフェーズに進む
   */
  private static advanceToNextPhase(state: EngineState): EngineState {
    if (state.phase >= 5) {
      // フェーズ5の場合は完了状態にする
      return {
        ...state,
        completed: true,
      };
    }

    return {
      ...state,
      phase: (state.phase + 1) as PhaseNumber,
      step: 'pages',
      pageIndex: 0,
    };
  }

  /**
   * 現在の時間帯を取得
   */
  static getTimeOfDay(state: EngineState): TimeOfDay {
    const content = this.getCurrentContent(state);
    return content.timeOfDay;
  }

  /**
   * 音声再生が必要かどうか
   */
  static shouldPlayAudio(phase: PhaseNumber): boolean {
    const content = getPhaseContent(phase);
    return content.hasAudio;
  }

  /**
   * シナリオが完了しているか
   */
  static isCompleted(state: EngineState): boolean {
    return state.completed;
  }

  /**
   * 現在のフェーズの選択肢を取得
   */
  static getChoices(state: EngineState): ScenarioChoice[] {
    const content = this.getCurrentContent(state);
    return content.choices;
  }

  /**
   * 選択に対するレスポンステキストを取得
   */
  static getResponseText(state: EngineState): string {
    const phaseKey =
      `phase${state.phase}` as keyof EngineState['selections'];
    const selection = state.selections[phaseKey];

    if (!selection) {
      return '';
    }

    return getChoiceResponse(state.phase, selection);
  }

  /**
   * 締めテキストを取得
   */
  static getClosingPages(state: EngineState): string[] {
    return getClosingText(state.phase);
  }
}
