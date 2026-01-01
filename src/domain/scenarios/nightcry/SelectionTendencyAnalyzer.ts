/**
 * 選択傾向を分析するクラス
 *
 * プレイヤーの選択パターンから傾向を算出します。
 */

import type {
  PhaseSelections,
  SelectionTendency,
} from './NightcryScenarioState';

/** 選択肢ごとのカウント */
export interface SelectionCounts {
  A: number;
  B: number;
  C: number;
}

/** 傾向判定の閾値 */
const TENDENCY_THRESHOLD = 3;

export class SelectionTendencyAnalyzer {
  /**
   * 選択傾向を分析
   *
   * 判定条件:
   * - resilient: Aが3つ以上
   * - struggling: Cが3つ以上
   * - aware: Bが3つ以上
   * - mixed: 上記以外
   *
   * @param selections 各フェーズの選択
   * @returns 選択傾向
   */
  static analyze(selections: PhaseSelections): SelectionTendency {
    const counts = this.countSelections(selections);

    // 優先順位: resilient > struggling > aware > mixed
    if (counts.A >= TENDENCY_THRESHOLD) {
      return 'resilient';
    }

    if (counts.C >= TENDENCY_THRESHOLD) {
      return 'struggling';
    }

    if (counts.B >= TENDENCY_THRESHOLD) {
      return 'aware';
    }

    return 'mixed';
  }

  /**
   * 各選択肢のカウントを取得
   * @param selections 各フェーズの選択
   * @returns 選択肢ごとのカウント
   */
  static countSelections(selections: PhaseSelections): SelectionCounts {
    const counts: SelectionCounts = { A: 0, B: 0, C: 0 };

    const values = [
      selections.phase1,
      selections.phase2,
      selections.phase3,
      selections.phase4,
      selections.phase5,
    ];

    for (const value of values) {
      if (value === 'A') counts.A++;
      else if (value === 'B') counts.B++;
      else if (value === 'C') counts.C++;
      // null はカウントしない
    }

    return counts;
  }
}
