/**
 * ゲーム本体
 *
 * ゲーム全体の状態を管理し、ビジネスロジックの中核を担います。
 */

import { GamePhase, TimeOfDay } from './types';
import { Player } from './Player';
import { Cat } from './Cat';
import { GameEvent } from './GameEvent';
import { CatStatusManager } from './CatStatusManager';
import { PlayerStats } from './PlayerStats';
import { EventRecord, EmotionData } from './EventRecord';
import { Choice } from './Choice';
import { Consequence } from './Consequence';
import { EventStep } from './EventStep';
import { EventScheduler } from './EventScheduler';

const MAX_DAYS = 7;

export interface GameParams {
  scenarioId: string;
  catName?: string;
}

export interface RecordEmotionParams {
  eventId: string;
  choiceId: string;
  emotion: EmotionData;
}

export class Game {
  private scenarioId: string;
  private currentPhase: GamePhase;
  private currentDay: number;
  private currentTime: number; // 時刻（24時間形式の数値、例: 2200 = 22:00）
  private timeScale: number; // 時間スケール（1.0 = 等倍）
  private accumulatedMs: number; // 累積ミリ秒（1分未満の端数）
  private player: Player;
  private cat: Cat;
  private currentEvent: GameEvent | null;
  private eventHistory: EventRecord[];
  private catStatusManager: CatStatusManager;
  private playerStats: PlayerStats;
  private isWaitingForEmotion: boolean;
  private eventScheduler: EventScheduler;

  constructor(params: GameParams) {
    this.scenarioId = params.scenarioId;
    this.currentPhase = GamePhase.NIGHT_PREP;
    this.currentDay = 1;
    this.currentTime = 2200; // 22:00から開始
    this.timeScale = 1.0; // デフォルトは等倍
    this.accumulatedMs = 0;
    this.player = new Player({ x: 100, y: 100 });
    this.cat = new Cat({ name: params.catName, x: 200, y: 200 });
    this.currentEvent = null;
    this.eventHistory = [];
    this.catStatusManager = new CatStatusManager();
    this.playerStats = new PlayerStats();
    this.isWaitingForEmotion = false;
    this.eventScheduler = new EventScheduler();
  }

  /**
   * 現在のフェーズを取得
   */
  public getPhase(): GamePhase {
    return this.currentPhase;
  }

  /**
   * 現在の日を取得
   */
  public getCurrentDay(): number {
    return this.currentDay;
  }

  /**
   * 現在の時刻を取得
   */
  public getCurrentTime(): number {
    return this.currentTime;
  }

  /**
   * 時間スケールを設定
   * @param scale スケール倍率（1.0 = 等倍、30.0 = 30倍速）
   */
  public setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale);
  }

  /**
   * 時刻を進める
   * @param deltaMs 経過ミリ秒（実時間）
   */
  public updateTime(deltaMs: number): void {
    // スケールを適用した経過時間
    const scaledMs = deltaMs * this.timeScale;
    this.accumulatedMs += scaledMs;

    // 1分（60000ms）ごとに時刻を進める
    const minutesToAdd = Math.floor(this.accumulatedMs / 60000);
    if (minutesToAdd > 0) {
      this.accumulatedMs -= minutesToAdd * 60000;
      this.currentTime = this.addMinutesToTime(this.currentTime, minutesToAdd);
    }
  }

  /**
   * 時刻に分を加算（HHMM形式）
   * @param time 時刻（HHMM形式）
   * @param minutes 加算する分
   * @returns 加算後の時刻（HHMM形式）
   */
  private addMinutesToTime(time: number, minutes: number): number {
    const hours = Math.floor(time / 100);
    const mins = time % 100;

    let totalMinutes = hours * 60 + mins + minutes;

    // 24時間を超えた場合は翌日に
    totalMinutes = totalMinutes % (24 * 60);

    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;

    return newHours * 100 + newMins;
  }

  /**
   * イベント履歴を取得
   */
  public getEventHistory(): EventRecord[] {
    return this.eventHistory;
  }

  /**
   * 夜中フェーズに移行
   */
  public transitionToMidnight(): void {
    this.currentPhase = GamePhase.MIDNIGHT_EVENT;
    this.currentTime = 300; // 3:00
    this.timeScale = 1.0; // スケールをリセット
    this.accumulatedMs = 0; // 累積時間をリセット
  }

  /**
   * 朝フェーズに移行
   */
  public transitionToMorning(): void {
    this.currentPhase = GamePhase.MORNING_OUTRO;
    this.currentTime = 700; // 7:00
    this.timeScale = 1.0; // スケールをリセット
    this.accumulatedMs = 0; // 累積時間をリセット

    // イベント関連フラグをリセット
    this.isWaitingForEmotion = false;
    console.log('[Game] 朝フェーズに移行しました。フラグをリセットしました。');
  }

  /**
   * 次の日に進む
   */
  public advanceToNextDay(): void {
    this.currentDay += 1;

    if (this.currentDay > MAX_DAYS) {
      this.currentPhase = GamePhase.GAME_END;
    } else {
      this.currentPhase = GamePhase.NIGHT_PREP;
      this.currentTime = 2200; // 22:00
    }
    this.timeScale = 1.0; // スケールをリセット
    this.accumulatedMs = 0; // 累積時間をリセット

    // イベント関連フラグをリセット
    this.currentEvent = null;
    this.isWaitingForEmotion = false;
    console.log('[Game] 次の日に進みました。イベントフラグをリセットしました。');
  }

  /**
   * プレイヤーの感情を記録
   */
  public recordEmotion(params: RecordEmotionParams): void {
    const record: EventRecord = {
      eventId: params.eventId,
      day: this.currentDay,
      choiceId: params.choiceId,
      emotion: params.emotion,
      timestamp: Date.now(),
    };

    this.eventHistory.push(record);
  }

  /**
   * イベントをトリガーする（MVP版では簡略化）
   */
  public checkEventTrigger(): void {
    // 既にイベントが発生している場合はスキップ
    if (this.currentEvent !== null) {
      return;
    }

    // 夜中フェーズでのみイベントを発火
    if (this.currentPhase !== GamePhase.MIDNIGHT_EVENT) {
      return;
    }

    // Phase 6: EventSchedulerを使ってスケジュール判定
    const eventId = this.eventScheduler.getEventIdForDay(this.currentDay);
    if (eventId) {
      // 夜泣きイベントはNightCryManagerで処理するため、currentEventのみ設定
      this.currentEvent = new GameEvent({
        id: eventId,
        title: '夜泣き',
        description: '猫が夜中に鳴いています',
        catStateDescription: ['猫が夜中に鳴いています'],
        day: this.currentDay,
        timeOfDay: TimeOfDay.MIDNIGHT, // 夜泣きは夜中に発生
        choices: [], // NightCryManagerで処理するため空
      });
      console.log('[Game] イベントを発火しました:', eventId, '(Day:', this.currentDay, ')');
    }
  }

  /**
   * テストイベントを作成（MVP版）
   */
  private createTestEvent(): GameEvent {
    const choices: Choice[] = [
      new Choice({
        id: 'wait',
        text: '様子を見る（寝たふりをする）',
        consequenceText: 'あなたは寝たふりを続けました。猫は諦めて眠り始めました。',
        execute: () =>
          new Consequence({
            catStateChanges: { affection: -5, stress: 5 },
            playerStatsChanges: {},
            eventCompleted: true,
            text: 'あなたは寝たふりを続けました。猫は諦めて眠り始めました。',
          }),
      }),
      new Choice({
        id: 'catch',
        text: '起きて捕まえる',
        consequenceText: 'あなたは起きて猫を捕まえました。猫は少し不満そうです。',
        execute: () =>
          new Consequence({
            catStateChanges: { affection: -10, stress: 10 },
            playerStatsChanges: {},
            eventCompleted: true,
            text: 'あなたは起きて猫を捕まえました。猫は少し不満そうです。',
          }),
      }),
    ];

    return new GameEvent({
      id: 'test_event_midnight',
      day: this.currentDay,
      timeOfDay: TimeOfDay.MIDNIGHT,
      title: '深夜の運動会',
      description: '夜中の3時、猫が突然走り回り始めました。バタバタという音で目が覚めてしまいました。',
      catStateDescription: ['機嫌は良さそうに見える', '少し落ち着きがないようだ', '元気そうだ'],
      choices,
    });
  }

  /**
   * 選択肢を実行（MVP版）
   * @param choiceId 選択肢のID
   */
  public executeChoice(choiceId: string): void {
    // イベント処理
    if (!this.currentEvent) {
      console.warn('[Game] イベントが発生していません');
      return;
    }

    // 選択肢を検索
    const choice = this.currentEvent.choices.find((c) => c.id === choiceId);
    if (!choice) {
      console.error('[Game] 選択肢が見つかりません:', choiceId);
      return;
    }

    console.log('[Game] 選択肢を実行します:', choiceId);

    // 選択肢を実行して結果を取得
    const consequence = choice.execute();

    // 猫のステータスを更新
    if (consequence.catStateChanges) {
      this.catStatusManager.updateStatus(consequence.catStateChanges);
    }

    // プレイヤーの統計を更新
    if (consequence.playerStatsChanges) {
      // interruptionCountをインクリメント
      this.playerStats.incrementInterruptions();
    }

    console.log('[Game] 選択肢の結果を適用しました');
    console.log('  - 猫のステータス:', this.catStatusManager.getStatus());
    console.log('  - プレイヤーの統計:', this.playerStats);

    // イベントを完了状態にする
    this.currentEvent = null;

    console.log('[Game] イベントを完了しました');
  }

  /**
   * 現在のイベントを完了状態にする（夜泣きイベント専用）
   */
  public completeCurrentEvent(): void {
    if (!this.currentEvent) {
      console.warn('[Game] 完了すべきイベントがありません');
      return;
    }

    console.log('[Game] 現在のイベントを完了しました:', this.currentEvent.id);
    this.currentEvent = null;
  }

  /**
   * 現在のシナリオステップを取得
   * @deprecated 旧EventScenarioシステムは廃止されました
   */
  public getCurrentScenarioStep(): EventStep | null {
    return null;
  }

  /**
   * 気持ち入力待ちか判定
   */
  public isWaitingForEmotionInput(): boolean {
    return this.isWaitingForEmotion;
  }

  /**
   * 気持ちを記録（拡張版）
   */
  public recordEmotionForCurrentEvent(emotion: EmotionData): void {
    if (!this.isWaitingForEmotion) {
      console.warn('[Game] 気持ち入力待ち状態ではありません');
      return;
    }

    // イベント履歴に記録
    const record: EventRecord = {
      eventId: 'night_crying_day1', // 暫定: 現在のイベントIDを使う
      day: this.currentDay,
      choiceId: 'scenario_completed',
      emotion,
      timestamp: Date.now(),
    };

    this.eventHistory.push(record);

    // 気持ち入力完了 = シナリオ完了
    this.isWaitingForEmotion = false;
    this.currentEvent = null;

    console.log('[Game] 気持ちを記録しました。シナリオを完了しました。', emotion);
  }

  /**
   * プレイヤーの入力を処理（MVP版では簡略化）
   */
  public update(): void {
    // イベントトリガーをチェック
    this.checkEventTrigger();
  }

  /**
   * プレイヤーの行動パターンを分析（MVP版ではスタブ）
   */
  public analyzePlayerBehavior(): string {
    return 'パターン分析未実装';
  }
}
