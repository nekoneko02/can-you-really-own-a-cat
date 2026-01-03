/**
 * NightcryEndingScene のテスト
 *
 * エンディングテキスト表示とレポートページへの遷移をテストします。
 */

// Phaserをモック
jest.mock('phaser', () => ({
  Scene: class MockScene {
    constructor(config: { key: string }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).scene = { key: config.key };
    }
  },
  Math: {
    Between: jest.fn((min: number) => min),
  },
}));

// DialogSystemをモック
jest.mock('@/phaser/ui/DialogSystem', () => ({
  DialogSystem: jest.fn().mockImplementation(() => ({
    showPages: jest.fn(),
    hide: jest.fn(),
    destroy: jest.fn(),
  })),
}));

// BaseButtonをモック
jest.mock('@/phaser/ui/components/BaseButton', () => ({
  BaseButton: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    setVisible: jest.fn(),
  })),
}));

// UIConstantsをモック
jest.mock('@/phaser/ui/UIConstants', () => ({
  UIColors: { primary: 0x4a6fa5 },
  UILayout: {
    screen: { width: 800, height: 600 },
    playArea: { height: 470 },
  },
}));

// SelectionTendencyAnalyzerをモック
jest.mock('@/domain/scenarios/nightcry/SelectionTendencyAnalyzer', () => ({
  SelectionTendencyAnalyzer: {
    analyze: jest.fn().mockReturnValue('mixed'),
  },
}));

import type {
  NightcryScenarioState,
  NightcryReportData,
} from '@/domain/scenarios/nightcry/NightcryScenarioState';
import { SelectionTendencyAnalyzer } from '@/domain/scenarios/nightcry/SelectionTendencyAnalyzer';

// テスト対象のシーン用型定義
interface NightcryEndingSceneInterface {
  init(data: { scenarioState: NightcryScenarioState }): void;
  getEndingContent(): {
    commonText: string[];
    finalQuestion: string;
  };
  saveReportData(): void;
  navigateToReport(): void;
}

describe('NightcryEndingScene', () => {
  const mockScenarioState: NightcryScenarioState = {
    currentPhase: 5,
    selections: {
      phase1: 'A',
      phase2: 'B',
      phase3: 'A',
      phase4: 'C',
      phase5: 'B',
    },
    completed: true,
  };

  let mockLocalStorage: { [key: string]: string };
  let mockWindowLocation: { href: string };

  beforeEach(() => {
    jest.clearAllMocks();

    // localStorageをモック
    mockLocalStorage = {};
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
    });

    // window.locationをモック
    mockWindowLocation = { href: '' };
    Object.defineProperty(global, 'window', {
      value: {
        location: mockWindowLocation,
      },
      writable: true,
    });
  });

  describe('エンディングコンテンツ', () => {
    it('共通テキストが正しい内容を含む', async () => {
      const { NightcryEndingScene } = await import(
        '@/phaser/scenes/nightcry/NightcryEndingScene'
      );
      const scene = new NightcryEndingScene() as unknown as NightcryEndingSceneInterface;

      const content = scene.getEndingContent();

      expect(content.commonText).toContain(
        'この体験は、ある一人の飼い主のものです。'
      );
      expect(content.commonText.some((text) =>
        text.includes('あなたが同じになるとは限りません')
      )).toBe(true);
    });

    it('最後の問いが設定されている', async () => {
      const { NightcryEndingScene } = await import(
        '@/phaser/scenes/nightcry/NightcryEndingScene'
      );
      const scene = new NightcryEndingScene() as unknown as NightcryEndingSceneInterface;

      const content = scene.getEndingContent();

      expect(content.finalQuestion).toBe(
        'この生活、あなたはどう感じましたか？'
      );
    });
  });

  describe('レポートデータ保存', () => {
    it('localStorageにnightcryReportDataとして保存される', async () => {
      const { NightcryEndingScene } = await import(
        '@/phaser/scenes/nightcry/NightcryEndingScene'
      );
      const scene = new NightcryEndingScene() as unknown as NightcryEndingSceneInterface;
      scene.init({ scenarioState: mockScenarioState });

      scene.saveReportData();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'nightcryReportData',
        expect.any(String)
      );
    });

    it('保存データにselectionsとtendencyが含まれる', async () => {
      (SelectionTendencyAnalyzer.analyze as jest.Mock).mockReturnValue('resilient');

      const { NightcryEndingScene } = await import(
        '@/phaser/scenes/nightcry/NightcryEndingScene'
      );
      const scene = new NightcryEndingScene() as unknown as NightcryEndingSceneInterface;
      scene.init({ scenarioState: mockScenarioState });

      scene.saveReportData();

      const savedData = JSON.parse(
        mockLocalStorage['nightcryReportData']
      ) as NightcryReportData;

      expect(savedData.selections).toEqual(mockScenarioState.selections);
      expect(savedData.tendency).toBe('resilient');
    });

    it('SelectionTendencyAnalyzerが選択データで呼ばれる', async () => {
      const { NightcryEndingScene } = await import(
        '@/phaser/scenes/nightcry/NightcryEndingScene'
      );
      const scene = new NightcryEndingScene() as unknown as NightcryEndingSceneInterface;
      scene.init({ scenarioState: mockScenarioState });

      scene.saveReportData();

      expect(SelectionTendencyAnalyzer.analyze).toHaveBeenCalledWith(
        mockScenarioState.selections
      );
    });
  });

  describe('ページ遷移', () => {
    it('navigateToReportで/nightcry-reportへ遷移する', async () => {
      const { NightcryEndingScene } = await import(
        '@/phaser/scenes/nightcry/NightcryEndingScene'
      );
      const scene = new NightcryEndingScene() as unknown as NightcryEndingSceneInterface;

      scene.navigateToReport();

      expect(mockWindowLocation.href).toBe('/nightcry-report');
    });
  });
});
