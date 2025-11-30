import {
  Choice,
  Event,
  EventDescription,
  EventResult,
  EventTitle,
  ParameterChange,
  Scenario,
  ScenarioName,
  ScenarioPurpose,
} from '@/domain/game';

/**
 * シナリオデータファクトリー
 * 静的なシナリオデータを生成する
 */
export class ScenarioDataFactory {
  /**
   * 1. 日常のお世話の継続性シナリオ
   */
  static createDailyCareScenario(): Scenario {
    const events = [
      // Event 1: 朝の餌やり
      new Event(
        'daily-care-event-1',
        new EventTitle('朝の餌やり'),
        new EventDescription(
          '朝6時、猫が「にゃーにゃー」と鳴きながらあなたの顔を見つめています。お腹が空いているようです。'
        ),
        [
          new Choice('feed', '餌をやる'),
          new Choice('ignore', 'もう少し寝る'),
        ],
        new Map([
          [
            'feed',
            new EventResult('猫は嬉しそうに餌を食べています。', [
              new ParameterChange('affection', 10),
              new ParameterChange('hunger', -30),
            ]),
          ],
          [
            'ignore',
            new EventResult('猫は不満そうに鳴き続けています。', [
              new ParameterChange('affection', -5),
              new ParameterChange('stress', 10),
              new ParameterChange('hunger', 5),
            ]),
          ],
        ])
      ),

      // Event 2: トイレ掃除
      new Event(
        'daily-care-event-2',
        new EventTitle('トイレ掃除'),
        new EventDescription(
          '出勤前、猫のトイレを見ると昨夜の分がそのままです。掃除する時間はありますが、遅刻しそうです。'
        ),
        [
          new Choice('clean', '遅刻覚悟で掃除する'),
          new Choice('skip', '帰ってから掃除する'),
        ],
        new Map([
          [
            'clean',
            new EventResult('トイレはきれいになりました。遅刻しそうです。', [
              new ParameterChange('stress', -5),
              new ParameterChange('playerStress', 10),
            ]),
          ],
          [
            'skip',
            new EventResult('帰宅時、部屋中が臭います。', [
              new ParameterChange('stress', 15),
              new ParameterChange('roomCleanliness', -20),
            ]),
          ],
        ])
      ),

      // Event 3: 疲れた夜の食事準備
      new Event(
        'daily-care-event-3',
        new EventTitle('疲れた夜の食事準備'),
        new EventDescription(
          '疲れて帰宅。猫の餌を準備する気力が湧きません。ドライフードだけで済ませようか...。'
        ),
        [
          new Choice('proper', 'ウェットフードも用意する'),
          new Choice('quick', 'ドライフードだけにする'),
        ],
        new Map([
          [
            'proper',
            new EventResult('猫は満足そうに食べています。', [
              new ParameterChange('affection', 10),
              new ParameterChange('hunger', -30),
              new ParameterChange('health', 5),
            ]),
          ],
          [
            'quick',
            new EventResult('猫は不満そうですが、食べています。', [
              new ParameterChange('affection', -5),
              new ParameterChange('hunger', -20),
            ]),
          ],
        ])
      ),
    ];

    return new Scenario(
      'scenario-daily-care',
      new ScenarioName('日常のお世話の継続性'),
      new ScenarioPurpose(
        '毎日のお世話（餌やり、トイレ掃除）を続けられるか気づかせる'
      ),
      7,
      events
    );
  }

  /**
   * 2. 睡眠への影響シナリオ
   */
  static createSleepImpactScenario(): Scenario {
    const events = [
      // Event 1: 夜中の運動会
      new Event(
        'sleep-impact-event-1',
        new EventTitle('夜中の運動会'),
        new EventDescription(
          '深夜2時、猫がドタドタと走り回っています。物音で目が覚めました。'
        ),
        [
          new Choice('ignore', '無視して寝る'),
          new Choice('play', '起きて遊ぶ'),
        ],
        new Map([
          [
            'ignore',
            new EventResult('猫は走り続けています。眠れません。', [
              new ParameterChange('playerFatigue', 15),
              new ParameterChange('stress', 10),
            ]),
          ],
          [
            'play',
            new EventResult('猫は満足して静かになりました。', [
              new ParameterChange('affection', 10),
              new ParameterChange('playerFatigue', 20),
              new ParameterChange('stress', -5),
            ]),
          ],
        ])
      ),

      // Event 2: 早朝4時の餌催促
      new Event(
        'sleep-impact-event-2',
        new EventTitle('早朝4時の餌催促'),
        new EventDescription(
          '朝4時、猫が鳴いて起こしてきます。餌が欲しいようです。'
        ),
        [
          new Choice('feed', '起きて餌をやる'),
          new Choice('ignore', '無視して寝る'),
        ],
        new Map([
          [
            'feed',
            new EventResult('猫は満足して食べています。', [
              new ParameterChange('affection', 10),
              new ParameterChange('hunger', -20),
              new ParameterChange('playerFatigue', 15),
            ]),
          ],
          [
            'ignore',
            new EventResult('猫は鳴き続けています。眠れません。', [
              new ParameterChange('affection', -10),
              new ParameterChange('stress', 15),
              new ParameterChange('playerFatigue', 10),
            ]),
          ],
        ])
      ),

      // Event 3: 睡眠不足の蓄積
      new Event(
        'sleep-impact-event-3',
        new EventTitle('睡眠不足の蓄積'),
        new EventDescription(
          '3日連続で夜中に起こされ、仕事に集中できません。疲労が限界です。'
        ),
        [
          new Choice('accept', 'これも猫との生活だと受け入れる'),
          new Choice('worried', '本当に飼い続けられるか不安になる'),
        ],
        new Map([
          [
            'accept',
            new EventResult('覚悟を決めました。', [
              new ParameterChange('playerStress', -10),
            ]),
          ],
          [
            'worried',
            new EventResult('不安が募ります。', [
              new ParameterChange('playerStress', 15),
            ]),
          ],
        ])
      ),
    ];

    return new Scenario(
      'scenario-sleep-impact',
      new ScenarioName('睡眠への影響'),
      new ScenarioPurpose(
        '夜中の運動会、早朝の餌催促で睡眠不足になる現実を気づかせる'
      ),
      7,
      events
    );
  }

  /**
   * 3. 衛生面のリアルシナリオ
   */
  static createHygieneScenario(): Scenario {
    const events = [
      // Event 1: トイレの臭い
      new Event(
        'hygiene-event-1',
        new EventTitle('トイレの臭い'),
        new EventDescription(
          '掃除をサボったら、部屋中が臭います。友人が訪ねてくる予定です。'
        ),
        [
          new Choice('clean', '急いで掃除する'),
          new Choice('cancel', '友人との約束をキャンセルする'),
        ],
        new Map([
          [
            'clean',
            new EventResult('なんとか間に合いました。', [
              new ParameterChange('roomCleanliness', 20),
              new ParameterChange('playerStress', 10),
            ]),
          ],
          [
            'cancel',
            new EventResult('友人をがっかりさせてしまいました。', [
              new ParameterChange('playerStress', 15),
            ]),
          ],
        ])
      ),

      // Event 2: 吐き戻し
      new Event(
        'hygiene-event-2',
        new EventTitle('吐き戻し'),
        new EventDescription(
          '朝起きたらカーペットに吐き戻しがあります。出勤前の忙しい時間です。'
        ),
        [
          new Choice('clean', '掃除してから出勤'),
          new Choice('leave', '帰ってから掃除'),
        ],
        new Map([
          [
            'clean',
            new EventResult('遅刻しました。', [
              new ParameterChange('roomCleanliness', 10),
              new ParameterChange('playerStress', 15),
            ]),
          ],
          [
            'leave',
            new EventResult('帰宅時、臭いとシミが広がっています。', [
              new ParameterChange('roomCleanliness', -15),
              new ParameterChange('playerStress', 20),
            ]),
          ],
        ])
      ),

      // Event 3: 抜け毛の掃除
      new Event(
        'hygiene-event-3',
        new EventTitle('抜け毛の掃除'),
        new EventDescription(
          '服も家具も毛だらけ。毎日の掃除が必要です。掃除機をかけるのが日課になりました。'
        ),
        [
          new Choice('daily', '毎日掃除する'),
          new Choice('skip', '気が向いたときだけ掃除'),
        ],
        new Map([
          [
            'daily',
            new EventResult('部屋はきれいですが、時間を取られます。', [
              new ParameterChange('roomCleanliness', 20),
              new ParameterChange('playerFatigue', 10),
            ]),
          ],
          [
            'skip',
            new EventResult('毛が積もっていきます。', [
              new ParameterChange('roomCleanliness', -20),
              new ParameterChange('playerStress', 10),
            ]),
          ],
        ])
      ),
    ];

    return new Scenario(
      'scenario-hygiene',
      new ScenarioName('衛生面のリアル'),
      new ScenarioPurpose(
        '部屋の臭い、抜け毛、吐き戻しなど衛生面の現実を気づかせる'
      ),
      7,
      events
    );
  }

  /**
   * 4. 家具・物への被害シナリオ
   */
  static createPropertyDamageScenario(): Scenario {
    const events = [
      // Event 1: 爪とぎ被害
      new Event(
        'property-damage-event-1',
        new EventTitle('爪とぎ被害'),
        new EventDescription(
          '大切なソファが傷ついています。猫が爪とぎに使っているようです。'
        ),
        [
          new Choice('buy-scratcher', '爪とぎグッズを買う（3,000円）'),
          new Choice('accept', '諦めて受け入れる'),
        ],
        new Map([
          [
            'buy-scratcher',
            new EventResult('爪とぎグッズを設置しました。', [
              new ParameterChange('totalCost', 3000),
              new ParameterChange('stress', -10),
            ]),
          ],
          [
            'accept',
            new EventResult('傷は増え続けています。', [
              new ParameterChange('playerStress', 15),
            ]),
          ],
        ])
      ),

      // Event 2: 物を壊される
      new Event(
        'property-damage-event-2',
        new EventTitle('物を壊される'),
        new EventDescription(
          '猫が飛び乗ろうとして、花瓶が落ちて割れました。思い出の品でした。'
        ),
        [
          new Choice('calm', '冷静に片付ける'),
          new Choice('angry', '猫を叱る'),
        ],
        new Map([
          [
            'calm',
            new EventResult('仕方ないと受け入れました。', [
              new ParameterChange('playerStress', 10),
            ]),
          ],
          [
            'angry',
            new EventResult('猫は怯えて隠れてしまいました。', [
              new ParameterChange('affection', -15),
              new ParameterChange('stress', 20),
            ]),
          ],
        ])
      ),

      // Event 3: 修繕費の累積
      new Event(
        'property-damage-event-3',
        new EventTitle('修繕費の累積'),
        new EventDescription(
          '家具の買い替え、修繕費が嵩んでいきます。すでに2万円使いました。'
        ),
        [
          new Choice('continue', '猫のためと割り切る'),
          new Choice('worried', '経済的負担を心配する'),
        ],
        new Map([
          [
            'continue',
            new EventResult('覚悟を決めました。', [
              new ParameterChange('totalCost', 20000),
            ]),
          ],
          [
            'worried',
            new EventResult('この先の出費が不安です。', [
              new ParameterChange('totalCost', 20000),
              new ParameterChange('playerStress', 20),
            ]),
          ],
        ])
      ),
    ];

    return new Scenario(
      'scenario-property-damage',
      new ScenarioName('家具・物への被害'),
      new ScenarioPurpose(
        '爪とぎ、物を壊される被害を体験し、許容できるか気づかせる'
      ),
      7,
      events
    );
  }

  /**
   * 5. 生活の自由度への影響シナリオ
   */
  static createFreedomImpactScenario(): Scenario {
    const events = [
      // Event 1: 友人の誘い
      new Event(
        'freedom-impact-event-1',
        new EventTitle('友人の誘い'),
        new EventDescription(
          '友人から「今日飲みに行かない？」と連絡が。猫の餌やりの時間ですが...。'
        ),
        [
          new Choice('go', '行く（猫は我慢）'),
          new Choice('decline', '断る'),
        ],
        new Map([
          [
            'go',
            new EventResult('楽しい時間でしたが、猫が心配です。', [
              new ParameterChange('affection', -10),
              new ParameterChange('stress', 15),
              new ParameterChange('hunger', 10),
            ]),
          ],
          [
            'decline',
            new EventResult('友人は残念そうでした。', [
              new ParameterChange('playerStress', 10),
            ]),
          ],
        ])
      ),

      // Event 2: 旅行の計画
      new Event(
        'freedom-impact-event-2',
        new EventTitle('旅行の計画'),
        new EventDescription(
          '週末の旅行を計画していたが、猫をどうするか考えていませんでした。'
        ),
        [
          new Choice('cancel', '旅行を諦める'),
          new Choice('hotel', 'ペットホテルを予約する'),
        ],
        new Map([
          [
            'cancel',
            new EventResult('旅行は中止になりました。', [
              new ParameterChange('playerStress', 20),
            ]),
          ],
          [
            'hotel',
            new EventResult('ペットホテルを見つけました。', [
              new ParameterChange('totalCost', 15000),
              new ParameterChange('stress', 10),
            ]),
          ],
        ])
      ),

      // Event 3: ペットホテル費用
      new Event(
        'freedom-impact-event-3',
        new EventTitle('ペットホテル費用'),
        new EventDescription(
          'ペットホテルは1泊5,000円。3泊で1.5万円かかりました。'
        ),
        [
          new Choice('accept', '必要経費と割り切る'),
          new Choice('regret', '高すぎると感じる'),
        ],
        new Map([
          [
            'accept',
            new EventResult('猫も安全に過ごせました。', [
              new ParameterChange('stress', -5),
            ]),
          ],
          [
            'regret',
            new EventResult('次からは旅行を控えようと思います。', [
              new ParameterChange('playerStress', 15),
            ]),
          ],
        ])
      ),
    ];

    return new Scenario(
      'scenario-freedom-impact',
      new ScenarioName('生活の自由度への影響'),
      new ScenarioPurpose(
        '旅行、飲み会など自由な生活が制限される現実を気づかせる'
      ),
      7,
      events
    );
  }

  /**
   * 6. 問題行動への対処シナリオ
   */
  static createProblemBehaviorScenario(): Scenario {
    const events = [
      // Event 1: 粗相
      new Event(
        'problem-behavior-event-1',
        new EventTitle('粗相'),
        new EventDescription(
          'トイレ以外で排泄してしまいました。ストレスが原因かもしれません。'
        ),
        [
          new Choice('scold', '叱る'),
          new Choice('vet', '獣医に相談する（5,000円）'),
        ],
        new Map([
          [
            'scold',
            new EventResult('猫はさらにストレスを感じているようです。', [
              new ParameterChange('affection', -15),
              new ParameterChange('stress', 25),
            ]),
          ],
          [
            'vet',
            new EventResult('原因を特定できました。', [
              new ParameterChange('totalCost', 5000),
              new ParameterChange('stress', -10),
              new ParameterChange('health', 10),
            ]),
          ],
        ])
      ),

      // Event 2: 噛みつき・引っかき
      new Event(
        'problem-behavior-event-2',
        new EventTitle('噛みつき・引っかき'),
        new EventDescription(
          '遊んでいたら突然噛みつかれました。手から血が出ています。'
        ),
        [
          new Choice('understand', '遊び方を変える'),
          new Choice('scared', '猫が怖いと感じる'),
        ],
        new Map([
          [
            'understand',
            new EventResult('猫との接し方を学びました。', [
              new ParameterChange('affection', 5),
              new ParameterChange('stress', -5),
            ]),
          ],
          [
            'scared',
            new EventResult('猫との距離を感じます。', [
              new ParameterChange('affection', -10),
              new ParameterChange('playerStress', 15),
            ]),
          ],
        ])
      ),

      // Event 3: 夜鳴き
      new Event(
        'problem-behavior-event-3',
        new EventTitle('夜鳴き'),
        new EventDescription(
          '夜中に大きな声で鳴いています。近隣からの苦情が心配です。'
        ),
        [
          new Choice('ignore', '我慢する'),
          new Choice('soundproof', '防音対策を検討（10,000円）'),
        ],
        new Map([
          [
            'ignore',
            new EventResult('苦情が来ないか不安です。', [
              new ParameterChange('playerStress', 20),
              new ParameterChange('playerFatigue', 15),
            ]),
          ],
          [
            'soundproof',
            new EventResult('防音カーテンを設置しました。', [
              new ParameterChange('totalCost', 10000),
              new ParameterChange('playerStress', -10),
            ]),
          ],
        ])
      ),
    ];

    return new Scenario(
      'scenario-problem-behavior',
      new ScenarioName('問題行動への対処'),
      new ScenarioPurpose(
        '粗相、噛みつき、夜鳴きなど問題行動に対処できるか気づかせる'
      ),
      7,
      events
    );
  }

  /**
   * 7. ポジティブな側面シナリオ
   */
  static createPositiveSideScenario(): Scenario {
    const events = [
      // Event 1: 猫があなたを見つめてくる
      new Event(
        'positive-side-event-1',
        new EventTitle('猫があなたを見つめてくる'),
        new EventDescription(
          'ソファに座っていると、猫がじっと見つめてきます。信頼の証です。'
        ),
        [
          new Choice('smile', '微笑み返す'),
          new Choice('pet', '撫でる'),
        ],
        new Map([
          [
            'smile',
            new EventResult('猫はゆっくり瞬きをしました。', [
              new ParameterChange('affection', 15),
              new ParameterChange('playerStress', -15),
            ]),
          ],
          [
            'pet',
            new EventResult('猫は喉を鳴らして喜んでいます。', [
              new ParameterChange('affection', 20),
              new ParameterChange('stress', -10),
              new ParameterChange('playerStress', -20),
            ]),
          ],
        ])
      ),

      // Event 2: 猫が膝に乗ってくる
      new Event(
        'positive-side-event-2',
        new EventTitle('猫が膝に乗ってくる'),
        new EventDescription(
          '読書をしていると、猫が膝に乗ってきました。温かくて幸せな時間です。'
        ),
        [
          new Choice('enjoy', 'このまま過ごす'),
          new Choice('photo', '写真を撮る'),
        ],
        new Map([
          [
            'enjoy',
            new EventResult('穏やかな時間が流れています。', [
              new ParameterChange('affection', 15),
              new ParameterChange('playerStress', -25),
            ]),
          ],
          [
            'photo',
            new EventResult('かわいい写真が撮れました。', [
              new ParameterChange('affection', 10),
              new ParameterChange('playerStress', -20),
            ]),
          ],
        ])
      ),

      // Event 3: 猫が遊びに誘ってくる
      new Event(
        'positive-side-event-3',
        new EventTitle('猫が遊びに誘ってくる'),
        new EventDescription(
          '猫がおもちゃをくわえて持ってきました。一緒に遊びたいようです。'
        ),
        [
          new Choice('play', '一緒に遊ぶ'),
          new Choice('later', '後で遊ぶ'),
        ],
        new Map([
          [
            'play',
            new EventResult('猫は大喜びで遊んでいます。', [
              new ParameterChange('affection', 20),
              new ParameterChange('stress', -15),
              new ParameterChange('playerStress', -15),
              new ParameterChange('playerFatigue', 10),
            ]),
          ],
          [
            'later',
            new EventResult('猫は少し残念そうです。', [
              new ParameterChange('affection', -5),
            ]),
          ],
        ])
      ),
    ];

    return new Scenario(
      'scenario-positive-side',
      new ScenarioName('ポジティブな側面'),
      new ScenarioPurpose('猫との生活の喜び、癒しを体験させる'),
      7,
      events
    );
  }

  /**
   * すべてのMVPシナリオを取得
   */
  static getAllMVPScenarios(): Scenario[] {
    return [
      ScenarioDataFactory.createDailyCareScenario(),
      ScenarioDataFactory.createSleepImpactScenario(),
      ScenarioDataFactory.createHygieneScenario(),
      ScenarioDataFactory.createPropertyDamageScenario(),
      ScenarioDataFactory.createFreedomImpactScenario(),
      ScenarioDataFactory.createProblemBehaviorScenario(),
      ScenarioDataFactory.createPositiveSideScenario(),
    ];
  }

  /**
   * シナリオIDからシナリオを取得
   */
  static getScenarioById(scenarioId: string): Scenario | undefined {
    const allScenarios = ScenarioDataFactory.getAllMVPScenarios();
    return allScenarios.find((s) => s.id === scenarioId);
  }
}
