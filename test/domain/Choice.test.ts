/**
 * Choiceのテスト
 */

import { Choice } from '@/domain/Choice';
import { PhaserAction } from '@/domain/PhaserAction';
import { Consequence } from '@/domain/Consequence';
import { ActionType, InteractionAction } from '@/domain/types';

describe('Choice', () => {
  describe('constructor', () => {
    it('should create Choice without PhaserAction', () => {
      const choice = new Choice({
        id: 'wait',
        text: '様子を見る（寝たふりをする）',
        consequenceText: 'あなたは寝たふりを続けました。',
        execute: () =>
          new Consequence({
            text: '15分後、たまは諦めて眠り始めました。',
            catStateChanges: { stress: -5 },
            eventCompleted: true,
          }),
      });

      expect(choice.id).toBe('wait');
      expect(choice.text).toBe('様子を見る（寝たふりをする）');
      expect(choice.phaserAction).toBeNull();
      expect(choice.consequenceText).toBe('あなたは寝たふりを続けました。');
    });

    it('should create Choice with PhaserAction', () => {
      const phaserAction = new PhaserAction({
        type: ActionType.INTERACT_WITH,
        targetObject: 'cat',
        requiredAction: InteractionAction.CATCH,
      });

      const choice = new Choice({
        id: 'catch',
        text: '起きて捕まえる',
        phaserAction,
        consequenceText: 'あなたは起きて、たまを捕まえました。',
        execute: () =>
          new Consequence({
            text: 'たまは少し不満そうですが、おとなしくなりました。',
            catStateChanges: { stress: 10, affection: -5 },
            eventCompleted: true,
          }),
      });

      expect(choice.id).toBe('catch');
      expect(choice.text).toBe('起きて捕まえる');
      expect(choice.phaserAction).toBe(phaserAction);
      expect(choice.phaserAction?.type).toBe(ActionType.INTERACT_WITH);
      expect(choice.phaserAction?.targetObject).toBe('cat');
    });
  });

  describe('execute', () => {
    it('should execute and return Consequence', () => {
      const choice = new Choice({
        id: 'play',
        text: '遊んであげる',
        consequenceText: 'あなたはおもちゃで遊んであげました。',
        execute: () =>
          new Consequence({
            text: 'たまは喜んで遊び、満足したようで眠り始めました。',
            catStateChanges: { affection: 15, stress: -10 },
            playerStatsChanges: { playCount: 1 },
            eventCompleted: true,
          }),
      });

      const consequence = choice.execute();

      expect(consequence.text).toBe(
        'たまは喜んで遊び、満足したようで眠り始めました。'
      );
      expect(consequence.catStateChanges).toEqual({
        affection: 15,
        stress: -10,
      });
      expect(consequence.playerStatsChanges).toEqual({ playCount: 1 });
      expect(consequence.eventCompleted).toBe(true);
    });
  });

  describe('nextStepId', () => {
    it('should have nextStepId when specified', () => {
      const choice = new Choice({
        id: 'choice1',
        text: 'テスト',
        consequenceText: 'テスト結果',
        execute: () =>
          new Consequence({
            text: 'テスト',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: false,
          }),
        nextStepId: 'step2',
      });

      expect(choice.nextStepId).toBe('step2');
    });

    it('should have null nextStepId when not specified', () => {
      const choice = new Choice({
        id: 'choice1',
        text: 'テスト',
        consequenceText: 'テスト結果',
        execute: () =>
          new Consequence({
            text: 'テスト',
            catStateChanges: {},
            playerStatsChanges: {},
            eventCompleted: true,
          }),
      });

      expect(choice.nextStepId).toBeNull();
    });

    it('should have null nextStepId when completion choice', () => {
      const choice = new Choice({
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
        nextStepId: null,
      });

      expect(choice.nextStepId).toBeNull();
    });
  });
});
