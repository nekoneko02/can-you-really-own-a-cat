import { EventStep } from '@/domain/EventStep';
import { Choice } from '@/domain/Choice';
import { Consequence } from '@/domain/Consequence';

describe('EventStep', () => {
  describe('constructor', () => {
    it('should create EventStep with basic params', () => {
      const step = new EventStep({
        id: 'step1',
        description: 'テストステップ',
        choices: [],
      });

      expect(step.id).toBe('step1');
      expect(step.description).toBe('テストステップ');
      expect(step.choices).toHaveLength(0);
      expect(step.catStateDescription).toEqual([]);
      expect(step.soundEffect).toBeUndefined();
    });

    it('should create EventStep with all params', () => {
      const choice = new Choice({
        id: 'choice1',
        text: 'テスト選択肢',
        consequenceText: 'テスト結果',
        execute: () =>
          new Consequence({
            text: 'テスト',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: true,
          }),
      });

      const step = new EventStep({
        id: 'step1',
        description: 'テストステップ',
        catStateDescription: ['元気そうだ', '少し興奮している'],
        choices: [choice],
        soundEffect: 'meow.mp3',
      });

      expect(step.id).toBe('step1');
      expect(step.description).toBe('テストステップ');
      expect(step.catStateDescription).toEqual(['元気そうだ', '少し興奮している']);
      expect(step.choices).toHaveLength(1);
      expect(step.soundEffect).toBe('meow.mp3');
    });
  });

  describe('getChoices', () => {
    it('should return empty array when no choices', () => {
      const step = new EventStep({
        id: 'step1',
        description: 'テストステップ',
        choices: [],
      });

      expect(step.getChoices()).toHaveLength(0);
    });

    it('should return all choices', () => {
      const choice1 = new Choice({
        id: 'choice1',
        text: 'テスト選択肢1',
        consequenceText: 'テスト結果1',
        execute: () =>
          new Consequence({
            text: 'テスト1',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: true,
          }),
      });

      const choice2 = new Choice({
        id: 'choice2',
        text: 'テスト選択肢2',
        consequenceText: 'テスト結果2',
        execute: () =>
          new Consequence({
            text: 'テスト2',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: false,
          }),
      });

      const step = new EventStep({
        id: 'step1',
        description: 'テストステップ',
        choices: [choice1, choice2],
      });

      const choices = step.getChoices();
      expect(choices).toHaveLength(2);
      expect(choices[0]).toBe(choice1);
      expect(choices[1]).toBe(choice2);
    });
  });
});
