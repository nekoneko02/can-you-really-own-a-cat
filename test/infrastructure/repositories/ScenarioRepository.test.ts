import { ScenarioRepository } from '@/infrastructure/repositories/ScenarioRepository';

describe('ScenarioRepository', () => {
  let repository: ScenarioRepository;

  beforeEach(() => {
    repository = new ScenarioRepository();
  });

  describe('findById', () => {
    it('scenario-1が存在する場合、正しいScenarioを返す', async () => {
      const scenario = await repository.findById('scenario-1');

      expect(scenario).not.toBeNull();
      expect(scenario?.id).toBe('scenario-1');
      expect(scenario?.name.value).toBe('日常のお世話の継続性');
      expect(scenario?.purpose.value).toBe('毎日のお世話を続けられるか気づかせる');
      expect(scenario?.duration).toBe(3);
      expect(scenario?.events).toHaveLength(3);
    });

    it('scenario-1のイベント内容が正しい', async () => {
      const scenario = await repository.findById('scenario-1');

      expect(scenario).not.toBeNull();

      // イベント1: 朝の餌やり
      const event1 = scenario!.events[0];
      expect(event1.id).toBe('event1');
      expect(event1.title.value).toBe('朝の餌やり');
      expect(event1.description.value).toContain('餌');
      expect(event1.choices).toHaveLength(2);

      // イベント2: 遊びの時間
      const event2 = scenario!.events[1];
      expect(event2.id).toBe('event2');
      expect(event2.title.value).toBe('遊びの時間');

      // イベント3: トイレ掃除
      const event3 = scenario!.events[2];
      expect(event3.id).toBe('event3');
      expect(event3.title.value).toBe('トイレ掃除');
    });

    it('存在しないシナリオIDの場合、nullを返す', async () => {
      const scenario = await repository.findById('non-existent');

      expect(scenario).toBeNull();
    });

    it('空文字列の場合、nullを返す', async () => {
      const scenario = await repository.findById('');

      expect(scenario).toBeNull();
    });
  });
});
