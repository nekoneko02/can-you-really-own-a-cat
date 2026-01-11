/**
 * シナリオレジストリのテスト
 */

import {
  ScenarioMetadata,
  getAllScenarios,
  getScenarioById,
} from '@/domain/scenarios/scenarioRegistry';

describe('scenarioRegistry', () => {
  describe('ScenarioMetadata型', () => {
    it('シナリオメタデータの構造が正しい', () => {
      const metadata: ScenarioMetadata = {
        id: 'nightcry',
        title: '夜泣き・睡眠不足',
        shortDescription: '猫の夜泣きを5日間体験...',
        fullDescription: '詳細な説明',
        estimatedTime: '約10分',
        theme: '睡眠',
        icon: 'moon',
      };

      expect(metadata.id).toBe('nightcry');
      expect(metadata.title).toBe('夜泣き・睡眠不足');
    });
  });

  describe('getAllScenarios', () => {
    it('シナリオ一覧を取得できる', () => {
      const scenarios = getAllScenarios();

      expect(Array.isArray(scenarios)).toBe(true);
      expect(scenarios.length).toBeGreaterThan(0);
    });

    it('夜泣きシナリオが含まれている', () => {
      const scenarios = getAllScenarios();

      const nightcry = scenarios.find((s) => s.id === 'nightcry');
      expect(nightcry).toBeDefined();
      expect(nightcry?.title).toBe('夜泣き・睡眠不足');
    });
  });

  describe('getScenarioById', () => {
    it('IDでシナリオを取得できる', () => {
      const scenario = getScenarioById('nightcry');

      expect(scenario).toBeDefined();
      expect(scenario?.id).toBe('nightcry');
    });

    it('存在しないIDの場合はundefinedを返す', () => {
      const scenario = getScenarioById('nonexistent');

      expect(scenario).toBeUndefined();
    });
  });
});
