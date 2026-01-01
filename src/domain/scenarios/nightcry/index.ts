/**
 * 夜泣きシナリオ状態管理モジュール
 */

export type {
  PhaseNumber,
  PhaseSelection,
  PhaseSelections,
  NightcryScenarioState,
  SelectionTendency,
  NightcryReportData,
} from './NightcryScenarioState';

export { NightcryScenarioManager } from './NightcryScenarioManager';

export {
  SelectionTendencyAnalyzer,
  type SelectionCounts,
} from './SelectionTendencyAnalyzer';
