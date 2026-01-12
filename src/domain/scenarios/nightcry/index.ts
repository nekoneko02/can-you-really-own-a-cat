/**
 * 夜泣きシナリオ状態管理モジュール
 */

export type {
  PhaseNumber,
  PhaseSelection,
  PhaseSelections,
  NightcryScenarioState,
  NightcryReportData,
} from './NightcryScenarioState';

export { NightcryScenarioManager } from './NightcryScenarioManager';

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

export {
  ReportGenerator,
  type UserChoiceDisplay,
  type ReportHeader,
  type ReportStatistics,
  type ReportExperienceSummary,
  type ReportPerspectives,
  type ReportClosing,
  type ReportContent,
} from './ReportGenerator';
