/**
 * MeowPlayer のテスト
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { MeowPlayer } from '@/lib/audio/MeowPlayer';

// Audio APIのモック
const mockPlay = jest.fn().mockResolvedValue(undefined);
const mockPause = jest.fn();

class MockAudio {
  src: string = '';
  volume: number = 1;
  play = mockPlay;
  pause = mockPause;
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
}

// グローバルにAudioをモック
(global as unknown as { Audio: typeof MockAudio }).Audio = MockAudio;

describe('MeowPlayer', () => {
  beforeEach(() => {
    mockPlay.mockClear();
    mockPause.mockClear();
    MeowPlayer.reset();
  });

  describe('play', () => {
    it('鳴き声を再生できる', async () => {
      await MeowPlayer.play();

      expect(mockPlay).toHaveBeenCalled();
    });

    it('音量を設定して再生できる', async () => {
      await MeowPlayer.play(0.5);

      expect(mockPlay).toHaveBeenCalled();
    });

    it('ミュート状態では再生しない', async () => {
      MeowPlayer.setMuted(true);

      await MeowPlayer.play();

      expect(mockPlay).not.toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('再生を停止できる', async () => {
      await MeowPlayer.play();
      MeowPlayer.stop();

      expect(mockPause).toHaveBeenCalled();
    });
  });

  describe('setMuted', () => {
    it('ミュート状態を設定できる', () => {
      MeowPlayer.setMuted(true);
      expect(MeowPlayer.isMuted()).toBe(true);

      MeowPlayer.setMuted(false);
      expect(MeowPlayer.isMuted()).toBe(false);
    });
  });

  describe('isMuted', () => {
    it('初期状態はミュートではない', () => {
      expect(MeowPlayer.isMuted()).toBe(false);
    });
  });
});
