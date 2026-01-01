/**
 * NightcryPhase5Scene
 *
 * フェーズ5: しばらく経ったあと
 *
 * 演出: なし
 * 共通描写 → 選択肢 → 即時反映 → NightcryEndingSceneへ遷移
 */

import { PhaseNumber } from '@/domain/scenarios/nightcry/NightcryScenarioState';
import {
  BaseNightcryPhaseScene,
  PhaseContent,
} from './BaseNightcryPhaseScene';

export class NightcryPhase5Scene extends BaseNightcryPhaseScene {
  constructor() {
    super('NightcryPhase5Scene');
  }

  getPhaseNumber(): PhaseNumber {
    return 5;
  }

  getPhaseContent(): PhaseContent {
    return {
      commonText: [
        'それから、しばらく経った。',
        '毎日ではないけど、夜に鳴く日もある。\n早朝に起こされる日もある。',
      ],
      choices: [
        { id: 'A', label: '続けられそう' },
        { id: 'B', label: 'よくわからない' },
        { id: 'C', label: 'かなり大変そう' },
      ],
      immediateResponses: {
        A: '「ぐっすり眠れない日もあるけど、なんとかなりそう」',
        B: '「…」',
        C: '「ちょっとつらいな。後悔…しているのかな…」',
      },
      endingText: [],
      hasAudio: false,
    };
  }

  getNextSceneKey(): string {
    return 'NightcryEndingScene';
  }
}
