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
import { EventScenario } from './EventScenario';
import { EventStep } from './EventStep';
import { EventScheduler } from './EventScheduler';
import { createNightCryingDay1Scenario } from '@/data/scenarios/nightCryingDay1';

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
  private player: Player;
  private cat: Cat;
  private currentEvent: GameEvent | null;
  private currentScenario: EventScenario | null;
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
    this.player = new Player({ x: 100, y: 100 });
    this.cat = new Cat({ name: params.catName, x: 200, y: 200 });
    this.currentEvent = null;
    this.currentScenario = null;
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
  }

  /**
   * 朝フェーズに移行
   */
  public transitionToMorning(): void {
    this.currentPhase = GamePhase.MORNING_OUTRO;
    this.currentTime = 700; // 7:00

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

    // イベント関連フラグをリセット
    this.currentScenario = null;
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
    // 既にシナリオが発生している場合はスキップ
    if (this.currentScenario !== null) {
      return;
    }

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
      this.currentScenario = this.loadEventScenario(eventId);
      console.log('[Game] シナリオを発火しました:', eventId, '(Day:', this.currentDay, ')');
    }
  }

  /**
   * イベントIDに応じたシナリオをロード
   */
  private loadEventScenario(eventId: string): EventScenario {
    // MVP版: すべて同じシナリオを返す（初日のシナリオ）
    // 将来的には eventId に応じて異なるシナリオを返す
    return createNightCryingDay1Scenario();
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
    // シナリオがある場合はシナリオの選択を実行
    if (this.currentScenario) {
      console.log('[Game] 選択肢を実行します:', choiceId);

      // シナリオの選択肢を実行
      const result = this.currentScenario.executeChoice(choiceId);

      // 結果を適用
      const consequence = result.consequence;

      // 猫のステータスを更新
      if (consequence.catStateChanges) {
        this.catStatusManager.updateStatus(consequence.catStateChanges);
      }

      // プレイヤーの統計を更新
      if (consequence.playerStatsChanges) {
        this.playerStats.incrementInterruptions();
      }

      console.log('[Game] 選択肢の結果を適用しました');
      console.log('  - 猫のステータス:', this.catStatusManager.getStatus());
      console.log('  - プレイヤーの統計:', this.playerStats);

      // シナリオが完了した場合
      if (result.isCompleted) {
        this.currentScenario = null;
        this.isWaitingForEmotion = true;
        console.log('[Game] シナリオを完了しました。気持ち入力を待ちます。');
      } else {
        console.log('[Game] 次のステップ:', result.nextStepId);
      }

      return;
    }

    // 従来のイベント処理
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
   * 現在のシナリオステップを取得
   */
  public getCurrentScenarioStep(): EventStep | null {
    return this.currentScenario?.getCurrentStep() ?? null;
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
    this.currentScenario = null;
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
