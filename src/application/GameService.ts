import { AffectionLevel, Cat, Health, Hunger, StressLevel } from '@/domain/cat';
import { Event, EventResult, GameSession, Scenario } from '@/domain/game';

/**
 * ゲーム進行を管理するアプリケーションサービス
 */
export class GameService {
  /**
   * 新しいゲームセッションを開始する
   */
  startNewSession(
    sessionId: string,
    catId: string,
    scenario: Scenario
  ): GameSession {
    return new GameSession(sessionId, catId, scenario.id, 1);
  }

  /**
   * セッションの現在のターンに対応するイベントを取得する
   */
  getCurrentEvent(scenario: Scenario, session: GameSession): Event | undefined {
    // セッションから現在のターンを取得してイベントを返す
    const eventIndex = session.currentTurn - 1;
    return scenario.events[eventIndex];
  }

  /**
   * 次のターンに進めた新しいセッションを返す（不変性）
   */
  advanceToNextTurn(session: GameSession): GameSession {
    return session.advanceTurn();
  }

  /**
   * セッションのターン数でシナリオが完了したかチェック
   */
  isScenarioComplete(scenario: Scenario, session: GameSession): boolean {
    return session.currentTurn > scenario.events.length;
  }

  /**
   * イベントの選択肢を実行し、猫の状態を更新する
   */
  executeChoice(cat: Cat, event: Event, choiceId: string): Cat {
    const result = event.getResult(choiceId);
    if (!result) {
      throw new Error(`Invalid choice ID: ${choiceId}`);
    }

    return this.applyEventResult(cat, result);
  }

  /**
   * イベント結果を猫の状態に適用する
   */
  private applyEventResult(cat: Cat, result: EventResult): Cat {
    let updatedCat = cat;

    for (const change of result.changes) {
      switch (change.parameterType) {
        case 'affection':
          updatedCat = updatedCat.updateAffection(
            this.calculateNewValue(
              updatedCat.affectionLevel,
              change.changeAmount,
              AffectionLevel
            )
          );
          break;
        case 'stress':
          updatedCat = updatedCat.updateStress(
            this.calculateNewValue(
              updatedCat.stressLevel,
              change.changeAmount,
              StressLevel
            )
          );
          break;
        case 'health':
          updatedCat = updatedCat.updateHealth(
            this.calculateNewValue(
              updatedCat.health,
              change.changeAmount,
              Health
            )
          );
          break;
        case 'hunger':
          updatedCat = updatedCat.updateHunger(
            this.calculateNewValue(
              updatedCat.hunger,
              change.changeAmount,
              Hunger
            )
          );
          break;
      }
    }

    return updatedCat;
  }

  /**
   * 新しい値を計算（クランプ処理込み）
   */
  private calculateNewValue<T extends { value: number }>(
    current: T,
    changeAmount: number,
    Constructor: new (value: number) => T
  ): T {
    const newValue = Math.max(0, Math.min(100, current.value + changeAmount));
    return new Constructor(newValue);
  }
}
