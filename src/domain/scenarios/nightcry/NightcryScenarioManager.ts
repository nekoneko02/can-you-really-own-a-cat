/**
 * 夜泣きシナリオの状態遷移を管理するクラス
 *
 * 5フェーズのシナリオ進行と選択の記録を管理します。
 * すべてのメソッドは純粋関数として実装され、イミュータブルな状態管理を行います。
 */

import type {
  NightcryScenarioState,
  PhaseNumber,
  PhaseSelection,
} from './NightcryScenarioState';

export class NightcryScenarioManager {
  /**
   * 初期状態を作成
   */
  static createInitialState(): NightcryScenarioState {
    return {
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
  }

  /**
   * 指定フェーズに選択を記録
   * @param state 現在の状態
   * @param phase 記録するフェーズ
   * @param selection 選択肢（A/B/C）
   * @returns 新しい状態
   */
  static recordSelection(
    state: NightcryScenarioState,
    phase: PhaseNumber,
    selection: PhaseSelection
  ): NightcryScenarioState {
    const phaseKey = `phase${phase}` as keyof NightcryScenarioState['selections'];

    return {
      ...state,
      selections: {
        ...state.selections,
        [phaseKey]: selection,
      },
    };
  }

  /**
   * 次のフェーズに進行
   * @param state 現在の状態
   * @returns 新しい状態
   */
  static advancePhase(state: NightcryScenarioState): NightcryScenarioState {
    if (state.currentPhase >= 5) {
      return state;
    }

    return {
      ...state,
      currentPhase: (state.currentPhase + 1) as PhaseNumber,
    };
  }

  /**
   * シナリオを完了状態にする
   * @param state 現在の状態
   * @returns 新しい状態
   */
  static completeScenario(
    state: NightcryScenarioState
  ): NightcryScenarioState {
    return {
      ...state,
      completed: true,
    };
  }

  /**
   * シナリオが完了しているか判定
   * @param state 現在の状態
   * @returns 完了していればtrue
   */
  static isCompleted(state: NightcryScenarioState): boolean {
    return state.completed;
  }

  /**
   * 次のフェーズに進行可能か判定
   * @param state 現在の状態
   * @returns 進行可能ならtrue
   */
  static canAdvancePhase(state: NightcryScenarioState): boolean {
    if (state.currentPhase >= 5) {
      return false;
    }

    const currentSelection = this.getSelectionForPhase(
      state,
      state.currentPhase
    );
    return currentSelection !== null;
  }

  /**
   * 指定フェーズの選択を取得
   * @param state 現在の状態
   * @param phase フェーズ番号
   * @returns 選択肢（未選択の場合はnull）
   */
  static getSelectionForPhase(
    state: NightcryScenarioState,
    phase: PhaseNumber
  ): PhaseSelection {
    const phaseKey = `phase${phase}` as keyof NightcryScenarioState['selections'];
    return state.selections[phaseKey];
  }
}
