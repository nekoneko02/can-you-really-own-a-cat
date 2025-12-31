/**
 * AudioManager
 *
 * 夜泣きイベント用の音声再生管理クラス
 * Phaserの音声システムをラップし、シナリオに応じた音声再生を提供します。
 */

import { AssetKeys } from '../assets/AssetKeys';

/**
 * 音声再生の状態を表すインターフェース
 */
export interface AudioState {
  isMuted: boolean;
  volume: number;
  currentlyPlaying: string | null;
}

/**
 * 音声再生管理クラス
 */
export class AudioManager {
  private scene: Phaser.Scene;
  private currentSound: Phaser.Sound.BaseSound | null = null;
  private isMuted: boolean = false;
  private volume: number = 1.0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * 基本の夜泣き音声をループ再生
   * 設計書: 「ニャアアアア！ニャアアアア！」（5秒ループ）
   */
  playMeowLoudLoop(): void {
    this.stopCurrentSound();
    this.playSound(AssetKeys.Audio.MeowLoudLoop, { loop: true });
  }

  /**
   * 無視後のより大きな鳴き声をループ再生
   * 設計書: 鳴き声がさらに大きくなる（10秒ループ）
   */
  playMeowLouderLoop(): void {
    this.stopCurrentSound();
    this.playSound(AssetKeys.Audio.MeowLouderLoop, { loop: true });
  }

  /**
   * 早朝起こしの鳴き声を再生
   * 設計書: 「ニャー、ニャー」（3秒）
   */
  playMeowMorning(): void {
    this.stopCurrentSound();
    this.playSound(AssetKeys.Audio.MeowMorning, { loop: false });
  }

  /**
   * 壁ドンの音を再生
   * 設計書: 「ドン！ドン！」（1秒）
   */
  playWallKnock(): void {
    // 壁ドンは他の音声と同時に再生可能（currentSoundを上書きしない）
    this.playSound(AssetKeys.Audio.WallKnock, { loop: false }, false);
  }

  /**
   * 現在再生中の音声を停止
   */
  stopCurrentSound(): void {
    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound = null;
    }
  }

  /**
   * すべての音声を停止
   */
  stopAll(): void {
    this.stopCurrentSound();
    this.scene.sound.stopAll();
  }

  /**
   * ミュート状態を設定
   * @param muted ミュートするかどうか
   */
  setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.scene.sound.mute = muted;
  }

  /**
   * ミュート状態を取得
   */
  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * 音量を設定
   * @param volume 音量（0.0 - 1.0）
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.scene.sound.volume = this.volume;
  }

  /**
   * 音量を取得
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * 現在の音声再生状態を取得
   */
  getState(): AudioState {
    return {
      isMuted: this.isMuted,
      volume: this.volume,
      currentlyPlaying: this.currentSound ? (this.currentSound as any).key : null,
    };
  }

  /**
   * 音声が読み込まれているかどうかを確認
   * @param key 音声キー
   */
  isAudioLoaded(key: string): boolean {
    return this.scene.cache.audio.exists(key);
  }

  /**
   * 内部: 音声を再生
   * @param key 音声キー
   * @param config 再生設定
   * @param setAsCurrent currentSoundとして設定するかどうか
   */
  private playSound(
    key: string,
    config: { loop: boolean },
    setAsCurrent: boolean = true
  ): void {
    // 音声が読み込まれていない場合はログを出して何もしない
    if (!this.isAudioLoaded(key)) {
      console.warn(`[AudioManager] 音声が読み込まれていません: ${key}`);
      return;
    }

    const sound = this.scene.sound.add(key, {
      loop: config.loop,
      volume: this.volume,
      mute: this.isMuted,
    });

    sound.play();

    if (setAsCurrent) {
      this.currentSound = sound;
    }
  }

  /**
   * AudioManagerを破棄
   */
  destroy(): void {
    this.stopAll();
    this.currentSound = null;
  }
}
