/**
 * NightCryUIManager
 *
 * 夜泣きイベント専用のUI管理クラス
 * EventScenarioとは独立した、時間ベースのアクションシステム用UI
 */

import { Cat } from '@/domain/Cat';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';
import { DialogSystem } from './DialogSystem';
import { ChoiceButton } from './ChoiceButton';
import { UILayout } from './UIConstants';

/**
 * 夜泣きイベントの状態（DTO）
 */
export interface NightCryEventState {
  isActive: boolean;
  isCompleted: boolean;
  currentAction: NightCryActionType | null;
  satisfaction: number;
  resignation: number;
}

export class NightCryUIManager {
  private scene: Phaser.Scene;
  private dialogSystem: DialogSystem;
  private choiceButtons: ChoiceButton[] = [];
  private isActive: boolean = false;
  private onActionSelected: ((actionType: NightCryActionType) => void) | null = null;
  private currentCat: Cat | null = null;
  private currentState: NightCryEventState | null = null;
  private availableActions: NightCryActionType[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.dialogSystem = new DialogSystem(scene);
  }

  /**
   * 夜泣きイベントUIを表示（レガシー：Catエンティティを使用）
   * @param cat 猫エンティティ
   * @param onActionSelected アクション選択時のコールバック
   * @deprecated showWithState を使用してください
   */
  show(cat: Cat, onActionSelected: (actionType: NightCryActionType) => void): void {
    // Catエンティティから状態を抽出してshowWithStateを呼び出す
    const state: NightCryEventState = {
      isActive: true,
      isCompleted: false,
      currentAction: cat.nightCryState.currentAction,
      satisfaction: cat.nightCryState.satisfaction,
      resignation: cat.nightCryState.resignation,
    };
    this.currentCat = cat;
    this.showWithState(state, onActionSelected);
  }

  /**
   * 夜泣きイベントUIを表示（新方式：状態DTOを使用）
   * @param state 夜泣きイベント状態
   * @param onActionSelected アクション選択時のコールバック
   * @param availableActions 選択可能なアクション一覧（ドメイン層から取得）
   */
  showWithState(
    state: NightCryEventState,
    onActionSelected: (actionType: NightCryActionType) => void,
    availableActions?: NightCryActionType[]
  ): void {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.onActionSelected = onActionSelected;
    this.currentState = state;
    this.availableActions = availableActions || [];

    // 現在のアクション状態に応じたメッセージを表示
    const currentAction = state.currentAction;

    if (currentAction === null) {
      // 初期状態：猫が鳴いている
      this.showInitialDialog();
      this.showInitialChoices();
    } else {
      // アクション実行中
      this.showActionInProgressDialogFromState(currentAction, state);
      this.showActionInProgressChoices(currentAction);
    }
  }

  /**
   * 夜泣きイベントUIを非表示
   */
  hide(): void {
    this.isActive = false;
    this.onActionSelected = null;
    this.currentCat = null;
    this.currentState = null;
    this.dialogSystem.hide();
    this.clearChoiceButtons();
  }

  /**
   * UIが表示されているか
   */
  isShown(): boolean {
    return this.isActive;
  }

  /**
   * 初期ダイアログを表示
   */
  private showInitialDialog(): void {
    this.dialogSystem.show(
      '夜中の訪問者',
      `【夜中 3:00】

「ニャアアアア！ニャアアアア！」

猫が大声で鳴いています。
時計を見ると、3時です。

明日は朝9時から予定があります。

どうしますか？`,
      []
    );
  }

  /**
   * アクション実行中のダイアログを表示（レガシー）
   * @deprecated showActionInProgressDialogFromState を使用してください
   */
  private showActionInProgressDialog(actionType: NightCryActionType, cat: Cat): void {
    const state: NightCryEventState = {
      isActive: true,
      isCompleted: false,
      currentAction: cat.nightCryState.currentAction,
      satisfaction: cat.nightCryState.satisfaction,
      resignation: cat.nightCryState.resignation,
    };
    this.showActionInProgressDialogFromState(actionType, state);
  }

  /**
   * アクション実行中のダイアログを表示（新方式）
   */
  private showActionInProgressDialogFromState(actionType: NightCryActionType, state: NightCryEventState): void {
    let description = '';
    const satisfaction = Math.floor(state.satisfaction * 100);
    const resignation = Math.floor(state.resignation * 100);

    switch (actionType) {
      case NightCryActionType.PLAYING:
        description = `遊んでいます...

満足度: ${satisfaction}%

猫は楽しそうに遊んでいます。`;
        break;
      case NightCryActionType.PETTING:
        description = `撫でています...

満足度: ${satisfaction}%

猫は気持ちよさそうにしています。`;
        break;
      case NightCryActionType.IGNORING:
        description = `無視しています...

諦め度: ${resignation}%

猫は鳴き続けています...`;
        break;
      case NightCryActionType.CATCHING:
        description = `猫を捕まえようとしています...

猫は逃げ回っています！`;
        break;
      case NightCryActionType.LOCKED_OUT:
        description = `猫を締め出しています...

諦め度: ${resignation}%

ドア越しに鳴き声が聞こえます...`;
        break;
      case NightCryActionType.FEEDING_SNACK:
        description = `おやつをあげました。

猫はおやつを食べましたが、
すぐにまた鳴き始めました。`;
        break;
    }

    this.dialogSystem.show('', description, []);
  }

  /**
   * 初期選択肢を表示
   *
   * 階層構造:
   * - 起きて様子を見る → 第2階層（遊ぶ、撫でる、おやつ、やっぱり寝る）
   * - 猫を別の部屋に追い出す → 猫を捕まえるモードへ
   */
  private showInitialChoices(): void {
    const choices = [
      { text: '起きて様子を見る', action: 'WAKE_UP' as any },
      { text: '猫を別の部屋に追い出す', action: 'TRY_TO_CATCH' as any },
    ];

    this.createChoiceButtons(choices);
  }

  /**
   * アクション実行中の選択肢を表示
   *
   * ドメイン層から渡された選択可能なアクション（availableActions）を使用して
   * 選択肢を表示する。UI固有の階層構造（初期選択肢、第2階層など）も考慮する。
   */
  private showActionInProgressChoices(actionType: NightCryActionType): void {
    // ドメイン層から選択可能なアクションが渡されている場合はそれを使用
    if (this.availableActions.length > 0) {
      this.showChoicesFromAvailableActions();
      return;
    }

    // 後方互換: availableActionsが渡されていない場合は従来のロジック
    const choices: Array<{ text: string; action: NightCryActionType | 'WAKE_UP' | 'TRY_TO_CATCH' }> = [];

    switch (actionType) {
      case NightCryActionType.PLAYING:
      case NightCryActionType.PETTING:
        choices.push({ text: 'やめる', action: NightCryActionType.STOP_CARE });
        break;
      case NightCryActionType.IGNORING:
        this.showInitialChoices();
        return;
      case NightCryActionType.FEEDING_SNACK:
        this.showSecondLevelChoices();
        return;
      case NightCryActionType.CATCHING:
        break;
      case NightCryActionType.LOCKED_OUT:
        choices.push(
          { text: 'やっぱり猫を部屋に戻す', action: NightCryActionType.RETURN_CAT }
        );
        break;
      case NightCryActionType.STOP_CARE:
      case NightCryActionType.RETURN_CAT:
        // やめる/戻す後は第2階層の選択肢を表示
        this.showSecondLevelChoices();
        return;
    }

    if (choices.length > 0) {
      this.createChoiceButtons(choices);
    }
  }

  /**
   * ドメイン層から渡された選択可能なアクションを表示
   */
  private showChoicesFromAvailableActions(): void {
    const choices: Array<{ text: string; action: NightCryActionType }> = [];

    for (const action of this.availableActions) {
      const label = this.getActionLabel(action);
      if (label) {
        choices.push({ text: label, action });
      }
    }

    if (choices.length > 0) {
      this.createChoiceButtons(choices);
    }
  }

  /**
   * アクションタイプに対応するラベルを取得
   */
  private getActionLabel(action: NightCryActionType): string | null {
    switch (action) {
      case NightCryActionType.PLAYING:
        return '遊んであげる';
      case NightCryActionType.PETTING:
        return '撫でてあげる';
      case NightCryActionType.FEEDING_SNACK:
        return 'おやつをあげる';
      case NightCryActionType.IGNORING:
        return 'やっぱり無視して寝る';
      case NightCryActionType.CATCHING:
        return '猫を別の部屋に追い出す';
      case NightCryActionType.STOP_CARE:
        return 'やめる';
      case NightCryActionType.RETURN_CAT:
        return 'やっぱり猫を部屋に戻す';
      case NightCryActionType.LOCKED_OUT:
        return null; // LOCKED_OUTは選択肢として表示しない
      default:
        return null;
    }
  }

  /**
   * 第2階層の選択肢を表示（起きて様子を見た後）
   */
  private showSecondLevelChoices(): void {
    const choices = [
      { text: '遊んであげる', action: NightCryActionType.PLAYING },
      { text: '撫でてあげる', action: NightCryActionType.PETTING },
      { text: 'おやつをあげる', action: NightCryActionType.FEEDING_SNACK },
      { text: 'やっぱり無視して寝る', action: NightCryActionType.IGNORING },
    ];

    this.createChoiceButtons(choices);
  }

  /**
   * 選択肢ボタンを生成
   */
  private createChoiceButtons(choices: Array<{ text: string; action: NightCryActionType | 'WAKE_UP' | 'TRY_TO_CATCH' }>): void {
    this.clearChoiceButtons();

    const buttonX = UILayout.choiceButton.x; // 右端中央
    const startY = UILayout.choiceButton.startY;
    const spacing = UILayout.choiceButton.spacing;

    choices.forEach((choice, index) => {
      const button = new ChoiceButton(
        this.scene,
        buttonX,
        startY + index * spacing, // 上から下へ配置
        choice.text,
        () => this.onChoiceClicked(choice.action)
      );
      this.choiceButtons.push(button);
    });
  }

  /**
   * 選択肢ボタンをすべて破棄
   */
  private clearChoiceButtons(): void {
    this.choiceButtons.forEach((button) => button.destroy());
    this.choiceButtons = [];
  }

  /**
   * 選択肢がクリックされた時の処理
   */
  private onChoiceClicked(action: NightCryActionType | 'WAKE_UP' | 'TRY_TO_CATCH'): void {
    if (action === 'WAKE_UP') {
      // 起きて様子を見る → 第2階層の選択肢を表示
      this.clearChoiceButtons();
      this.showSecondLevelChoices();
      return;
    }

    if (action === 'TRY_TO_CATCH') {
      // 猫を捕まえる → CATCHINGアクションを開始
      this.clearChoiceButtons();
      this.dialogSystem.show(
        '猫を捕まえる',
        `猫を別の部屋に追い出すために、まず猫を捕まえる必要があります。

猫に近づいて捕まえてください。`,
        []
      );
      if (this.onActionSelected) {
        this.onActionSelected(NightCryActionType.CATCHING);
      }
      return;
    }

    // すべてのNightCryActionTypeをコールバックで通知
    // （STOP_CARE, RETURN_CAT を含む）
    if (this.onActionSelected) {
      this.onActionSelected(action);
    }
  }

  /**
   * NightCryUIManagerを破棄
   */
  destroy(): void {
    this.hide();
    this.dialogSystem.destroy();
  }
}
