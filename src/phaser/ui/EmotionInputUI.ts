import Phaser from 'phaser';
import { EmotionData } from '@/domain/EventRecord';

/**
 * 気持ち入力UI
 *
 * プレイヤーがイベント完了時に自分の感情を記録するUIを表示します。
 */
export class EmotionInputUI {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private satisfactionSlider: number = 3; // 1-5
  private burdenSlider: number = 3; // 1-5
  private freeText: string = '';
  private onComplete?: (emotion: EmotionData) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setVisible(false);
    this.container.setDepth(1000); // 最前面に表示
  }

  /**
   * 気持ち入力UIを表示
   */
  public show(onComplete: (emotion: EmotionData) => void): void {
    this.onComplete = onComplete;
    this.reset();
    this.createUI();
    this.container.setVisible(true);
  }

  /**
   * 気持ち入力UIを非表示
   */
  public hide(): void {
    this.container.setVisible(false);
    this.container.removeAll(true);
  }

  /**
   * 初期値にリセット
   */
  private reset(): void {
    this.satisfactionSlider = 3;
    this.burdenSlider = 3;
    this.freeText = '';
  }

  /**
   * UIを構築
   */
  private createUI(): void {
    // 背景（半透明の黒）
    const bg = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
    this.container.add(bg);

    // パネル背景
    const panel = this.scene.add.rectangle(400, 300, 600, 400, 0xffffff);
    this.container.add(panel);

    // タイトル
    const title = this.scene.add.text(400, 150, '今、あなたはどんな気持ちですか？', {
      fontSize: '24px',
      color: '#000000',
    });
    title.setOrigin(0.5);
    this.container.add(title);

    // 満足度スライダー
    this.createSlider(200, '😊 満足', '😟 不満', (value) => {
      this.satisfactionSlider = value;
    });

    // 負担度スライダー
    this.createSlider(280, '🙂 余裕', '😰 しんどい', (value) => {
      this.burdenSlider = value;
    });

    // テキスト入力ラベル
    const textLabel = this.scene.add.text(
      400,
      360,
      '（任意）他に感じたことがあれば自由に入力してください：',
      {
        fontSize: '16px',
        color: '#000000',
      }
    );
    textLabel.setOrigin(0.5);
    this.container.add(textLabel);

    // テキスト入力フィールド（HTML入力要素を使用）
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.style.width = '400px';
    inputElement.style.height = '30px';
    inputElement.style.fontSize = '16px';
    inputElement.style.padding = '5px';
    inputElement.style.border = '2px solid #000000';
    inputElement.style.borderRadius = '4px';
    inputElement.style.backgroundColor = '#ffffff';
    inputElement.placeholder = 'ここに入力してください';
    inputElement.value = this.freeText;

    // 入力値を保存
    inputElement.addEventListener('input', (e) => {
      this.freeText = (e.target as HTMLInputElement).value;
    });

    // DOMElementとして追加（Phaserのキャンバス座標で配置）
    const domElement = this.scene.add.dom(400, 400, inputElement);
    this.container.add(domElement);

    // 「次へ」ボタン
    const button = this.scene.add.rectangle(400, 470, 120, 40, 0x4CAF50);
    button.setInteractive({ useHandCursor: true });
    this.container.add(button);

    const buttonText = this.scene.add.text(400, 470, '次へ', {
      fontSize: '20px',
      color: '#ffffff',
    });
    buttonText.setOrigin(0.5);
    this.container.add(buttonText);

    button.on('pointerdown', () => {
      this.submit();
    });
  }

  /**
   * スライダーを作成（簡易版：5段階のボタン）
   */
  private createSlider(y: number, leftLabel: string, rightLabel: string, onChange: (value: number) => void): void {
    // 左ラベル
    const left = this.scene.add.text(150, y, leftLabel, {
      fontSize: '18px',
      color: '#000000',
    });
    left.setOrigin(0.5);
    this.container.add(left);

    // 右ラベル
    const right = this.scene.add.text(650, y, rightLabel, {
      fontSize: '18px',
      color: '#000000',
    });
    right.setOrigin(0.5);
    this.container.add(right);

    // 5段階のボタン
    const startX = 250;
    const spacing = 80;
    for (let i = 1; i <= 5; i++) {
      const circle = this.scene.add.circle(startX + (i - 1) * spacing, y, 15, 0xcccccc);
      circle.setStrokeStyle(2, 0x000000);
      circle.setInteractive({ useHandCursor: true });
      this.container.add(circle);

      circle.on('pointerdown', () => {
        onChange(i);
        // すべてのボタンをリセット
        this.container.list.forEach((obj: any) => {
          if (obj.y === y && obj.type === 'Arc') {
            obj.setFillStyle(0xcccccc);
          }
        });
        // 選択したボタンをハイライト
        circle.setFillStyle(0x2196F3);
      });

      // 初期値（3）をハイライト
      if (i === 3) {
        circle.setFillStyle(0x2196F3);
      }
    }
  }

  /**
   * 入力を送信
   */
  private submit(): void {
    const emotion: EmotionData = {
      satisfaction: this.satisfactionSlider,
      burden: this.burdenSlider,
      freeText: this.freeText || undefined,
    };

    if (this.onComplete) {
      this.onComplete(emotion);
    }

    this.hide();
  }
}
