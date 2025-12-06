import {
  Scenario,
  ScenarioName,
  ScenarioPurpose,
  Event,
  EventTitle,
  EventDescription,
  Choice,
  EventResult,
  ParameterChange,
} from '@/domain/game';

/**
 * Scenarioマスターデータリポジトリ
 * MVP期はハードコードされたデータを返す
 * 将来的にはDBまたはJSONファイルから取得
 */
export class ScenarioRepository {
  /**
   * IDからScenarioを取得
   */
  async findById(scenarioId: string): Promise<Scenario | null> {
    // MVP期：ハードコードされたシナリオデータ
    if (scenarioId === 'scenario-1') {
      return this.createScenario1();
    }

    return null;
  }

  /**
   * シナリオ1: 日常のお世話の継続性
   */
  private createScenario1(): Scenario {
    // イベント1: 朝の餌やり
    const event1 = new Event(
      'event1',
      new EventTitle('朝の餌やり'),
      new EventDescription('猫がお腹を空かせて鳴いている。餌をあげますか?'),
      [new Choice('feed', '餌をやる'), new Choice('ignore', '無視する')],
      new Map([
        [
          'feed',
          new EventResult('猫は嬉しそうに餌を食べた', [
            new ParameterChange('affection', 10),
            new ParameterChange('hunger', -30),
          ]),
        ],
        [
          'ignore',
          new EventResult('猫は不満そうに鳴いている', [
            new ParameterChange('affection', -5),
            new ParameterChange('stress', 10),
          ]),
        ],
      ])
    );

    // イベント2: 遊びの時間
    const event2 = new Event(
      'event2',
      new EventTitle('遊びの時間'),
      new EventDescription('猫がおもちゃで遊んでほしそうにしている'),
      [new Choice('play', '一緒に遊ぶ'), new Choice('no-play', '遊ばない')],
      new Map([
        [
          'play',
          new EventResult('猫は楽しそうに遊んでいる', [
            new ParameterChange('affection', 15),
            new ParameterChange('stress', -10),
          ]),
        ],
        [
          'no-play',
          new EventResult('猫はつまらなそうにしている', [
            new ParameterChange('affection', -10),
            new ParameterChange('stress', 5),
          ]),
        ],
      ])
    );

    // イベント3: トイレ掃除
    const event3 = new Event(
      'event3',
      new EventTitle('トイレ掃除'),
      new EventDescription('トイレが汚れている。掃除しますか?'),
      [new Choice('clean', '掃除する'), new Choice('no-clean', '後で掃除する')],
      new Map([
        [
          'clean',
          new EventResult('猫は快適そうにトイレを使っている', [
            new ParameterChange('health', 5),
            new ParameterChange('stress', -5),
          ]),
        ],
        [
          'no-clean',
          new EventResult('猫は嫌そうにトイレを使っている', [
            new ParameterChange('health', -5),
            new ParameterChange('stress', 10),
          ]),
        ],
      ])
    );

    return new Scenario(
      'scenario-1',
      new ScenarioName('日常のお世話の継続性'),
      new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
      3,
      [event1, event2, event3]
    );
  }
}
