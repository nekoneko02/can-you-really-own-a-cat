import { createNightCryingDay1Scenario } from '@/data/scenarios/nightCryingDay1';

describe('nightCryingDay1 scenario', () => {
  it('should create scenario with all steps', () => {
    const scenario = createNightCryingDay1Scenario();

    expect(scenario.id).toBe('night_crying_day1');
    expect(scenario.title).toBe('初日の夜泣き');
    expect(scenario.getCurrentStep()?.id).toBe('step1_wakeup');
  });

  it('should complete through branch A (play)', () => {
    const scenario = createNightCryingDay1Scenario();

    // ステップ1: 起きて様子を見る
    let result = scenario.executeChoice('investigate');
    expect(result.isCompleted).toBe(false);
    expect(scenario.getCurrentStep()?.id).toBe('stepA1_investigate');

    // ステップA-1: 遊んであげる
    result = scenario.executeChoice('play');
    expect(result.isCompleted).toBe(true);
    expect(scenario.isCompleted()).toBe(true);
  });

  it('should loop when petting cat', () => {
    const scenario = createNightCryingDay1Scenario();

    // ステップ1: 起きて様子を見る
    scenario.executeChoice('investigate');

    // ステップA-1: 撫でてあげる（ループ）
    const result = scenario.executeChoice('pet');
    expect(result.isCompleted).toBe(false);
    expect(scenario.getCurrentStep()?.id).toBe('stepA1_investigate'); // 同じステップ

    // もう一度遊んであげる
    const result2 = scenario.executeChoice('play');
    expect(result2.isCompleted).toBe(true);
  });

  it('should complete through branch B (endure)', () => {
    const scenario = createNightCryingDay1Scenario();

    // ステップ1: 無視して寝続ける
    let result = scenario.executeChoice('ignore');
    expect(result.isCompleted).toBe(false);
    expect(scenario.getCurrentStep()?.id).toBe('stepB1_ignore');

    // ステップB-1: 耐えて寝続ける
    result = scenario.executeChoice('endure');
    expect(result.isCompleted).toBe(true);
  });

  it('should merge from branch B to branch A', () => {
    const scenario = createNightCryingDay1Scenario();

    // ステップ1: 無視して寝続ける
    scenario.executeChoice('ignore');

    // ステップB-1: やっぱり起きる（分岐Aに合流）
    const result = scenario.executeChoice('get_up');
    expect(result.isCompleted).toBe(false);
    expect(scenario.getCurrentStep()?.id).toBe('stepA1_investigate'); // 分岐Aに合流
  });

  it('should complete through branch C (move out and sleep)', () => {
    const scenario = createNightCryingDay1Scenario();

    // ステップ1: 別の部屋に追い出す
    let result = scenario.executeChoice('move_out');
    expect(result.isCompleted).toBe(false);
    expect(scenario.getCurrentStep()?.id).toBe('stepC1_move_out');

    // ステップC-1: このまま寝る
    result = scenario.executeChoice('sleep');
    expect(result.isCompleted).toBe(true);
  });

  it('should merge from branch C to branch A', () => {
    const scenario = createNightCryingDay1Scenario();

    // ステップ1: 別の部屋に追い出す
    scenario.executeChoice('move_out');

    // ステップC-1: やっぱり部屋に戻す（分岐Aに合流）
    const result = scenario.executeChoice('bring_back');
    expect(result.isCompleted).toBe(false);
    expect(scenario.getCurrentStep()?.id).toBe('stepA1_investigate'); // 分岐Aに合流
  });
});
