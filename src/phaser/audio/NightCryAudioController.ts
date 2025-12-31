/**
 * NightCryAudioController
 *
 * 夜泣きイベントの状態に応じた音声再生を制御するコントローラー
 * NightCryActionTypeに基づいて適切な音声を再生します。
 */

import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';
import { AudioManager } from './AudioManager';

/**
 * 夜泣きイベント音声コントローラー
 */
export class NightCryAudioController {
  private audioManager: AudioManager;
  private isEventActive: boolean = false;
  private hasPlayedWallKnock: boolean = false;

  constructor(audioManager: AudioManager) {
    this.audioManager = audioManager;
  }

  /**
   * 夜泣きイベント開始時の音声を再生
   * 設計書: 「ニャアアアア！ニャアアアア！」（長く激しい鳴き声）
   */
  onEventStart(): void {
    this.isEventActive = true;
    this.hasPlayedWallKnock = false;
    this.audioManager.playMeowLoudLoop();
  }

  /**
   * アクション変更時の音声制御
   * @param actionType 現在のアクションタイプ
   */
  onActionChange(actionType: NightCryActionType | null): void {
    if (!this.isEventActive) {
      return;
    }

    switch (actionType) {
      case NightCryActionType.IGNORING:
        // 無視を選択: より大きな鳴き声に切り替え
        this.audioManager.playMeowLouderLoop();
        // 壁ドンを再生（初回のみ）
        if (!this.hasPlayedWallKnock) {
          this.hasPlayedWallKnock = true;
          // 少し遅延させて壁ドンを再生
          setTimeout(() => {
            this.audioManager.playWallKnock();
          }, 2000);
        }
        break;

      case NightCryActionType.PLAYING:
      case NightCryActionType.PETTING:
        // 遊ぶ・撫でる: 鳴き声が収まる（音声停止）
        this.audioManager.stopCurrentSound();
        break;

      case NightCryActionType.CATCHING:
        // 捕まえる: 基本の鳴き声を継続
        this.audioManager.playMeowLoudLoop();
        break;

      case NightCryActionType.LOCKED_OUT:
        // 締め出し: 鳴き声が少し小さくなる（実際には同じ音声を継続）
        // 設計書: 「ニャアアア...ニャアアア...」（少し小さめ）
        // TODO: 音量を下げるか、別の音声を用意する
        break;

      case NightCryActionType.FEEDING_SNACK:
        // おやつ: 一時的に停止→すぐにまた鳴き始める
        this.audioManager.stopCurrentSound();
        setTimeout(() => {
          if (this.isEventActive) {
            this.audioManager.playMeowLoudLoop();
          }
        }, 1000);
        break;

      case NightCryActionType.STOP_CARE:
      case NightCryActionType.RETURN_CAT:
        // やめる・戻す: 基本の鳴き声を再開
        this.audioManager.playMeowLoudLoop();
        break;

      default:
        // その他: 基本の鳴き声
        if (actionType === null) {
          this.audioManager.playMeowLoudLoop();
        }
        break;
    }
  }

  /**
   * 夜泣きイベント完了時の音声停止
   */
  onEventComplete(): void {
    this.isEventActive = false;
    this.audioManager.stopCurrentSound();
  }

  /**
   * 早朝起こしイベントの音声を再生
   * 設計書: 「ニャー、ニャー」（3秒）
   */
  playMorningMeow(): void {
    this.audioManager.playMeowMorning();
  }

  /**
   * すべての音声を停止
   */
  stopAll(): void {
    this.isEventActive = false;
    this.audioManager.stopAll();
  }

  /**
   * ミュート状態を設定
   */
  setMuted(muted: boolean): void {
    this.audioManager.setMuted(muted);
  }

  /**
   * ミュート状態を取得
   */
  getMuted(): boolean {
    return this.audioManager.getMuted();
  }

  /**
   * コントローラーを破棄
   */
  destroy(): void {
    this.stopAll();
  }
}
