/**
 * NightcryPhase2Scene
 *
 * フェーズ2: また起こされる
 *
 * 演出: 鳴き声再生
 * 共通描写 → 選択肢 → 即時反映 → 合流
 */

import { PhaseNumber } from '@/domain/scenarios/nightcry/NightcryScenarioState';
import {
  BaseNightcryPhaseScene,
  PhaseContent,
} from './BaseNightcryPhaseScene';

export class NightcryPhase2Scene extends BaseNightcryPhaseScene {
  constructor() {
    super('NightcryPhase2Scene');
  }

  getPhaseNumber(): PhaseNumber {
    return 2;
  }

  getPhaseContent(): PhaseContent {
    return {
      commonText: [
        '数日後。',
        'また、夜に鳴き声で目が覚めた。',
      ],
      choices: [
        { id: 'A', label: '前より気にならなかった' },
        { id: 'B', label: 'またか、と思った' },
        { id: 'C', label: '少し嫌だと感じた' },
      ],
      immediateResponses: {
        A: '前ほど驚かなかった。\nこういうこともあるのかもしれない。',
        B: '「まただ…」',
        C: '「はぁ、眠りたいのに…」',
      },
      endingText: [
        '朝。',
        'ねこは、変わらずそばにいる。',
      ],
      hasAudio: true,
    };
  }

  getNextSceneKey(): string {
    return 'NightcryPhase3Scene';
  }
}
