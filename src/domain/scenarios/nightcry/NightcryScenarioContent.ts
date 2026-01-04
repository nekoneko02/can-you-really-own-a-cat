/**
 * 夜泣きシナリオのコンテンツ定義
 *
 * 各フェーズのテキスト、選択肢、即時反映テキストを定義します。
 */

import type { PhaseNumber, PhaseSelection } from './NightcryScenarioState';
import type { TimeOfDay } from '@/components/scenario/SceneBackground';

/** 選択肢の型 */
export interface ScenarioChoice {
  id: 'A' | 'B' | 'C';
  text: string;
}

/** フェーズコンテンツの型 */
export interface PhaseContent {
  phase: PhaseNumber;
  theme: string;
  hasAudio: boolean;
  timeOfDay: TimeOfDay;
  pages: string[];
  questionText: string;
  choices: ScenarioChoice[];
  responses: Record<'A' | 'B' | 'C', string>;
  closingPages: string[];
}

/** 全フェーズのコンテンツ */
interface ScenarioContentData {
  phases: Record<PhaseNumber, PhaseContent>;
}

/**
 * 夜泣きシナリオのコンテンツ
 */
export const NightcryScenarioContent: ScenarioContentData = {
  phases: {
    1: {
      phase: 1,
      theme: '初めて知る',
      hasAudio: true,
      timeOfDay: 'night',
      pages: [
        'ニャーオ...　ニャーオ...',
        '暗い部屋に、鳴き声が響いている。',
        'しばらく、鳴き続けている。',
        '「どうしたんだろう...」\n\nこれまで、こんなことはなかった。',
        '布団の中で、目が覚める。',
      ],
      questionText: 'そのとき、あなたはどうなりましたか？',
      choices: [
        { id: 'A', text: '一度目が覚めたが、すぐまた眠れた' },
        { id: 'B', text: '一度起きて、ねこの様子を見に行った' },
        { id: 'C', text: '目が覚めてしまって、しばらく寝付けなかった' },
      ],
      responses: {
        A: '目は覚めたが、そのまま眠りについた。',
        B: '鳴き声が止むのを待った。「やっと鳴き止んだ...」',
        C: '目を閉じても、もう眠れる感じがしなかった。寝付けたのはしばらく経ってからだ。',
      },
      closingPages: [
        '朝になった。',
        'ねこは、いつもと変わらない様子だ。',
        '「たまたまかな」\n\nそう思った。',
      ],
    },
    2: {
      phase: 2,
      theme: '繰り返しに気づく',
      hasAudio: true,
      timeOfDay: 'night',
      pages: [
        '数日後。',
        'ニャーオ...　ニャーオ...',
        '暗い部屋に、また鳴き声が響いている。',
        '目が覚めた。',
      ],
      questionText: '今回は、どう感じましたか？',
      choices: [
        { id: 'A', text: '前より気にならなかった' },
        { id: 'B', text: 'またか、と思った' },
        { id: 'C', text: '正直、少し嫌だと感じた' },
      ],
      responses: {
        A: '前ほど驚かなかった。こういうこともあるのかもしれない。',
        B: '「まただ...」',
        C: '「はぁ、眠りたいのに...」',
      },
      closingPages: ['朝。', 'ねこは、変わらずそばにいる。'],
    },
    3: {
      phase: 3,
      theme: '質の違う睡眠不足',
      hasAudio: true,
      timeOfDay: 'dawn',
      pages: [
        'ニャーオ...　ニャーオ...',
        'また鳴き声が聞こえた。',
        '窓の外を見ると、うっすら明るくなり始めている。',
        '「もうすぐで朝か...」',
      ],
      questionText: 'そのあと、あなたはどうなりましたか？',
      choices: [
        { id: 'A', text: 'そのあとすぐに眠れた' },
        { id: 'B', text: 'なかなか眠れなかった' },
        { id: 'C', text: '寝付けず、そのまま起きてしまった' },
      ],
      responses: {
        A: 'なんとか眠りについた。目覚ましが鳴るまで眠れた。',
        B: '眠れたり、眠れなかったり。浅い眠りが続いた。',
        C: '結局、そのまま朝を迎えた。「眠い...」',
      },
      closingPages: [],
    },
    4: {
      phase: 4,
      theme: '日中への影響',
      hasAudio: false,
      timeOfDay: 'day',
      pages: [
        '昼間、作業をしていると、ふとあくびが出た。',
        '「今日はなんだか眠いかも...」',
      ],
      questionText: '最近、日中はどうですか？',
      choices: [
        { id: 'A', text: 'そこまで影響はない' },
        { id: 'B', text: '集中しづらい日がある' },
        { id: 'C', text: '明らかに影響している' },
      ],
      responses: {
        A: 'なんとか回っている。',
        B: '些細なことで、疲れを感じることが増えた。',
        C: '「最近、イライラすることが増えた気がする...」',
      },
      closingPages: [],
    },
    5: {
      phase: 5,
      theme: '慢性化と振り返り',
      hasAudio: false,
      timeOfDay: 'night',
      pages: [
        '夜に鳴く。\n\n早朝にも鳴くことがある。',
        'それが、続いている。',
        '毎日ではない。\n\nでも、「今日は大丈夫だった」「今日は起こされた」\n\nそれが、交互にやってくる。',
        'そして、しばらく経った。',
        '...\n\n変わらない。',
      ],
      questionText: '今の正直な感覚に近いのは？',
      choices: [
        { id: 'A', text: '思ったより、続けられそう' },
        { id: 'B', text: '正直、よくわからない' },
        { id: 'C', text: '自分には、かなり大変そう' },
      ],
      responses: {
        A: '「ぐっすり眠れない日もあるけど、なんとかなりそう」',
        B: '「...」',
        C: '「ちょっとつらいな。後悔...しているのかな...」',
      },
      closingPages: [],
    },
  },
};

/**
 * 指定フェーズのコンテンツを取得
 * @param phase フェーズ番号
 * @returns フェーズコンテンツ
 */
export function getPhaseContent(phase: PhaseNumber): PhaseContent {
  return NightcryScenarioContent.phases[phase];
}

/**
 * 選択に対するレスポンステキストを取得
 * @param phase フェーズ番号
 * @param selection 選択肢（A/B/C）
 * @returns レスポンステキスト
 */
export function getChoiceResponse(
  phase: PhaseNumber,
  selection: Exclude<PhaseSelection, null>
): string {
  return NightcryScenarioContent.phases[phase].responses[selection];
}

/**
 * 締めテキストを取得
 * @param phase フェーズ番号
 * @returns 締めテキスト配列
 */
export function getClosingText(phase: PhaseNumber): string[] {
  return NightcryScenarioContent.phases[phase].closingPages;
}
