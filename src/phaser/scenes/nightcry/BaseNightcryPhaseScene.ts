/**
 * BaseNightcryPhaseScene
 *
 * 夜泣きシナリオの各フェーズシーンの共通ベースクラス。
 * 共通描写 → 選択肢 → 即時反映 → 合流・締めの流れを制御します。
 */

import Phaser from 'phaser';
import { DialogSystem, DialogData } from '@/phaser/ui/DialogSystem';
import { ChoiceButton } from '@/phaser/ui/ChoiceButton';
import { UILayout } from '@/phaser/ui/UIConstants';
import { NightcryScenarioManager } from '@/domain/scenarios/nightcry/NightcryScenarioManager';
import { NightcryScenarioState, PhaseNumber, PhaseSelection } from '@/domain/scenarios/nightcry/NightcryScenarioState';
import { AudioManager } from '@/phaser/audio/AudioManager';
import { NightCryAudioController } from '@/phaser/audio/NightCryAudioController';

/**
 * 選択肢の定義
 */
export interface PhaseChoice {
  id: PhaseSelection;
  label: string;
}

/**
 * フェーズのコンテンツ定義
 */
export interface PhaseContent {
  /** 共通描写テキスト（ページごとに分割） */
  commonText: string[];
  /** 選択肢（A, B, C） */
  choices: PhaseChoice[];
  /** 即時反映テキスト（選択肢ごと） */
  immediateResponses: {
    A: string;
    B: string;
    C: string;
  };
  /** 合流・締めテキスト（ページごとに分割） */
  endingText: string[];
  /** 音声再生有無 */
  hasAudio: boolean;
}

/**
 * シーン起動パラメータ
 */
export interface NightcryPhaseSceneParams {
  scenarioState: NightcryScenarioState;
}

/**
 * 夜泣きフェーズシーンの基底クラス
 */
export abstract class BaseNightcryPhaseScene extends Phaser.Scene {
  protected dialogSystem!: DialogSystem;
  protected choiceButtons: ChoiceButton[] = [];
  protected scenarioState!: NightcryScenarioState;
  protected audioManager?: AudioManager;
  protected audioController?: NightCryAudioController;

  // 背景
  protected background!: Phaser.GameObjects.Graphics;

  constructor(sceneKey: string) {
    super({ key: sceneKey });
  }

  /**
   * フェーズ番号を返す（サブクラスで実装）
   */
  abstract getPhaseNumber(): PhaseNumber;

  /**
   * フェーズのコンテンツを返す（サブクラスで実装）
   */
  abstract getPhaseContent(): PhaseContent;

  /**
   * 次のシーンキーを返す（サブクラスで実装）
   */
  abstract getNextSceneKey(): string;

  /**
   * シーン初期化
   */
  init(data: NightcryPhaseSceneParams): void {
    console.log(`[${this.scene.key}] 初期化開始`, data);

    // シナリオ状態を取得（なければ初期状態を作成）
    this.scenarioState = data?.scenarioState ?? NightcryScenarioManager.createInitialState();

    // AudioManagerを取得（存在する場合）
    const audioMgr = this.registry.get('audioManager') as AudioManager | undefined;
    if (audioMgr) {
      this.audioManager = audioMgr;
      this.audioController = new NightCryAudioController(audioMgr);
    }

    console.log(`[${this.scene.key}] 初期化完了`);
  }

  /**
   * シーン作成
   */
  create(): void {
    console.log(`[${this.scene.key}] シーン作成開始`);

    // 背景を作成
    this.createBackground();

    // ダイアログシステムを初期化
    this.dialogSystem = new DialogSystem(this);

    // フェードインで開始
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // 音声を再生（該当フェーズのみ）
    const content = this.getPhaseContent();
    if (content.hasAudio && this.audioController) {
      this.audioController.onEventStart();
    }

    // 共通描写を表示
    this.showCommonText();

    console.log(`[${this.scene.key}] シーン作成完了`);
  }

  /**
   * 背景を作成（夜のシーン）
   */
  protected createBackground(): void {
    this.background = this.add.graphics();
    this.background.fillStyle(0x0a0a1a, 1); // 非常に暗い青
    this.background.fillRect(0, 0, UILayout.screen.width, UILayout.screen.height);

    // 星を表示
    this.createStars();
  }

  /**
   * 星を表示
   */
  protected createStars(): void {
    const stars = this.add.graphics();
    stars.fillStyle(0xffffff, 0.6);

    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, UILayout.screen.width);
      const y = Phaser.Math.Between(0, UILayout.playArea.height);
      const radius = Phaser.Math.Between(1, 2);
      stars.fillCircle(x, y, radius);
    }
  }

  /**
   * 共通描写テキストを表示
   */
  protected showCommonText(): void {
    const content = this.getPhaseContent();

    const dialogData: DialogData = {
      pages: content.commonText.map((text) => ({ text })),
    };

    this.dialogSystem.showPages(dialogData, () => {
      // 共通描写完了後、選択肢を表示
      this.showChoices();
    });
  }

  /**
   * 選択肢を表示
   */
  protected showChoices(): void {
    const content = this.getPhaseContent();

    // ダイアログを非表示
    this.dialogSystem.hide();

    // 選択肢ボタンを作成
    content.choices.forEach((choice, index) => {
      const x = UILayout.choiceButton.x;
      const y = UILayout.choiceButton.startY + index * UILayout.choiceButton.spacing;

      const button = new ChoiceButton(this, x, y, choice.label, () => {
        this.onChoiceSelected(choice.id);
      });

      this.choiceButtons.push(button);
    });
  }

  /**
   * 選択肢が選ばれた時の処理
   */
  protected onChoiceSelected(selection: PhaseSelection): void {
    console.log(`[${this.scene.key}] 選択: ${selection}`);

    // 選択肢ボタンを非表示
    this.choiceButtons.forEach((button) => button.destroy());
    this.choiceButtons = [];

    // 選択をシナリオ状態に記録
    this.scenarioState = NightcryScenarioManager.recordSelection(
      this.scenarioState,
      this.getPhaseNumber(),
      selection
    );

    // 音声を停止（該当フェーズのみ）
    const content = this.getPhaseContent();
    if (content.hasAudio && this.audioController) {
      this.audioController.onEventComplete();
    }

    // 即時反映テキストを表示
    this.showImmediateResponse(selection);
  }

  /**
   * 即時反映テキストを表示
   */
  protected showImmediateResponse(selection: PhaseSelection): void {
    if (!selection) return;

    const content = this.getPhaseContent();
    const responseText = content.immediateResponses[selection];

    const dialogData: DialogData = {
      pages: [{ text: responseText }],
    };

    this.dialogSystem.showPages(dialogData, () => {
      // 即時反映完了後、合流テキストを表示
      this.showEndingText();
    });
  }

  /**
   * 合流・締めテキストを表示
   */
  protected showEndingText(): void {
    const content = this.getPhaseContent();

    // 合流テキストがない場合は次のシーンへ
    if (content.endingText.length === 0) {
      this.transitionToNextScene();
      return;
    }

    const dialogData: DialogData = {
      pages: content.endingText.map((text) => ({ text })),
    };

    this.dialogSystem.showPages(dialogData, () => {
      // 合流テキスト完了後、次のシーンへ遷移
      this.transitionToNextScene();
    });
  }

  /**
   * 次のシーンへ遷移
   */
  protected transitionToNextScene(): void {
    console.log(`[${this.scene.key}] 次のシーンへ遷移: ${this.getNextSceneKey()}`);

    // フェーズを進行（Phase5以外）
    if (this.getPhaseNumber() < 5) {
      this.scenarioState = NightcryScenarioManager.advancePhase(this.scenarioState);
    } else {
      // Phase5完了時はシナリオを完了状態に
      this.scenarioState = NightcryScenarioManager.completeScenario(this.scenarioState);
    }

    // フェードアウト
    this.cameras.main.fadeOut(500, 0, 0, 0);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(this.getNextSceneKey(), {
        scenarioState: this.scenarioState,
      } as NightcryPhaseSceneParams);
    });
  }

  /**
   * シーン破棄時のクリーンアップ
   */
  shutdown(): void {
    console.log(`[${this.scene.key}] シャットダウン`);

    // ダイアログを破棄
    this.dialogSystem?.destroy();

    // 選択肢ボタンを破棄
    this.choiceButtons.forEach((button) => button.destroy());
    this.choiceButtons = [];

    // 音声を停止
    this.audioController?.stopAll();
  }
}
