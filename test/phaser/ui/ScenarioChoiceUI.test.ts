/**
 * ScenarioChoiceUI のテスト
 *
 * 3択選択肢UIコンポーネント
 */

import { ScenarioChoiceUI } from '@/phaser/ui/ScenarioChoiceUI';

describe('ScenarioChoiceUI', () => {
  let mockScene: Phaser.Scene;
  let scenarioChoiceUI: ScenarioChoiceUI;
  let mockOnSelect: jest.Mock;

  const defaultChoices = [
    { label: 'A', text: '選択肢A' },
    { label: 'B', text: '選択肢B' },
    { label: 'C', text: '選択肢C' },
  ];

  beforeEach(() => {
    // Sceneのモック
    mockScene = {
      add: {
        container: jest.fn(() => ({
          setVisible: jest.fn(),
          setDepth: jest.fn(),
          add: jest.fn(),
          destroy: jest.fn(),
          list: [],
        })),
        graphics: jest.fn(() => ({
          fillStyle: jest.fn().mockReturnThis(),
          fillRoundedRect: jest.fn().mockReturnThis(),
          clear: jest.fn().mockReturnThis(),
          setVisible: jest.fn(),
          destroy: jest.fn(),
        })),
        text: jest.fn(() => ({
          setOrigin: jest.fn().mockReturnThis(),
          setVisible: jest.fn(),
          destroy: jest.fn(),
        })),
        zone: jest.fn(() => ({
          setInteractive: jest.fn().mockReturnThis(),
          on: jest.fn().mockReturnThis(),
          setVisible: jest.fn(),
          destroy: jest.fn(),
        })),
      },
      input: {
        keyboard: {
          on: jest.fn(),
          off: jest.fn(),
        },
      },
    } as unknown as Phaser.Scene;

    mockOnSelect = jest.fn();

    scenarioChoiceUI = new ScenarioChoiceUI({
      scene: mockScene,
      x: 400,
      y: 300,
      question: 'どうする？',
      choices: defaultChoices,
      onSelect: mockOnSelect,
    });
  });

  describe('初期化', () => {
    it('ScenarioChoiceUIを作成できる', () => {
      expect(scenarioChoiceUI).toBeDefined();
    });

    it('3つの選択肢ボタンが作成される', () => {
      // テキストは質問 + 3つの選択肢 = 最低4回呼ばれる
      expect(mockScene.add.text).toHaveBeenCalled();
      const textCalls = (mockScene.add.text as jest.Mock).mock.calls;
      expect(textCalls.length).toBeGreaterThanOrEqual(4);
    });

    it('選択肢は縦に並んで配置される', () => {
      const textCalls = (mockScene.add.text as jest.Mock).mock.calls;
      // 選択肢のY座標が異なることを確認（縦並び）
      const yCoordinates = textCalls.slice(1).map((call: unknown[]) => call[1]);
      const uniqueY = new Set(yCoordinates);
      expect(uniqueY.size).toBeGreaterThan(1);
    });
  });

  describe('表示/非表示', () => {
    it('show()でUIが表示される', () => {
      scenarioChoiceUI.show();
      const container = (mockScene.add.container as jest.Mock).mock.results[0]
        .value;
      expect(container.setVisible).toHaveBeenCalledWith(true);
    });

    it('hide()でUIが非表示になる', () => {
      scenarioChoiceUI.hide();
      const container = (mockScene.add.container as jest.Mock).mock.results[0]
        .value;
      expect(container.setVisible).toHaveBeenCalledWith(false);
    });
  });

  describe('選択操作', () => {
    it('クリック時にonSelectコールバックが呼ばれる', () => {
      // zoneのonイベントハンドラを取得してシミュレート
      const zoneCalls = (mockScene.add.zone as jest.Mock).mock.results;
      expect(zoneCalls.length).toBe(3); // 3つの選択肢

      // 最初のzoneのpointerdownイベントをシミュレート
      const firstZone = zoneCalls[0].value;
      const onCalls = (firstZone.on as jest.Mock).mock.calls;
      const pointerdownCall = onCalls.find(
        (call: unknown[]) => call[0] === 'pointerdown'
      );
      expect(pointerdownCall).toBeDefined();

      // コールバックを実行
      pointerdownCall[1]();
      expect(mockOnSelect).toHaveBeenCalledWith('A');
    });

    it('2番目の選択肢をクリックするとラベル"B"でコールバックが呼ばれる', () => {
      const zoneCalls = (mockScene.add.zone as jest.Mock).mock.results;
      const secondZone = zoneCalls[1].value;
      const onCalls = (secondZone.on as jest.Mock).mock.calls;
      const pointerdownCall = onCalls.find(
        (call: unknown[]) => call[0] === 'pointerdown'
      );

      pointerdownCall[1]();
      expect(mockOnSelect).toHaveBeenCalledWith('B');
    });

    it('3番目の選択肢をクリックするとラベル"C"でコールバックが呼ばれる', () => {
      const zoneCalls = (mockScene.add.zone as jest.Mock).mock.results;
      const thirdZone = zoneCalls[2].value;
      const onCalls = (thirdZone.on as jest.Mock).mock.calls;
      const pointerdownCall = onCalls.find(
        (call: unknown[]) => call[0] === 'pointerdown'
      );

      pointerdownCall[1]();
      expect(mockOnSelect).toHaveBeenCalledWith('C');
    });

    it('連打対策: 選択後は2回目のクリックでコールバックが呼ばれない', () => {
      const zoneCalls = (mockScene.add.zone as jest.Mock).mock.results;
      const firstZone = zoneCalls[0].value;
      const onCalls = (firstZone.on as jest.Mock).mock.calls;
      const pointerdownCall = onCalls.find(
        (call: unknown[]) => call[0] === 'pointerdown'
      );

      // 1回目のクリック
      pointerdownCall[1]();
      expect(mockOnSelect).toHaveBeenCalledTimes(1);

      // 2回目のクリック（同じボタン）
      pointerdownCall[1]();
      expect(mockOnSelect).toHaveBeenCalledTimes(1); // 増えていない

      // 別のボタンをクリックしても呼ばれない
      const secondZone = zoneCalls[1].value;
      const secondOnCalls = (secondZone.on as jest.Mock).mock.calls;
      const secondPointerdownCall = secondOnCalls.find(
        (call: unknown[]) => call[0] === 'pointerdown'
      );
      secondPointerdownCall[1]();
      expect(mockOnSelect).toHaveBeenCalledTimes(1); // まだ増えていない
    });

    it('キーボード（1/2/3キー）で選択できる', () => {
      // キーボードイベントが登録されていることを確認
      expect(mockScene.input.keyboard?.on).toHaveBeenCalled();

      const keyboardOnCalls = (mockScene.input.keyboard?.on as jest.Mock).mock
        .calls;
      const keydownCall = keyboardOnCalls.find(
        (call: unknown[]) => call[0] === 'keydown'
      );
      expect(keydownCall).toBeDefined();
    });

    it('キーボード入力で選択するとコールバックが呼ばれる', () => {
      const keyboardOnCalls = (mockScene.input.keyboard?.on as jest.Mock).mock
        .calls;
      const keydownCall = keyboardOnCalls.find(
        (call: unknown[]) => call[0] === 'keydown'
      );
      const keyHandler = keydownCall[1];

      // コンテナをvisibleにする
      const container = (mockScene.add.container as jest.Mock).mock.results[0]
        .value;
      container.visible = true;

      // キー"2"を押す
      keyHandler({ key: '2', code: 'Digit2' });
      expect(mockOnSelect).toHaveBeenCalledWith('B');
    });

    it('非表示時はキー入力が無視される', () => {
      const keyboardOnCalls = (mockScene.input.keyboard?.on as jest.Mock).mock
        .calls;
      const keydownCall = keyboardOnCalls.find(
        (call: unknown[]) => call[0] === 'keydown'
      );
      const keyHandler = keydownCall[1];

      // コンテナを非表示にする（デフォルトでfalse）
      const container = (mockScene.add.container as jest.Mock).mock.results[0]
        .value;
      container.visible = false;

      // キー"1"を押す
      keyHandler({ key: '1', code: 'Digit1' });
      expect(mockOnSelect).not.toHaveBeenCalled();
    });

    it('選択済みの場合はキー入力が無視される', () => {
      const keyboardOnCalls = (mockScene.input.keyboard?.on as jest.Mock).mock
        .calls;
      const keydownCall = keyboardOnCalls.find(
        (call: unknown[]) => call[0] === 'keydown'
      );
      const keyHandler = keydownCall[1];

      // コンテナをvisibleにする
      const container = (mockScene.add.container as jest.Mock).mock.results[0]
        .value;
      container.visible = true;

      // 1回目のキー入力
      keyHandler({ key: '1', code: 'Digit1' });
      expect(mockOnSelect).toHaveBeenCalledTimes(1);

      // 2回目のキー入力
      keyHandler({ key: '2', code: 'Digit2' });
      expect(mockOnSelect).toHaveBeenCalledTimes(1); // 増えていない
    });
  });

  describe('ホバー動作', () => {
    it('ホバー時にpointeroverイベントが登録されている', () => {
      const zoneCalls = (mockScene.add.zone as jest.Mock).mock.results;
      const firstZone = zoneCalls[0].value;
      const onCalls = (firstZone.on as jest.Mock).mock.calls;
      const pointeroverCall = onCalls.find(
        (call: unknown[]) => call[0] === 'pointerover'
      );
      expect(pointeroverCall).toBeDefined();
    });

    it('ホバー解除時にpointeroutイベントが登録されている', () => {
      const zoneCalls = (mockScene.add.zone as jest.Mock).mock.results;
      const firstZone = zoneCalls[0].value;
      const onCalls = (firstZone.on as jest.Mock).mock.calls;
      const pointeroutCall = onCalls.find(
        (call: unknown[]) => call[0] === 'pointerout'
      );
      expect(pointeroutCall).toBeDefined();
    });
  });

  describe('破棄', () => {
    it('destroy()でリソースが解放される', () => {
      scenarioChoiceUI.destroy();
      const container = (mockScene.add.container as jest.Mock).mock.results[0]
        .value;
      expect(container.destroy).toHaveBeenCalled();
    });

    it('destroy()でキーボードイベントが解除される', () => {
      scenarioChoiceUI.destroy();
      expect(mockScene.input.keyboard?.off).toHaveBeenCalled();
    });
  });
});
