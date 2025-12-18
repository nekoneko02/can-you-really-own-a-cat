/**
 * EmotionInputUI のテスト
 */

import { EmotionInputUI } from '@/phaser/ui/EmotionInputUI';
import { EmotionData } from '@/domain/EventRecord';

describe('EmotionInputUI', () => {
  let mockScene: Phaser.Scene;
  let emotionInputUI: EmotionInputUI;

  beforeEach(() => {
    // Sceneのモック
    mockScene = {
      add: {
        container: jest.fn(() => ({
          setVisible: jest.fn(),
          setDepth: jest.fn(),
          add: jest.fn(),
          removeAll: jest.fn(),
          list: [],
        })),
        dom: jest.fn(() => ({})),
        rectangle: jest.fn(() => ({
          setStrokeStyle: jest.fn().mockReturnThis(),
          setInteractive: jest.fn().mockReturnThis(),
          setFillStyle: jest.fn().mockReturnThis(),
          on: jest.fn(),
          y: 200,
          type: 'Rectangle',
        })),
        text: jest.fn(() => ({
          setOrigin: jest.fn(),
        })),
        circle: jest.fn(() => ({
          setStrokeStyle: jest.fn().mockReturnThis(),
          setInteractive: jest.fn().mockReturnThis(),
          setFillStyle: jest.fn().mockReturnThis(),
          on: jest.fn(),
          y: 200,
          type: 'Arc',
        })),
      },
    } as unknown as Phaser.Scene;

    emotionInputUI = new EmotionInputUI(mockScene);
  });

  it('should create EmotionInputUI', () => {
    expect(emotionInputUI).toBeDefined();
    expect(mockScene.add.container).toHaveBeenCalled();
  });

  it('should show UI with callback', () => {
    const onComplete = jest.fn();
    emotionInputUI.show(onComplete);

    // UIが表示されること
    const container = (mockScene.add.container as jest.Mock).mock.results[0].value;
    expect(container.setVisible).toHaveBeenCalledWith(true);
  });

  it('should hide UI', () => {
    emotionInputUI.hide();

    const container = (mockScene.add.container as jest.Mock).mock.results[0].value;
    expect(container.setVisible).toHaveBeenCalledWith(false);
    expect(container.removeAll).toHaveBeenCalledWith(true);
  });

  it('should create UI elements when shown', () => {
    const onComplete = jest.fn();
    emotionInputUI.show(onComplete);

    // 背景、パネル、タイトル、ボタンなどが作成されること
    expect(mockScene.add.rectangle).toHaveBeenCalled();
    expect(mockScene.add.text).toHaveBeenCalled();
  });
});
