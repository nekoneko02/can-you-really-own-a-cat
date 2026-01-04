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

export {
  NightcryScenarioContent,
  getPhaseContent,
  getChoiceResponse,
  getClosingText,
  type ScenarioChoice,
  type PhaseContent,
} from './NightcryScenarioContent';

export {
  NightcryScenarioEngine,
  type EngineStep,
  type EngineState,
} from './NightcryScenarioEngine';
