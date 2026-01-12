/**
 * ReportGenerator
 *
 * 夜泣きシナリオのレポート生成ロジック。
 * シナリオ設計書のレポート全文を構造化し、ユーザーの選択履歴を動的に挿入する。
 */

import type {
  PhaseSelections,
  NightcryReportData,
} from './NightcryScenarioState';

/**
 * ユーザーの選択表示用データ
 */
export interface UserChoiceDisplay {
  phaseNumber: number;
  phaseTitle: string;
  choiceText: string;
}

/**
 * レポートの冒頭セクション
 */
export interface ReportHeader {
  intro: string;
  duration: string;
  catLifespan: string;
  mainQuestion: string;
}

/**
 * 統計セクション
 */
export interface ReportStatistics {
  title: string;
  regretRate: string;
  sleepDeprivationRate: string;
  sources: string[];
}

/**
 * 体験サマリーセクション
 */
export interface ReportExperienceSummary {
  intro: string;
  events: string[];
  keyPoint: string;
}

/**
 * 判断の視点セクション
 */
export interface ReportPerspectives {
  title: string;
  sleepQuality: { title: string; description: string };
  continuity: { title: string; description: string };
  individualDifference: {
    title: string;
    points: string[];
    note: string;
  };
  nightActivity: {
    title: string;
    points: string[];
  };
}

/**
 * 締めセクション
 */
export interface ReportClosing {
  ifDifficult: string;
  respectChoice: string;
  takeYourTime: string;
  note: string;
}

/**
 * レポート全体のコンテンツ
 */
export interface ReportContent {
  header: ReportHeader;
  statistics: ReportStatistics;
  experienceSummary: ReportExperienceSummary;
  userChoices: UserChoiceDisplay[];
  commonMessage: string;
  perspectives: ReportPerspectives;
  closing: ReportClosing;
}

/**
 * 静的レポートコンテンツ（シナリオ設計書より）
 */
interface StaticReportContent {
  header: ReportHeader;
  statistics: ReportStatistics;
  experienceSummary: ReportExperienceSummary;
  perspectives: ReportPerspectives;
  closing: ReportClosing;
}

/**
 * 各フェーズのタイトル
 */
const PHASE_TITLES: Record<keyof PhaseSelections, string> = {
  phase1: '初めての夜泣き',
  phase2: 'また起こされる',
  phase3: '早朝に起こされる',
  phase4: '日中への影響',
  phase5: '慢性化と振り返り',
};

/**
 * 各フェーズの選択肢ラベル
 */
const PHASE_CHOICES: Record<
  keyof PhaseSelections,
  Record<'A' | 'B' | 'C', string>
> = {
  phase1: {
    A: '一度目が覚めたが、すぐまた眠れた',
    B: '一度起きて、ねこの様子を見に行った',
    C: '目が覚めてしまって、しばらく寝付けなかった',
  },
  phase2: {
    A: '前より気にならなかった',
    B: 'またか、と思った',
    C: '正直、少し嫌だと感じた',
  },
  phase3: {
    A: 'そのあとすぐに眠れた',
    B: 'なかなか眠れなかった',
    C: '寝付けず、そのまま起きてしまった',
  },
  phase4: {
    A: 'そこまで影響はない',
    B: '集中しづらい日がある',
    C: '明らかに影響している',
  },
  phase5: {
    A: '思ったより、続けられそう',
    B: '正直、よくわからない',
    C: '自分には、かなり大変そう',
  },
};

/**
 * 共通メッセージ
 */
const COMMON_MESSAGE =
  '睡眠への影響は人によって異なります。一度起きても平気な人もいれば、翌日に響く人もいます。\n\nもし夜泣きが続いたとき、あなたはどうなりそうですか？';

/**
 * レポート生成クラス
 */
export class ReportGenerator {
  /**
   * 静的レポートコンテンツ（シナリオ設計書のレポート全文に基づく）
   */
  static readonly REPORT_CONTENT: StaticReportContent = {
    header: {
      intro: '夜泣きは、特別なトラブルではありません。',
      duration: '年単位で続く「日常」になる可能性があります。',
      catLifespan:
        '猫の平均寿命は15年です。15年続くかもしれません。途中で終わるかもしれません。ある日、突然始まるかもしれません。',
      mainQuestion:
        'この生活が続くとしたら、あなたは続けられそうですか？',
    },
    statistics: {
      title: '実は、多くの飼い主が経験している',
      regretRate:
        'この体験は架空のものですが、夜泣きや睡眠不足は珍しいことではありません。飼い主の約半数が「大変だった、後悔したと感じたことがある」と回答しています。',
      sleepDeprivationRate:
        'また、猫の飼い主の約7割が「愛猫のせいで寝不足になったことがある」という調査もあります。',
      sources: [
        'au損害保険: https://www.au-sonpo.co.jp/pc/pet-cat/column/post-35.html',
        'ねこのきもちWEB MAGAZINE: https://cat.benesse.ne.jp/withcat/content/?id=34290',
      ],
    },
    experienceSummary: {
      intro: '今回、あなたは架空の飼い主として、こんな体験をしました。',
      events: [
        'ある日突然、夜に起こされる',
        '数日後、また同じことが起こる',
        '早朝に起こされることもある',
        '毎日ではないが、長い期間にわたって続く',
      ],
      keyPoint:
        '最初は驚きや心配の対象だった夜泣きが、次第に「予測できない、でも珍しくもない」生活の一部になっていく。ポイントは、「一晩だけなら耐えられるかもしれないことが、生活として続いたときどうなるか」です。',
    },
    perspectives: {
      title: '判断するための視点',
      sleepQuality: {
        title: '睡眠の質',
        description:
          '自分の生活で、睡眠がどの程度重要か？削られたとき、どうなりそうか？',
      },
      continuity: {
        title: '継続性',
        description:
          '1日ではなく「年単位」で続く可能性がある。猫の平均寿命は15年。それでも続けられそうか？',
      },
      individualDifference: {
        title: '個体差と不確実性',
        points: [
          '夜泣きがほとんどない子もいれば、もっと激しい子もいます',
          'しつけで改善することもあれば、何をしても変わらないこともあります',
          '転勤、結婚、出産など、あなたの生活環境も変わります',
          '「今は大丈夫」でも、5年後、10年後はわかりません',
        ],
        note: 'この体験より軽いことも、重いこともありえます。',
      },
      nightActivity: {
        title: '夜の運動会はねこ次第',
        points: [
          '呼ぶように鳴く子もいます。寂しそうに鳴く子もいます。',
          '声の大きい子もいれば、声の小さめの子もいます。',
          '布団に乗ってきたり、顔を触ってきたりする子もいます。',
          '1人で走り回って、足音や物音が聞こえることもあります。',
        ],
      },
    },
    closing: {
      ifDifficult:
        'もし「自分には難しそう」と感じたなら、それも大切な気づきです。飼わないという選択は、猫にとっても、あなたにとっても、後悔のない判断かもしれません。',
      respectChoice:
        'もちろん、「覚悟を持って飼う」という選択も尊重されます。',
      takeYourTime:
        'どちらが正しいかではなく、どちらが自分に合っているかを考えてください。答えは急がなくて構いません。',
      note: 'このシナリオはあくまで一例です。猫を飼うことの苦労は、夜泣きだけではありません。この体験が、考えるための小さな材料になれば、それで十分です。',
    },
  };

  /**
   * レポートを生成
   * @param reportData レポートデータ
   * @returns レポートコンテンツ
   */
  static generateReport(reportData: NightcryReportData): ReportContent {
    const userChoices = this.formatUserChoices(reportData.selections);

    return {
      header: this.REPORT_CONTENT.header,
      statistics: this.REPORT_CONTENT.statistics,
      experienceSummary: this.REPORT_CONTENT.experienceSummary,
      userChoices,
      commonMessage: COMMON_MESSAGE,
      perspectives: this.REPORT_CONTENT.perspectives,
      closing: this.REPORT_CONTENT.closing,
    };
  }

  /**
   * ユーザーの選択をフォーマット
   * @param selections 各フェーズの選択
   * @returns フォーマット済み選択一覧
   */
  static formatUserChoices(selections: PhaseSelections): UserChoiceDisplay[] {
    const phases: Array<keyof PhaseSelections> = [
      'phase1',
      'phase2',
      'phase3',
      'phase4',
      'phase5',
    ];

    return phases.map((phase, index) => {
      const selection = selections[phase];
      const choiceText = selection
        ? PHASE_CHOICES[phase][selection]
        : '未選択';

      return {
        phaseNumber: index + 1,
        phaseTitle: PHASE_TITLES[phase],
        choiceText,
      };
    });
  }

  /**
   * 選択履歴をマークダウン形式で出力
   * {{user_choices}}の位置に挿入するためのテキスト
   * @param selections 各フェーズの選択
   * @returns マークダウンテキスト
   */
  static generateUserChoicesMarkdown(selections: PhaseSelections): string {
    const formatted = this.formatUserChoices(selections);
    const lines = formatted.map(
      (choice) => `- **${choice.phaseTitle}**: ${choice.choiceText}`
    );
    return lines.join('\n');
  }
}
