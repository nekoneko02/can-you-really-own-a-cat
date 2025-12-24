/**
 * 状態遷移の統合テスト
 *
 * 猫アクション状態遷移図（docs/design/猫アクション状態遷移図.pu）に基づく網羅テスト
 */

import { GameApplicationService } from '@/application/GameApplicationService';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';
import { AutonomousActionType } from '@/domain/autonomous/AutonomousActionType';
import { AutonomousActionConfig } from '@/domain/autonomous/AutonomousActionConfig';
import { GamePhase } from '@/domain/types';

describe('状態遷移テスト（状態遷移図ベース）', () => {
  let service: GameApplicationService;

  /**
   * テストヘルパー: 夜泣きイベントを開始して猫をMEOWING状態にする
   */
  function startNightCryEvent(): void {
    const game = service.getGame();
    game['currentEvent'] = { id: 'night_crying', type: 'NIGHT_CRYING' };
    game['phase'] = GamePhase.MIDNIGHT_EVENT;

    // 時間を進めて夜泣きイベントを開始
    service.update({ direction: null }, 100);

    // 夜泣きイベントサービスを手動で開始
    service.getNightCryEventService().start();

    // 猫をMEOWING状態にする
    const cat = game['cat'];
    service.getCatBehaviorService().startAction(cat, AutonomousActionType.MEOWING);
  }

  beforeEach(() => {
    service = new GameApplicationService({
      scenarioId: 'night_crying_scenario',
    });
  });

  /**
   * MEOWINGからの遷移テスト
   */
  describe('MEOWINGからの遷移（プレイヤー選択）', () => {
    beforeEach(() => {
      startNightCryEvent();
      // MEOWINGから開始することを確認
      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.MEOWING
      );
    });

    it('「遊ぶ」選択でIDLE_PLAYINGに遷移する', () => {
      service.selectNightCryAction(NightCryActionType.PLAYING);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.IDLE_PLAYING
      );
    });

    it('「撫でる」選択でBEING_PETTEDに遷移する', () => {
      service.selectNightCryAction(NightCryActionType.PETTING);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.BEING_PETTED
      );
    });

    it('「おやつ」選択でSITTINGに遷移する', () => {
      service.selectNightCryAction(NightCryActionType.FEEDING_SNACK);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.SITTING
      );
    });

    it('「捕まえる」選択でFLEEINGに遷移する', () => {
      service.selectNightCryAction(NightCryActionType.CATCHING);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.FLEEING
      );
    });

    it('「締め出す」選択でLOCKED_OUTに遷移し、猫が非表示になる', () => {
      service.selectNightCryAction(NightCryActionType.LOCKED_OUT);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.LOCKED_OUT
      );
      expect(cat.isVisible).toBe(false);
    });

    it('「無視」選択でMEOWINGを継続する', () => {
      service.selectNightCryAction(NightCryActionType.IGNORING);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.MEOWING
      );
    });
  });

  /**
   * IDLE_PLAYINGからの遷移テスト
   */
  describe('IDLE_PLAYINGからの遷移', () => {
    beforeEach(() => {
      startNightCryEvent();
      // IDLE_PLAYINGに遷移
      service.selectNightCryAction(NightCryActionType.PLAYING);
      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.IDLE_PLAYING
      );
    });

    it('「やめる」選択でWAITING_AFTER_CAREに遷移する', () => {
      service.stopCare();

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.WAITING_AFTER_CARE
      );
    });

    it('自動では遷移しない（ユーザー操作まで継続）', () => {
      // 大量の時間を経過させても遷移しない
      service.update({ direction: null }, 1000000);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.IDLE_PLAYING
      );
    });
  });

  /**
   * BEING_PETTEDからの遷移テスト
   */
  describe('BEING_PETTEDからの遷移', () => {
    beforeEach(() => {
      startNightCryEvent();
      // BEING_PETTEDに遷移
      service.selectNightCryAction(NightCryActionType.PETTING);
      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.BEING_PETTED
      );
    });

    it('「やめる」選択でWAITING_AFTER_CAREに遷移する', () => {
      service.stopCare();

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.WAITING_AFTER_CARE
      );
    });

    it('自動では遷移しない（ユーザー操作まで継続）', () => {
      service.update({ direction: null }, 1000000);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.BEING_PETTED
      );
    });
  });

  /**
   * WAITING_AFTER_CAREからの遷移テスト
   */
  describe('WAITING_AFTER_CAREからの遷移', () => {
    beforeEach(() => {
      startNightCryEvent();
      // IDLE_PLAYING → WAITING_AFTER_CAREへ遷移
      service.selectNightCryAction(NightCryActionType.PLAYING);
      service.stopCare();

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.WAITING_AFTER_CARE
      );
    });

    it('3秒経過後にMEOWINGに自動遷移する', () => {
      const duration = AutonomousActionConfig.waitingAfterCare.duration;

      // 持続時間分だけ時間を進める
      service.update({ direction: null }, duration + 100);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.MEOWING
      );
    });

    it('3秒未満では遷移しない', () => {
      const duration = AutonomousActionConfig.waitingAfterCare.duration;

      // 持続時間より少し短い時間を進める
      service.update({ direction: null }, duration - 100);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.WAITING_AFTER_CARE
      );
    });
  });

  /**
   * LOCKED_OUTからの遷移テスト
   */
  describe('LOCKED_OUTからの遷移', () => {
    beforeEach(() => {
      startNightCryEvent();
      // LOCKED_OUTに遷移
      service.selectNightCryAction(NightCryActionType.LOCKED_OUT);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.LOCKED_OUT
      );
      expect(cat.isVisible).toBe(false);
    });

    it('「部屋に戻す」でMEOWINGに遷移し、猫が表示される', () => {
      service.returnCatToRoom();

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.MEOWING
      );
      expect(cat.isVisible).toBe(true);
    });

    it('自動では遷移しない（ユーザー操作まで継続）', () => {
      service.update({ direction: null }, 1000000);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.LOCKED_OUT
      );
      expect(cat.isVisible).toBe(false);
    });
  });

  /**
   * FLEEINGからの遷移テスト
   */
  describe('FLEEINGからの遷移', () => {
    beforeEach(() => {
      startNightCryEvent();
      // FLEEINGに遷移
      service.selectNightCryAction(NightCryActionType.CATCHING);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.FLEEING
      );
    });

    it('プレイヤーから十分離れるとSITTINGに遷移する', () => {
      const cat = service.getGame()['cat'];
      const minDistance = AutonomousActionConfig.fleeing.minDistanceFromPlayer;

      // プレイヤー位置を設定
      service.getCatBehaviorService().setPlayerPositionForFleeing(100, 100);

      // 猫を十分離れた位置に移動
      cat.x = 100 + minDistance;
      cat.y = 100;

      // 更新
      service.update({ direction: null }, 100);

      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.SITTING
      );
    });
  });

  /**
   * SITTINGからの遷移テスト
   */
  describe('SITTINGからの遷移（時間ベース）', () => {
    beforeEach(() => {
      startNightCryEvent();
      // おやつでSITTINGに遷移
      service.selectNightCryAction(NightCryActionType.FEEDING_SNACK);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.SITTING
      );
    });

    it('3秒経過後にWANDERINGに自動遷移する', () => {
      const duration = AutonomousActionConfig.sitting.duration;

      // 持続時間分だけ時間を進める
      service.update({ direction: null }, duration + 100);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.WANDERING
      );
    });
  });

  /**
   * WANDERINGからの遷移テスト
   */
  describe('WANDERINGからの遷移（時間ベース）', () => {
    beforeEach(() => {
      startNightCryEvent();
      // おやつ → SITTING → WANDERING
      service.selectNightCryAction(NightCryActionType.FEEDING_SNACK);
      const sittingDuration = AutonomousActionConfig.sitting.duration;
      service.update({ direction: null }, sittingDuration + 100);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.WANDERING
      );
    });

    it('3秒経過後にSITTINGに自動遷移する', () => {
      const duration = AutonomousActionConfig.wandering.duration;

      // 持続時間分だけ時間を進める
      service.update({ direction: null }, duration + 100);

      const cat = service.getGame()['cat'];
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.SITTING
      );
    });
  });

  /**
   * 完全なフローのテスト
   */
  describe('完全な状態遷移フロー', () => {
    beforeEach(() => {
      startNightCryEvent();
    });

    it('遊ぶ→やめる→MEOWING復帰の完全フロー', () => {
      const cat = service.getGame()['cat'];

      // 1. MEOWING状態を確認
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.MEOWING
      );

      // 2. 遊ぶを選択 → IDLE_PLAYING
      service.selectNightCryAction(NightCryActionType.PLAYING);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.IDLE_PLAYING
      );

      // 3. やめるを選択 → WAITING_AFTER_CARE
      service.stopCare();
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.WAITING_AFTER_CARE
      );

      // 4. 3秒経過 → MEOWING復帰
      const duration = AutonomousActionConfig.waitingAfterCare.duration;
      service.update({ direction: null }, duration + 100);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.MEOWING
      );
    });

    it('撫でる→やめる→MEOWING復帰の完全フロー', () => {
      const cat = service.getGame()['cat'];

      // 1. MEOWING状態を確認（beforeEachで設定済み）
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.MEOWING
      );

      // 2. 撫でるを選択 → BEING_PETTED
      service.selectNightCryAction(NightCryActionType.PETTING);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.BEING_PETTED
      );

      // 3. やめるを選択 → WAITING_AFTER_CARE
      service.stopCare();
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.WAITING_AFTER_CARE
      );

      // 4. 3秒経過 → MEOWING復帰
      const duration = AutonomousActionConfig.waitingAfterCare.duration;
      service.update({ direction: null }, duration + 100);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.MEOWING
      );
    });

    it('締め出す→部屋に戻す→MEOWING復帰（猫表示）の完全フロー', () => {
      const cat = service.getGame()['cat'];

      // 1. MEOWING状態を確認（beforeEachで設定済み）
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.MEOWING
      );
      expect(cat.isVisible).toBe(true);

      // 2. 締め出すを選択 → LOCKED_OUT（猫非表示）
      service.selectNightCryAction(NightCryActionType.LOCKED_OUT);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.LOCKED_OUT
      );
      expect(cat.isVisible).toBe(false);

      // 3. 部屋に戻す → MEOWING復帰（猫表示）
      service.returnCatToRoom();
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.MEOWING
      );
      expect(cat.isVisible).toBe(true);
    });

    it('おやつ→SITTING→WANDERING→SITTINGのサイクル', () => {
      const cat = service.getGame()['cat'];
      const sittingDuration = AutonomousActionConfig.sitting.duration;
      const wanderingDuration = AutonomousActionConfig.wandering.duration;

      // 1. おやつ → SITTING
      service.selectNightCryAction(NightCryActionType.FEEDING_SNACK);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.SITTING
      );

      // 2. 3秒経過 → WANDERING
      service.update({ direction: null }, sittingDuration + 100);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.WANDERING
      );

      // 3. さらに3秒経過 → SITTING
      service.update({ direction: null }, wanderingDuration + 100);
      expect(cat.autonomousBehaviorState.currentAction).toBe(
        AutonomousActionType.SITTING
      );
    });
  });
});
