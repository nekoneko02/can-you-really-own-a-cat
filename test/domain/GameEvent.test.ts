/**
 * GameEventのテスト
 */

import { GameEvent } from '@/domain/GameEvent';
import { Choice } from '@/domain/Choice';
import { Consequence } from '@/domain/Consequence';
import { TimeOfDay } from '@/domain/types';

describe('GameEvent', () => {
  let waitChoice: Choice;
  let playChoice: Choice;

  beforeEach(() => {
    waitChoice = new Choice({
      id: 'wait',
      text: '様子を見る',
      consequenceText: 'あなたは寝たふりを続けました。',
      execute: () =>
        new Consequence({
          text: 'たまは諦めて眠り始めました。',
          catStateChanges: { stress: -5 },
          eventCompleted: true,
        }),
    });

    playChoice = new Choice({
      id: 'play',
      text: '遊んであげる',
      consequenceText: 'あなたはおもちゃで遊んであげました。',
      execute: () =>
        new Consequence({
          text: 'たまは喜んで遊びました。',
          catStateChanges: { affection: 15, stress: -10 },
          playerStatsChanges: { playCount: 1 },
          eventCompleted: true,
        }),
    });
  });

  describe('constructor', () => {
    it('should create GameEvent with basic properties', () => {
      const event = new GameEvent({
        id: 'E01_midnight_meowing',
        day: 1,
        timeOfDay: TimeOfDay.MIDNIGHT,
        title: '深夜の運動会',
        description:
          '夜中の3時、たまが突然走り回り始めました。バタバタという音で目が覚めてしまいました。',
        catStateDescription: [
          '機嫌は良さそうに見える',
          '少し落ち着きがないようだ',
        ],
        choices: [waitChoice, playChoice],
      });

      expect(event.id).toBe('E01_midnight_meowing');
      expect(event.day).toBe(1);
      expect(event.timeOfDay).toBe(TimeOfDay.MIDNIGHT);
      expect(event.title).toBe('深夜の運動会');
      expect(event.description).toContain('夜中の3時');
      expect(event.catStateDescription).toHaveLength(2);
      expect(event.choices).toHaveLength(2);
    });
  });

  describe('trigger', () => {
    it('should mark event as triggered', () => {
      const event = new GameEvent({
        id: 'E01_midnight_meowing',
        day: 1,
        timeOfDay: TimeOfDay.MIDNIGHT,
        title: '深夜の運動会',
        description: 'たまが走り回り始めました。',
        catStateDescription: [],
        choices: [waitChoice],
      });

      expect(event.isTriggered()).toBe(false);

      event.trigger();

      expect(event.isTriggered()).toBe(true);
    });
  });

  describe('executeChoice', () => {
    it('should execute choice and return consequence', () => {
      const event = new GameEvent({
        id: 'E01_midnight_meowing',
        day: 1,
        timeOfDay: TimeOfDay.MIDNIGHT,
        title: '深夜の運動会',
        description: 'たまが走り回り始めました。',
        catStateDescription: [],
        choices: [waitChoice, playChoice],
      });

      const consequence = event.executeChoice('play');

      expect(consequence.text).toBe('たまは喜んで遊びました。');
      expect(consequence.catStateChanges).toEqual({
        affection: 15,
        stress: -10,
      });
      expect(consequence.eventCompleted).toBe(true);
    });

    it('should throw error when choice not found', () => {
      const event = new GameEvent({
        id: 'E01_midnight_meowing',
        day: 1,
        timeOfDay: TimeOfDay.MIDNIGHT,
        title: '深夜の運動会',
        description: 'たまが走り回り始めました。',
        catStateDescription: [],
        choices: [waitChoice],
      });

      expect(() => event.executeChoice('invalid_choice')).toThrow(
        'Choice not found: invalid_choice'
      );
    });
  });

  describe('getPhaserAction', () => {
    it('should return null when choice has no PhaserAction', () => {
      const event = new GameEvent({
        id: 'E01_midnight_meowing',
        day: 1,
        timeOfDay: TimeOfDay.MIDNIGHT,
        title: '深夜の運動会',
        description: 'たまが走り回り始めました。',
        catStateDescription: [],
        choices: [waitChoice],
      });

      const action = event.getPhaserAction('wait');

      expect(action).toBeNull();
    });
  });

  describe('completeAction', () => {
    it('should mark action as completed', () => {
      const event = new GameEvent({
        id: 'E01_midnight_meowing',
        day: 1,
        timeOfDay: TimeOfDay.MIDNIGHT,
        title: '深夜の運動会',
        description: 'たまが走り回り始めました。',
        catStateDescription: [],
        choices: [waitChoice],
      });

      event.completeAction('play_with_toy');

      expect(event.isActionCompleted('play_with_toy')).toBe(true);
      expect(event.isActionCompleted('other_action')).toBe(false);
    });
  });

  describe('checkTimeLimit', () => {
    it('should return false by default (MVP does not implement time limit)', () => {
      const event = new GameEvent({
        id: 'E01_midnight_meowing',
        day: 1,
        timeOfDay: TimeOfDay.MIDNIGHT,
        title: '深夜の運動会',
        description: 'たまが走り回り始めました。',
        catStateDescription: [],
        choices: [waitChoice],
      });

      expect(event.checkTimeLimit()).toBe(false);
    });
  });
});
