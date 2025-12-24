/**
 * 自律的振る舞いモジュール
 *
 * 猫の自律的な振る舞いに関するクラスをエクスポートします。
 */

// Types
export { AutonomousActionType } from './AutonomousActionType';
export type { AutonomousActionType as AutonomousActionTypeType } from './AutonomousActionType';
export {
  DEFAULT_MEOWING_DURATION,
  createInitialAutonomousBehaviorState,
} from './AutonomousBehaviorState';
export type { AutonomousBehaviorState } from './AutonomousBehaviorState';
export type { AutonomousAction } from './AutonomousAction';

// Config
export { AutonomousActionConfig } from './AutonomousActionConfig';

// Manager
export { AutonomousBehaviorManager } from './AutonomousBehaviorManager';

// Actions
export { SleepingAction } from './actions/SleepingAction';
export { SittingAction } from './actions/SittingAction';
export { WanderingAction } from './actions/WanderingAction';
export { MeowingAction } from './actions/MeowingAction';
export { IdlePlayingAction } from './actions/IdlePlayingAction';
export { BeingPettedAction } from './actions/BeingPettedAction';
export { FleeingAction } from './actions/FleeingAction';
export { WaitingAfterCareAction } from './actions/WaitingAfterCareAction';
export { LockedOutAction } from './actions/LockedOutAction';

// Selectors
export { PhaseBasedActionSelector } from './selectors/PhaseBasedActionSelector';
export { TimeBasedActionSelector } from './selectors/TimeBasedActionSelector';
export {
  HistoryBasedActionModifier,
  type HistoryModificationResult,
} from './selectors/HistoryBasedActionModifier';
