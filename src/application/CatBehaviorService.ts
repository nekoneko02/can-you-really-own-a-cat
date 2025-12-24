/**
 * CatBehaviorService - 猫の振る舞い制御サービス
 *
 * Application層で猫の自律的振る舞いを制御するサービスです。
 * AutonomousBehaviorManager（Domain層）と TimeService を連携させます。
 */

import { Cat } from '@/domain/Cat';
import { GamePhase } from '@/domain/types';
import { EventRecord } from '@/domain/EventRecord';
import { AutonomousBehaviorManager } from '@/domain/autonomous/AutonomousBehaviorManager';
import { AutonomousActionType } from '@/domain/autonomous/AutonomousActionType';
import { TimeService } from './TimeService';

export class CatBehaviorService {
  private manager: AutonomousBehaviorManager;
  private timeService: TimeService;

  constructor(timeService: TimeService) {
    this.manager = new AutonomousBehaviorManager();
    this.timeService = timeService;
  }

  /**
   * フェーズ変更時の処理
   * @param cat 猫エンティティ
   * @param phase 新しいゲームフェーズ
   * @param history イベント履歴
   */
  onPhaseChange(cat: Cat, phase: GamePhase, history: EventRecord[]): void {
    // 履歴に基づく調整を適用
    this.manager.applyHistoryModification(cat, history);

    // フェーズに応じたアクションを選択して開始
    const actionType = this.manager.selectActionForPhase(phase);
    this.manager.startAction(cat, actionType, this.getGameTime());
  }

  /**
   * 更新処理
   * @param cat 猫エンティティ
   */
  update(cat: Cat): void {
    this.manager.update(cat, this.getGameTime());
  }

  /**
   * 特定のアクションを開始
   * @param cat 猫エンティティ
   * @param actionType アクションタイプ
   */
  startAction(cat: Cat, actionType: AutonomousActionType): void {
    this.manager.startAction(cat, actionType, this.getGameTime());
  }

  /**
   * 現在のアクションを停止
   * @param cat 猫エンティティ
   */
  stopCurrentAction(cat: Cat): void {
    this.manager.stopCurrentAction(cat);
  }

  /**
   * 現在のアクションタイプを取得
   * @param cat 猫エンティティ
   * @returns 現在のアクションタイプ
   */
  getCurrentActionType(cat: Cat): AutonomousActionType | null {
    return this.manager.getCurrentActionType(cat);
  }

  /**
   * アクションが完了しているか判定
   * @param cat 猫エンティティ
   * @returns 完了している場合 true
   */
  isCurrentActionCompleted(cat: Cat): boolean {
    return this.manager.isCurrentActionCompleted(cat, this.getGameTime());
  }

  /**
   * 自律的振る舞い状態をリセット
   * @param cat 猫エンティティ
   */
  reset(cat: Cat): void {
    this.manager.stopCurrentAction(cat);
    cat.resetAutonomousBehaviorState();
  }

  /**
   * 朝シーンへの遷移条件を確認
   * @returns 遷移可能な場合 true
   */
  checkMorningTransition(): boolean {
    // 猫のautonomousBehaviorStateを取得するために、内部の状態を確認
    // ManagerのcheckMorningTransitionを呼び出すには猫エンティティが必要
    // ここでは簡易的にManagerにアクセスできるメソッドを追加
    return false; // デフォルト値、実際の判定はupdateループ内で行う
  }

  /**
   * Catエンティティを使用して朝シーンへの遷移条件を確認
   * @param cat 猫エンティティ
   * @returns 遷移可能な場合 true
   */
  checkMorningTransitionWithCat(cat: Cat): boolean {
    return this.manager.checkMorningTransition(cat);
  }

  /**
   * FleeingActionにプレイヤー位置を設定
   */
  setPlayerPositionForFleeing(x: number, y: number): void {
    this.manager.setPlayerPositionForFleeing(x, y);
  }

  /**
   * ゲーム時間を取得
   */
  private getGameTime(): number {
    return this.timeService.getElapsedMs();
  }
}
