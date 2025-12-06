/**
 * Branded types for type-safe IDs
 *
 * これらのブランド型により、異なる種類のIDを誤って混同することを防ぎます。
 * 実行時のオーバーヘッドはなく、TypeScriptの型チェックのみで動作します。
 */

/**
 * シナリオID
 */
export type ScenarioId = string & { readonly __brand: 'ScenarioId' };

/**
 * イベントID
 */
export type EventId = string & { readonly __brand: 'EventId' };

/**
 * 選択肢ID
 */
export type ChoiceId = string & { readonly __brand: 'ChoiceId' };

/**
 * 猫ID
 */
export type CatId = string & { readonly __brand: 'CatId' };

/**
 * ゲームセッションID
 */
export type GameSessionId = string & { readonly __brand: 'GameSessionId' };

/**
 * ブランド型のファクトリ関数
 *
 * 使用例:
 * const scenarioId = ScenarioId('scenario_001');
 * const eventId = EventId('event_001');
 */
export const ScenarioId = (id: string): ScenarioId => {
  if (!id) {
    throw new Error('ScenarioId cannot be empty');
  }
  return id as ScenarioId;
};

export const EventId = (id: string): EventId => {
  if (!id) {
    throw new Error('EventId cannot be empty');
  }
  return id as EventId;
};

export const ChoiceId = (id: string): ChoiceId => {
  if (!id) {
    throw new Error('ChoiceId cannot be empty');
  }
  return id as ChoiceId;
};

export const CatId = (id: string): CatId => {
  if (!id) {
    throw new Error('CatId cannot be empty');
  }
  return id as CatId;
};

export const GameSessionId = (id: string): GameSessionId => {
  if (!id) {
    throw new Error('GameSessionId cannot be empty');
  }
  return id as GameSessionId;
};
