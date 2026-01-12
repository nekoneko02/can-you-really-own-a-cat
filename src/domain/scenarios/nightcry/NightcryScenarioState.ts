/**
 * 夜泣きシナリオの状態管理に関する型定義
 */

/** フェーズ番号（1〜5） */
export type PhaseNumber = 1 | 2 | 3 | 4 | 5;

/** 選択肢の型（A/B/C または未選択） */
export type PhaseSelection = 'A' | 'B' | 'C' | null;

/** 各フェーズの選択記録 */
export interface PhaseSelections {
  phase1: PhaseSelection;
  phase2: PhaseSelection;
  phase3: PhaseSelection;
  phase4: PhaseSelection;
  phase5: PhaseSelection;
}

/** シナリオ状態 */
export interface NightcryScenarioState {
  currentPhase: PhaseNumber;
  selections: PhaseSelections;
  completed: boolean;
}

/** レポート用データ */
export interface NightcryReportData {
  selections: PhaseSelections;
}
