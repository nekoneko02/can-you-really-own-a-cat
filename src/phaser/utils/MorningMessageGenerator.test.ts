/**
 * MorningMessageGenerator のテスト
 */

import { describe, it, expect } from 'vitest';
import {
  generateMorningMessage,
  NightCryResultForMessage,
} from './MorningMessageGenerator';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';

describe('MorningMessageGenerator', () => {
  describe('generateMorningMessage', () => {
    describe('睡眠の質セリフ（1行目）', () => {
      it('夜泣きイベントがあった場合、スッキリしないセリフを返す', () => {
        const result: NightCryResultForMessage = {
          hadNightCryEvent: true,
          lastAction: NightCryActionType.PLAYING,
          completedBy: 'satisfaction',
        };

        const message = generateMorningMessage(result);

        expect(message.sleepQualityLine).toBe(
          '（途中で起きたせいか、なんだかスッキリしない…）'
        );
      });

      it('夜泣きイベントがなかった場合、よく眠れたセリフを返す', () => {
        const result: NightCryResultForMessage = {
          hadNightCryEvent: false,
        };

        const message = generateMorningMessage(result);

        expect(message.sleepQualityLine).toBe('（よく眠れた…）');
      });
    });

    describe('対応方法振り返りセリフ（2行目）', () => {
      it('夜泣きイベントがなかった場合、振り返りセリフはnull', () => {
        const result: NightCryResultForMessage = {
          hadNightCryEvent: false,
        };

        const message = generateMorningMessage(result);

        expect(message.reflectionLine).toBeNull();
      });

      it('遊んで満足で終了した場合、付き合ってあげたセリフを返す', () => {
        const result: NightCryResultForMessage = {
          hadNightCryEvent: true,
          lastAction: NightCryActionType.PLAYING,
          completedBy: 'satisfaction',
        };

        const message = generateMorningMessage(result);

        expect(message.reflectionLine).toBe('昨夜は付き合ってあげたな…');
      });

      it('撫でて満足で終了した場合、付き合ってあげたセリフを返す', () => {
        const result: NightCryResultForMessage = {
          hadNightCryEvent: true,
          lastAction: NightCryActionType.PETTING,
          completedBy: 'satisfaction',
        };

        const message = generateMorningMessage(result);

        expect(message.reflectionLine).toBe('昨夜は付き合ってあげたな…');
      });

      it('無視して諦めで終了した場合、構ってあげられなかったセリフを返す', () => {
        const result: NightCryResultForMessage = {
          hadNightCryEvent: true,
          lastAction: NightCryActionType.IGNORING,
          completedBy: 'resignation',
        };

        const message = generateMorningMessage(result);

        expect(message.reflectionLine).toBe('昨夜は構ってあげられなかった…');
      });

      it('締め出した場合、大丈夫かなセリフを返す', () => {
        const result: NightCryResultForMessage = {
          hadNightCryEvent: true,
          lastAction: NightCryActionType.LOCKED_OUT,
          completedBy: 'resignation',
        };

        const message = generateMorningMessage(result);

        expect(message.reflectionLine).toBe(
          '別の部屋に出しちゃったけど…大丈夫かな'
        );
      });

      it('おやつをあげた場合（completedByがnull）、構ってあげられなかったセリフを返す', () => {
        const result: NightCryResultForMessage = {
          hadNightCryEvent: true,
          lastAction: NightCryActionType.FEEDING_SNACK,
          completedBy: null,
        };

        const message = generateMorningMessage(result);

        expect(message.reflectionLine).toBe('昨夜は構ってあげられなかった…');
      });
    });
  });
});
