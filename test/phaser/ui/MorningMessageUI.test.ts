/**
 * MorningMessageUI のテスト
 */

import { MorningMessageUI } from '@/phaser/ui/MorningMessageUI';

describe('MorningMessageUI', () => {
  let mockScene: Phaser.Scene;
  let morningMessageUI: MorningMessageUI;

  beforeEach(() => {
    // Sceneのモック
    mockScene = {
      add: {
        container: jest.fn(() => ({
          setVisible: jest.fn(),
          setDepth: jest.fn(),
          add: jest.fn(),
          removeAll: jest.fn(),
        })),
        rectangle: jest.fn(() => ({
          setInteractive: jest.fn().mockReturnThis(),
          on: jest.fn(),
        })),
        text: jest.fn(() => ({
          setOrigin: jest.fn().mockReturnThis(),
          setVisible: jest.fn().mockReturnThis(),
          destroy: jest.fn(),
        })),
        graphics: jest.fn(() => ({
          clear: jest.fn().mockReturnThis(),
          fillStyle: jest.fn().mockReturnThis(),
          fillRect: jest.fn().mockReturnThis(),
          fillRoundedRect: jest.fn().mockReturnThis(),
          setVisible: jest.fn().mockReturnThis(),
          destroy: jest.fn(),
        })),
        zone: jest.fn(() => ({
          setInteractive: jest.fn().mockReturnThis(),
          setVisible: jest.fn().mockReturnThis(),
          on: jest.fn().mockReturnThis(),
          destroy: jest.fn(),
        })),
      },
    } as unknown as Phaser.Scene;

    morningMessageUI = new MorningMessageUI(mockScene);
  });

  it('should create MorningMessageUI', () => {
    expect(morningMessageUI).toBeDefined();
    expect(mockScene.add.container).toHaveBeenCalled();
  });

  it('should show message with callback', () => {
    const onComplete = jest.fn();
    const message = 'テストメッセージ';

    morningMessageUI.show(message, onComplete);

    // UIが表示されること
    const container = (mockScene.add.container as jest.Mock).mock.results[0].value;
    expect(container.setVisible).toHaveBeenCalledWith(true);
  });

  it('should hide UI', () => {
    morningMessageUI.hide();

    const container = (mockScene.add.container as jest.Mock).mock.results[0].value;
    expect(container.setVisible).toHaveBeenCalledWith(false);
    expect(container.removeAll).toHaveBeenCalledWith(true);
  });

  it('should create UI elements when shown', () => {
    const onComplete = jest.fn();
    const message = 'テストメッセージ';

    morningMessageUI.show(message, onComplete);

    // 背景、パネル、メッセージ、ボタンなどが作成されること
    expect(mockScene.add.rectangle).toHaveBeenCalled();
    expect(mockScene.add.text).toHaveBeenCalled();
  });
});
