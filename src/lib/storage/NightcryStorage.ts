/**
 * 夜泣きシナリオのローカルストレージ操作
 */

import type { NightcryScenarioState } from '@/domain/scenarios/nightcry';

const STORAGE_KEY = 'nightcry_scenario_state';

/**
 * 夜泣きシナリオの状態をローカルストレージで管理するクラス
 */
export class NightcryStorage {
  /**
   * シナリオ状態を保存する
   */
  saveScenarioState(state: NightcryScenarioState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage が利用できない場合は無視
      console.warn('Failed to save scenario state to localStorage');
    }
  }

  /**
   * シナリオ状態を読み込む
   */
  loadScenarioState(): NightcryScenarioState | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return null;
      }
      return JSON.parse(data) as NightcryScenarioState;
    } catch {
      // パースエラーまたは localStorage が利用できない場合
      return null;
    }
  }

  /**
   * シナリオ状態をクリアする
   */
  clearScenarioState(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage が利用できない場合は無視
      console.warn('Failed to clear scenario state from localStorage');
    }
  }

  /**
   * シナリオ状態が存在するか確認する
   */
  hasScenarioState(): boolean {
    return this.loadScenarioState() !== null;
  }

  /**
   * 初期状態を取得する
   */
  static getInitialState(): NightcryScenarioState {
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
}
