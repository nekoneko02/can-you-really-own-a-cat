/**
 * NightcryPhase1Scene
 *
 * フェーズ1: 初めての夜泣き
 *
 * 演出: 鳴き声再生
 * 共通描写 → 選択肢 → 即時反映 → 合流・締め
 */

import { PhaseNumber } from '@/domain/scenarios/nightcry/NightcryScenarioState';
import {
  BaseNightcryPhaseScene,
  PhaseContent,
} from './BaseNightcryPhaseScene';

export class NightcryPhase1Scene extends BaseNightcryPhaseScene {
  constructor() {
    super('NightcryPhase1Scene');
  }

  getPhaseNumber(): PhaseNumber {
    return 1;
  }

  getPhaseContent(): PhaseContent {
    return {
      commonText: [
        '夜中、静かな部屋に鳴き声が響いた。',
        '「どうしたんだろう…」\nこれまで、こんなことはなかった。',
        '布団の中で、目が覚める。',
      ],
      choices: [
        { id: 'A', label: 'すぐまた眠れた' },
        { id: 'B', label: '様子を見に行った' },
        { id: 'C', label: 'しばらく寝付けなかった' },
      ],
      immediateResponses: {
        A: '目は覚めたが、そのまま眠りについた。',
        B: '鳴き声が止むのを待った。「やっと鳴き止んだ…」',
        C: '目を閉じても、もう眠れる感じがしなかった。\n寝付けたのはしばらく経ってからだ。',
      },
      endingText: [
        '朝になった。',
        'ねこは、いつもと変わらない様子だ。',
        '「たまたまかな」\nそう思った。',
      ],
      hasAudio: true,
    };
  }

  getNextSceneKey(): string {
    return 'NightcryPhase2Scene';
  }
}
