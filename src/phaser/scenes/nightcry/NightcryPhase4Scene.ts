/**
 * NightcryPhase4Scene
 *
 * フェーズ4: 慢性化と消耗
 *
 * 演出: なし
 * 共通描写 → 選択肢 → 即時反映 → 合流
 */

import { PhaseNumber } from '@/domain/scenarios/nightcry/NightcryScenarioState';
import {
  BaseNightcryPhaseScene,
  PhaseContent,
} from './BaseNightcryPhaseScene';

export class NightcryPhase4Scene extends BaseNightcryPhaseScene {
  constructor() {
    super('NightcryPhase4Scene');
  }

  getPhaseNumber(): PhaseNumber {
    return 4;
  }

  getPhaseContent(): PhaseContent {
    return {
      commonText: [
        '夜に鳴く。\n早朝にも鳴くことがある。',
        'それが、続いている。',
        '毎日ではない。',
        'でも、「今日は大丈夫だった」「今日は起こされた」\nそれが、交互にやってくる。',
      ],
      choices: [
        { id: 'A', label: 'そこまで影響はない' },
        { id: 'B', label: '集中しづらい日がある' },
        { id: 'C', label: '明らかに影響している' },
      ],
      immediateResponses: {
        A: 'なんとか回っている。',
        B: '些細なことで、疲れを感じることが増えた。',
        C: '「最近、イライラすることが増えた気がする…」',
      },
      endingText: [
        'それでも、今日も夜は来る。',
      ],
      hasAudio: false,
    };
  }

  getNextSceneKey(): string {
    return 'NightcryPhase5Scene';
  }
}
