/**
 * 各アクションクラスのテスト
 */

import { Cat } from '@/domain/Cat';
import { CatState, CatMood } from '@/domain/types';
import { SleepingAction } from '@/domain/autonomous/actions/SleepingAction';
import { SittingAction } from '@/domain/autonomous/actions/SittingAction';
import { WanderingAction } from '@/domain/autonomous/actions/WanderingAction';
import { MeowingAction } from '@/domain/autonomous/actions/MeowingAction';
import { IdlePlayingAction } from '@/domain/autonomous/actions/IdlePlayingAction';
import { BeingPettedAction } from '@/domain/autonomous/actions/BeingPettedAction';
import { FleeingAction } from '@/domain/autonomous/actions/FleeingAction';
import { WaitingAfterCareAction } from '@/domain/autonomous/actions/WaitingAfterCareAction';
import { LockedOutAction } from '@/domain/autonomous/actions/LockedOutAction';
import { AutonomousActionType } from '@/domain/autonomous/AutonomousActionType';
import { AutonomousActionConfig } from '@/domain/autonomous/AutonomousActionConfig';

describe('SleepingAction', () => {
  let action: SleepingAction;
  let cat: Cat;

  beforeEach(() => {
    action = new SleepingAction();
    cat = new Cat();
  });

  it('typeがSLEEPINGである', () => {
    expect(action.type).toBe(AutonomousActionType.SLEEPING);
  });

  it('startすると猫がSLEEPING状態になる', () => {
    action.start(cat, 0);

    expect(cat.state).toBe(CatState.SLEEPING);
    expect(cat.mood).toBe(CatMood.SLEEPY);
    expect(cat.autonomousBehaviorState.currentAction).toBe(AutonomousActionType.SLEEPING);
  });

  it('isCompletedは常にfalseを返す', () => {
    action.start(cat, 0);

    expect(action.isCompleted(cat, 1000000)).toBe(false);
  });

  it('stopするとcurrentActionがnullになる', () => {
    action.start(cat, 0);
    action.stop(cat);

    expect(cat.autonomousBehaviorState.currentAction).toBeNull();
  });
});

describe('SittingAction', () => {
  let action: SittingAction;
  let cat: Cat;

  beforeEach(() => {
    action = new SittingAction();
    cat = new Cat();
  });

  it('typeがSITTINGである', () => {
    expect(action.type).toBe(AutonomousActionType.SITTING);
  });

  it('startすると猫がSITTING状態になる', () => {
    action.start(cat, 0);

    expect(cat.state).toBe(CatState.SITTING);
    expect(cat.autonomousBehaviorState.currentAction).toBe(AutonomousActionType.SITTING);
  });

  it('設定された持続時間経過後にisCompletedがtrueを返す', () => {
    action.start(cat, 0);
    const duration = AutonomousActionConfig.sitting.duration;

    expect(action.isCompleted(cat, duration)).toBe(true);
  });

  it('設定された持続時間未満ではisCompletedがfalseを返す', () => {
    action.start(cat, 0);
    const duration = AutonomousActionConfig.sitting.duration;

    expect(action.isCompleted(cat, duration - 1)).toBe(false);
  });
});

describe('WanderingAction', () => {
  let action: WanderingAction;
  let cat: Cat;

  beforeEach(() => {
    action = new WanderingAction();
    cat = new Cat();
  });

  it('typeがWANDERINGである', () => {
    expect(action.type).toBe(AutonomousActionType.WANDERING);
  });

  it('startすると猫がWALKING状態になる', () => {
    action.start(cat, 0);

    expect(cat.state).toBe(CatState.WALKING);
    expect(cat.autonomousBehaviorState.currentAction).toBe(AutonomousActionType.WANDERING);
  });

  it('設定された持続時間経過後にisCompletedがtrueを返す', () => {
    action.start(cat, 0);
    const duration = AutonomousActionConfig.wandering.duration;

    expect(action.isCompleted(cat, duration)).toBe(true);
  });
});

describe('MeowingAction', () => {
  let action: MeowingAction;
  let cat: Cat;

  beforeEach(() => {
    action = new MeowingAction();
    cat = new Cat();
  });

  it('typeがMEOWINGである', () => {
    expect(action.type).toBe(AutonomousActionType.MEOWING);
  });

  it('startすると猫がMEOWING状態になる', () => {
    action.start(cat, 0);

    expect(cat.state).toBe(CatState.MEOWING);
    expect(cat.autonomousBehaviorState.currentAction).toBe(AutonomousActionType.MEOWING);
  });

  it('デフォルトのmeowingDuration(30秒)経過後にisCompletedがtrueを返す', () => {
    action.start(cat, 0);

    expect(action.isCompleted(cat, 30000)).toBe(true);
  });

  it('meowingDurationが変更された場合、その時間で完了判定される', () => {
    action.start(cat, 0);
    cat.autonomousBehaviorState.meowingDuration = 40000;

    expect(action.isCompleted(cat, 30000)).toBe(false);
    expect(action.isCompleted(cat, 40000)).toBe(true);
  });
});

describe('IdlePlayingAction', () => {
  let action: IdlePlayingAction;
  let cat: Cat;

  beforeEach(() => {
    action = new IdlePlayingAction();
    cat = new Cat();
  });

  it('typeがIDLE_PLAYINGである', () => {
    expect(action.type).toBe(AutonomousActionType.IDLE_PLAYING);
  });

  it('startすると猫がPLAYING状態でHAPPYな気分になる', () => {
    action.start(cat, 0);

    expect(cat.state).toBe(CatState.PLAYING);
    expect(cat.mood).toBe(CatMood.HAPPY);
    expect(cat.autonomousBehaviorState.currentAction).toBe(AutonomousActionType.IDLE_PLAYING);
  });

  it('isCompletedは常にfalseを返す（ユーザー操作まで継続）', () => {
    action.start(cat, 0);

    // どれだけ時間が経過してもfalse
    expect(action.isCompleted(cat, 15000)).toBe(false);
    expect(action.isCompleted(cat, 1000000)).toBe(false);
  });

  it('stopすると気分がNEUTRALに戻る', () => {
    action.start(cat, 0);
    action.stop(cat);

    expect(cat.mood).toBe(CatMood.NEUTRAL);
    expect(cat.autonomousBehaviorState.currentAction).toBeNull();
  });
});

describe('BeingPettedAction', () => {
  let action: BeingPettedAction;
  let cat: Cat;

  beforeEach(() => {
    action = new BeingPettedAction();
    cat = new Cat();
  });

  it('typeがBEING_PETTEDである', () => {
    expect(action.type).toBe(AutonomousActionType.BEING_PETTED);
  });

  it('startすると猫がSITTING状態でHAPPYな気分になる', () => {
    action.start(cat, 0);

    expect(cat.state).toBe(CatState.SITTING);
    expect(cat.mood).toBe(CatMood.HAPPY);
    expect(cat.autonomousBehaviorState.currentAction).toBe(
      AutonomousActionType.BEING_PETTED
    );
  });

  it('isCompletedは常にfalseを返す（ユーザー操作まで継続）', () => {
    action.start(cat, 0);

    expect(action.isCompleted(cat, 1000000)).toBe(false);
  });

  it('stopすると気分がNEUTRALに戻る', () => {
    action.start(cat, 0);
    action.stop(cat);

    expect(cat.mood).toBe(CatMood.NEUTRAL);
    expect(cat.autonomousBehaviorState.currentAction).toBeNull();
  });
});

describe('FleeingAction', () => {
  let action: FleeingAction;
  let cat: Cat;

  beforeEach(() => {
    action = new FleeingAction();
    cat = new Cat({ x: 400, y: 300 });
  });

  it('typeがFLEEINGである', () => {
    expect(action.type).toBe(AutonomousActionType.FLEEING);
  });

  it('startすると猫がRUNNING状態でSCAREDな気分になる', () => {
    action.start(cat, 0);

    expect(cat.state).toBe(CatState.RUNNING);
    expect(cat.mood).toBe(CatMood.SCARED);
    expect(cat.autonomousBehaviorState.currentAction).toBe(
      AutonomousActionType.FLEEING
    );
  });

  it('プレイヤーから十分離れるとisCompletedがtrueを返す', () => {
    action.start(cat, 0);
    action.setPlayerPosition(100, 100);

    // 猫をプレイヤーから十分離れた位置に移動
    cat.x = 100 + AutonomousActionConfig.fleeing.minDistanceFromPlayer;
    cat.y = 100;

    expect(action.isCompleted(cat, 1000)).toBe(true);
  });

  it('プレイヤーに近いとisCompletedがfalseを返す', () => {
    action.start(cat, 0);
    action.setPlayerPosition(400, 300);

    expect(action.isCompleted(cat, 1000)).toBe(false);
  });
});

describe('WaitingAfterCareAction', () => {
  let action: WaitingAfterCareAction;
  let cat: Cat;

  beforeEach(() => {
    action = new WaitingAfterCareAction();
    cat = new Cat();
  });

  it('typeがWAITING_AFTER_CAREである', () => {
    expect(action.type).toBe(AutonomousActionType.WAITING_AFTER_CARE);
  });

  it('startすると猫がSITTING状態でNEUTRALな気分になる', () => {
    action.start(cat, 0);

    expect(cat.state).toBe(CatState.SITTING);
    expect(cat.mood).toBe(CatMood.NEUTRAL);
    expect(cat.autonomousBehaviorState.currentAction).toBe(
      AutonomousActionType.WAITING_AFTER_CARE
    );
  });

  it('設定された持続時間経過後にisCompletedがtrueを返す', () => {
    action.start(cat, 0);
    const duration = AutonomousActionConfig.waitingAfterCare.duration;

    expect(action.isCompleted(cat, duration)).toBe(true);
  });

  it('設定された持続時間未満ではisCompletedがfalseを返す', () => {
    action.start(cat, 0);
    const duration = AutonomousActionConfig.waitingAfterCare.duration;

    expect(action.isCompleted(cat, duration - 1)).toBe(false);
  });
});

describe('LockedOutAction', () => {
  let action: LockedOutAction;
  let cat: Cat;

  beforeEach(() => {
    action = new LockedOutAction();
    cat = new Cat();
  });

  it('typeがLOCKED_OUTである', () => {
    expect(action.type).toBe(AutonomousActionType.LOCKED_OUT);
  });

  it('startすると猫が非表示になる', () => {
    action.start(cat, 0);

    expect(cat.isVisible).toBe(false);
    expect(cat.autonomousBehaviorState.currentAction).toBe(
      AutonomousActionType.LOCKED_OUT
    );
  });

  it('isCompletedは常にfalseを返す（ユーザー操作まで継続）', () => {
    action.start(cat, 0);

    expect(action.isCompleted(cat, 1000000)).toBe(false);
  });

  it('stopすると猫が表示される', () => {
    action.start(cat, 0);
    action.stop(cat);

    expect(cat.isVisible).toBe(true);
    expect(cat.autonomousBehaviorState.currentAction).toBeNull();
  });
});
