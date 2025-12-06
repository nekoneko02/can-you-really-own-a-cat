/**
 * API Response型定義
 */
export interface ScenarioResponse {
  id: string;
  name: string;
  purpose: string;
  duration: number;
}

export interface EventResponse {
  id: string;
  title: string;
  description: string;
  choices: Array<{ id: string; text: string }>;
}

export interface CatResponse {
  id: string;
  name: string;
  affectionLevel: number;
  stressLevel: number;
  health: number;
  hunger: number;
}

export interface SessionResponse {
  id: string;
  scenarioId: string;
  currentTurn: number;
  catId: string;
}

/**
 * GameService への API 呼び出しを担当するクライアント
 * 1 ApplicationService = 1 ApiClient の原則
 */
export class GameApiClient {
  private baseUrl = '';

  /**
   * ゲーム開始・セッション初期化
   */
  async loadScenario(scenarioId: string): Promise<ScenarioResponse> {
    const response = await fetch(`${this.baseUrl}/api/game/load-scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ scenarioId }),
    });

    if (!response.ok) {
      throw new Error('Failed to load scenario');
    }

    return response.json();
  }

  /**
   * 現在のイベント取得
   * currentTurnはサーバー側のセッションから取得される
   */
  async getCurrentEvent(scenarioId: string): Promise<EventResponse> {
    const response = await fetch(`${this.baseUrl}/api/game/get-current-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ scenarioId }),
    });

    if (!response.ok) {
      throw new Error('Failed to get current event');
    }

    const data = await response.json();
    return data.event;
  }

  /**
   * 選択肢実行・Cat更新
   */
  async executeChoice(scenarioId: string, choiceId: string): Promise<CatResponse> {
    const response = await fetch(`${this.baseUrl}/api/game/execute-choice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ scenarioId, choiceId }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute choice');
    }

    const data = await response.json();
    return data.cat;
  }

  /**
   * 分岐評価・次イベント決定
   */
  async evaluateBranch(scenarioId: string, choiceId: string): Promise<EventResponse> {
    const response = await fetch(`${this.baseUrl}/api/game/evaluate-branch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ scenarioId, choiceId }),
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate branch');
    }

    const data = await response.json();
    return data.event;
  }

  /**
   * ターン進行
   */
  async advanceToNextTurn(): Promise<SessionResponse> {
    const response = await fetch(`${this.baseUrl}/api/game/advance-turn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to advance turn');
    }

    const data = await response.json();
    return data.session;
  }

  /**
   * シナリオ完了判定
   */
  async isScenarioComplete(scenarioId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/game/is-complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ scenarioId }),
    });

    if (!response.ok) {
      throw new Error('Failed to check scenario completion');
    }

    const result = await response.json();
    return result.isComplete;
  }
}
