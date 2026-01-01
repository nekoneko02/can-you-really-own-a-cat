/**
 * NightcryPhase3Scene
 *
 * フェーズ3: 早朝に起こされる
 *
 * 演出: 鳴き声再生（meow_morning.mp3）
 * 共通描写 → 選択肢 → 即時反映 → 合流
 */

import { PhaseNumber } from '@/domain/scenarios/nightcry/NightcryScenarioState';
import {
  BaseNightcryPhaseScene,
  PhaseContent,
} from './BaseNightcryPhaseScene';

export class NightcryPhase3Scene extends BaseNightcryPhaseScene {
  constructor() {
    super('NightcryPhase3Scene');
  }

  getPhaseNumber(): PhaseNumber {
    return 3;
  }

  getPhaseContent(): PhaseContent {
    return {
      commonText: [
        'また鳴き声が聞こえた。',
        '窓の外を見ると、うっすら明るくなり始めている。',
        '「もうすぐで朝か…」',
      ],
      choices: [
        { id: 'A', label: 'そのあとすぐに眠れた' },
        { id: 'B', label: 'なかなか眠れなかった' },
        { id: 'C', label: 'そのまま起きてしまった' },
      ],
      immediateResponses: {
        A: 'なんとか眠りについた。\n目覚ましが鳴るまで眠れた。',
        B: '眠れたり、眠れなかったり。\n浅い眠りが続いた。',
        C: '結局、そのまま朝を迎えた。\n「眠い…」',
      },
      endingText: [
        '朝。',
        '体は起きているけれど、どこか重い。',
      ],
      hasAudio: true,
    };
  }

  getNextSceneKey(): string {
    return 'NightcryPhase4Scene';
  }
}
