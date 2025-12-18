import { EventScenario } from '@/domain/EventScenario';
import { EventStep } from '@/domain/EventStep';
import { Choice } from '@/domain/Choice';
import { Consequence } from '@/domain/Consequence';

describe('EventScenario', () => {
  describe('basic functionality', () => {
    it('should initialize with initial step', () => {
      const step1 = new EventStep({
        id: 'step1',
        description: 'ステップ1',
        choices: [],
      });

      const scenario = new EventScenario({
        id: 'test_scenario',
        title: 'テストシナリオ',
        initialStepId: 'step1',
        steps: [step1],
      });

      expect(scenario.id).toBe('test_scenario');
      expect(scenario.title).toBe('テストシナリオ');
      expect(scenario.getCurrentStep()).toBe(step1);
      expect(scenario.isCompleted()).toBe(false);
    });
  });

  describe('step transitions', () => {
    it('should transition to next step', () => {
      const choice1 = new Choice({
        id: 'choice1',
        text: '次へ',
        consequenceText: '次のステップへ',
        execute: () =>
          new Consequence({
            text: '次のステップへ',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'step2',
      });

      const step1 = new EventStep({
        id: 'step1',
        description: 'ステップ1',
        choices: [choice1],
      });

      const step2 = new EventStep({
        id: 'step2',
        description: 'ステップ2',
        choices: [],
      });

      const scenario = new EventScenario({
        id: 'test_scenario',
        title: 'テストシナリオ',
        initialStepId: 'step1',
        steps: [step1, step2],
      });

      // 初期状態
      expect(scenario.getCurrentStep()?.id).toBe('step1');

      // 選択を実行
      const result = scenario.executeChoice('choice1');

      // ステップが進んでいる
      expect(result.nextStepId).toBe('step2');
      expect(result.isCompleted).toBe(false);
      expect(scenario.getCurrentStep()?.id).toBe('step2');
    });

    it('should complete when nextStepId is null', () => {
      const choiceComplete = new Choice({
        id: 'complete',
        text: '完了',
        consequenceText: 'シナリオ完了',
        execute: () =>
          new Consequence({
            text: 'シナリオ完了',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: true,
          }),
        nextStepId: null, // 完了
      });

      const step1 = new EventStep({
        id: 'step1',
        description: 'ステップ1',
        choices: [choiceComplete],
      });

      const scenario = new EventScenario({
        id: 'test_scenario',
        title: 'テストシナリオ',
        initialStepId: 'step1',
        steps: [step1],
      });

      // 選択を実行
      const result = scenario.executeChoice('complete');

      // シナリオが完了
      expect(result.nextStepId).toBeNull();
      expect(result.isCompleted).toBe(true);
      expect(scenario.isCompleted()).toBe(true);
    });
  });

  describe('loop structure', () => {
    it('should loop back to same step', () => {
      const choiceLoop = new Choice({
        id: 'loop',
        text: 'もう一度',
        consequenceText: '同じステップに戻る',
        execute: () =>
          new Consequence({
            text: '同じステップに戻る',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'step1', // 同じステップに戻る
      });

      const step1 = new EventStep({
        id: 'step1',
        description: 'ステップ1',
        choices: [choiceLoop],
      });

      const scenario = new EventScenario({
        id: 'test_scenario',
        title: 'テストシナリオ',
        initialStepId: 'step1',
        steps: [step1],
      });

      // 選択を実行
      const result = scenario.executeChoice('loop');

      // 同じステップに戻っている
      expect(result.nextStepId).toBe('step1');
      expect(scenario.getCurrentStep()?.id).toBe('step1');
      expect(scenario.isCompleted()).toBe(false);
    });
  });

  describe('history tracking', () => {
    it('should track choice history', () => {
      const choice1 = new Choice({
        id: 'choice1',
        text: '選択1',
        consequenceText: '結果1',
        execute: () =>
          new Consequence({
            text: '結果1',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'step2',
      });

      const choice2 = new Choice({
        id: 'choice2',
        text: '選択2',
        consequenceText: '結果2',
        execute: () =>
          new Consequence({
            text: '結果2',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: true,
          }),
        nextStepId: null,
      });

      const step1 = new EventStep({
        id: 'step1',
        description: 'ステップ1',
        choices: [choice1],
      });

      const step2 = new EventStep({
        id: 'step2',
        description: 'ステップ2',
        choices: [choice2],
      });

      const scenario = new EventScenario({
        id: 'test_scenario',
        title: 'テストシナリオ',
        initialStepId: 'step1',
        steps: [step1, step2],
      });

      // 2つの選択を実行
      scenario.executeChoice('choice1');
      scenario.executeChoice('choice2');

      // 履歴が記録されている
      const history = scenario.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0].stepId).toBe('step1');
      expect(history[0].choiceId).toBe('choice1');
      expect(history[1].stepId).toBe('step2');
      expect(history[1].choiceId).toBe('choice2');
    });
  });

  describe('error handling', () => {
    it('should throw error when current step not found', () => {
      const scenario = new EventScenario({
        id: 'test_scenario',
        title: 'テストシナリオ',
        initialStepId: 'invalid_step',
        steps: [],
      });

      expect(() => scenario.executeChoice('choice1')).toThrow(
        '[EventScenario] Current step not found: invalid_step'
      );
    });

    it('should throw error when choice not found', () => {
      const step1 = new EventStep({
        id: 'step1',
        description: 'ステップ1',
        choices: [],
      });

      const scenario = new EventScenario({
        id: 'test_scenario',
        title: 'テストシナリオ',
        initialStepId: 'step1',
        steps: [step1],
      });

      expect(() => scenario.executeChoice('invalid_choice')).toThrow(
        '[EventScenario] Choice not found: invalid_choice'
      );
    });
  });
});
