/**
 * 自律アクションインターフェース
 *
 * 猫が自律的に行う各アクションの共通インターフェースです。
 */

import { Cat } from '@/domain/Cat';
import { AutonomousActionType } from './AutonomousActionType';

export interface AutonomousAction {
  /** アクションタイプ */
  readonly type: AutonomousActionType;

  /**
   * アクションを開始
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  start(cat: Cat, gameTime: number): void;

  /**
   * アクションを更新
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  update(cat: Cat, gameTime: number): void;

  /**
   * アクションが完了したか判定
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   * @returns 完了している場合 true
   */
  isCompleted(cat: Cat, gameTime: number): boolean;

  /**
   * アクションを停止
   * @param cat 猫エンティティ
   */
  stop(cat: Cat): void;
}
