/**
 * 鳴き声再生クラス
 *
 * 猫の鳴き声を再生するためのシンプルなオーディオプレイヤーです。
 */

/** 鳴き声の音声ファイルパス */
const MEOW_AUDIO_PATH = '/assets/audio/meow.mp3';

/** デフォルト音量 */
const DEFAULT_VOLUME = 0.5;

/**
 * 鳴き声プレイヤー
 */
export class MeowPlayer {
  private static audio: HTMLAudioElement | null = null;
  private static muted: boolean = false;

  /**
   * 鳴き声を再生
   * @param volume 音量（0-1）
   */
  static async play(volume: number = DEFAULT_VOLUME): Promise<void> {
    if (this.muted) {
      return;
    }

    try {
      if (typeof Audio === 'undefined') {
        return;
      }

      this.audio = new Audio(MEOW_AUDIO_PATH);
      this.audio.volume = Math.max(0, Math.min(1, volume));
      await this.audio.play();
    } catch (error) {
      // 再生エラーは無視（ユーザー操作なしでは再生できないブラウザもある）
      console.warn('Failed to play meow audio:', error);
    }
  }

  /**
   * 再生を停止
   */
  static stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }

  /**
   * ミュート状態を設定
   * @param muted ミュート状態
   */
  static setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      this.stop();
    }
  }

  /**
   * ミュート状態を取得
   */
  static isMuted(): boolean {
    return this.muted;
  }

  /**
   * 状態をリセット（テスト用）
   */
  static reset(): void {
    this.stop();
    this.muted = false;
  }
}
