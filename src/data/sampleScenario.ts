import {
  Choice,
  Event,
  EventDescription,
  EventResult,
  EventTitle,
  ParameterChange,
} from '@/domain/game';

/**
 * サンプルシナリオ: 朝のお世話
 */
export const createSampleScenario = (): Event[] => {
  return [
    // イベント1: 朝の餌やり
    new Event(
      'event-1',
      new EventTitle('朝の餌やり'),
      new EventDescription(
        '朝6時、猫が「にゃーにゃー」と鳴きながらあなたのベッドに乗ってきました。\nお腹を空かせているようです。'
      ),
      [
        new Choice('feed', '起きて餌をやる'),
        new Choice('ignore', 'もう少し寝る（無視する）'),
      ],
      new Map<string, EventResult>([
        [
          'feed',
          new EventResult(
            '猫は嬉しそうに餌を食べました。\nあなたはそのまま支度を始めましたが、少し眠そうです。',
            [
              new ParameterChange('affection', 10),
              new ParameterChange('hunger', -40),
            ]
          ),
        ],
        [
          'ignore',
          new EventResult(
            '猫はさらに大きな声で鳴き続けます。\n結局30分後に起きて餌をやることになりました。\n猫は少し不機嫌そうです。',
            [
              new ParameterChange('affection', -5),
              new ParameterChange('stress', 15),
              new ParameterChange('hunger', -30),
            ]
          ),
        ],
      ])
    ),

    // イベント2: トイレ掃除
    new Event(
      'event-2',
      new EventTitle('トイレ掃除'),
      new EventDescription(
        '出勤前、猫のトイレを見ると、排泄物がたまっています。\n掃除しないと部屋が臭くなりそうですが、もう家を出る時間です。'
      ),
      [
        new Choice('clean', '遅刻覚悟で掃除する'),
        new Choice('skip', '帰宅後に掃除する（サボる）'),
      ],
      new Map<string, EventResult>([
        [
          'clean',
          new EventResult(
            'トイレをきれいにしました。猫も快適そうです。\n会社には5分遅刻しました。',
            [
              new ParameterChange('affection', 5),
              new ParameterChange('stress', -10),
            ]
          ),
        ],
        [
          'skip',
          new EventResult(
            'トイレをそのままにして出勤しました。\n夕方帰宅すると、部屋中が臭います…\n猫もストレスを感じているようです。',
            [
              new ParameterChange('stress', 20),
              new ParameterChange('health', -5),
            ]
          ),
        ],
      ])
    ),

    // イベント3: 夜の遊び
    new Event(
      'event-3',
      new EventTitle('夜の遊び'),
      new EventDescription(
        '帰宅後、疲れているあなたを猫が見つめています。\nおもちゃを持ってきて、遊んでほしそうにしています。'
      ),
      [
        new Choice('play', '一緒に遊ぶ（30分）'),
        new Choice('skip-play', '疲れているので今日は遊ばない'),
      ],
      new Map<string, EventResult>([
        [
          'play',
          new EventResult(
            '猫じゃらしで30分遊びました。\n猫は大満足で、あなたに甘えてきます。\nあなたも少し癒されました。',
            [
              new ParameterChange('affection', 15),
              new ParameterChange('stress', -20),
            ]
          ),
        ],
        [
          'skip-play',
          new EventResult(
            '猫を無視してソファに座りました。\n猫は少し寂しそうにしています。',
            [
              new ParameterChange('affection', -10),
              new ParameterChange('stress', 10),
            ]
          ),
        ],
      ])
    ),
  ];
};
