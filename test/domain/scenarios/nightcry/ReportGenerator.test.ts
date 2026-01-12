/**
 * ReportGenerator のテスト
 */

import { describe, it, expect } from '@jest/globals';
import {
  ReportGenerator,
  ReportContent,
  UserChoiceDisplay,
} from '@/domain/scenarios/nightcry/ReportGenerator';
import type {
  PhaseSelections,
  NightcryReportData,
} from '@/domain/scenarios/nightcry/NightcryScenarioState';

describe('ReportGenerator', () => {
  describe('generateReport', () => {
    it('レポートコンテンツを生成する', () => {
      const selections: PhaseSelections = {
        phase1: 'A',
        phase2: 'B',
        phase3: 'C',
        phase4: 'A',
        phase5: 'B',
      };
      const reportData: NightcryReportData = {
        selections,
      };

      const report = ReportGenerator.generateReport(reportData);

      expect(report).toBeDefined();
      expect(report.header).toBeDefined();
      expect(report.statistics).toBeDefined();
      expect(report.experienceSummary).toBeDefined();
      expect(report.userChoices).toBeDefined();
      expect(report.commonMessage).toBeDefined();
      expect(report.perspectives).toBeDefined();
      expect(report.closing).toBeDefined();
    });

    it('冒頭セクションに問いを含む', () => {
      const reportData: NightcryReportData = {
        selections: {
          phase1: 'A',
          phase2: 'A',
          phase3: 'A',
          phase4: 'A',
          phase5: 'A',
        },
      };

      const report = ReportGenerator.generateReport(reportData);

      expect(report.header.mainQuestion).toContain('この生活が続くとしたら');
    });

    it('共通メッセージが正しく設定される', () => {
      const reportData: NightcryReportData = {
        selections: {
          phase1: 'A',
          phase2: 'B',
          phase3: 'C',
          phase4: 'A',
          phase5: 'B',
        },
      };

      const report = ReportGenerator.generateReport(reportData);

      expect(report.commonMessage).toContain('睡眠への影響は人によって異なります');
      expect(report.commonMessage).toContain('もし夜泣きが続いたとき、あなたはどうなりそうですか？');
    });
  });

  describe('formatUserChoices', () => {
    it('選択履歴をフォーマットする', () => {
      const selections: PhaseSelections = {
        phase1: 'A',
        phase2: 'B',
        phase3: 'C',
        phase4: null,
        phase5: 'A',
      };

      const formatted = ReportGenerator.formatUserChoices(selections);

      expect(formatted).toHaveLength(5);
      expect(formatted[0].phaseTitle).toBe('初めての夜泣き');
      expect(formatted[0].choiceText).toContain('すぐまた眠れた');
      expect(formatted[3].choiceText).toBe('未選択');
    });

    it('全ての選択がnullの場合でも処理できる', () => {
      const selections: PhaseSelections = {
        phase1: null,
        phase2: null,
        phase3: null,
        phase4: null,
        phase5: null,
      };

      const formatted = ReportGenerator.formatUserChoices(selections);

      expect(formatted).toHaveLength(5);
      formatted.forEach((item) => {
        expect(item.choiceText).toBe('未選択');
      });
    });
  });

  describe('generateUserChoicesMarkdown', () => {
    it('選択履歴をマークダウン形式で出力する', () => {
      const selections: PhaseSelections = {
        phase1: 'A',
        phase2: 'B',
        phase3: 'C',
        phase4: 'A',
        phase5: 'B',
      };

      const markdown = ReportGenerator.generateUserChoicesMarkdown(selections);

      expect(markdown).toContain('初めての夜泣き');
      expect(markdown).toContain('また起こされる');
      expect(markdown).toContain('早朝に起こされる');
      expect(markdown).toContain('日中への影響');
      expect(markdown).toContain('慢性化と振り返り');
    });
  });

  describe('REPORT_CONTENT', () => {
    it('振り返りレポートの内容を含む', () => {
      const content = ReportGenerator.REPORT_CONTENT;

      expect(content.header.intro).toContain('夜泣きは、特別なトラブルではありません');
      expect(content.header.duration).toContain('年単位で続く');
      expect(content.header.catLifespan).toContain('15年');
    });

    it('統計情報を含む', () => {
      const content = ReportGenerator.REPORT_CONTENT;

      expect(content.statistics.regretRate).toContain('約半数');
      expect(content.statistics.sleepDeprivationRate).toContain('約7割');
    });

    it('体験サマリーを含む', () => {
      const content = ReportGenerator.REPORT_CONTENT;

      expect(content.experienceSummary.events).toHaveLength(4);
      expect(content.experienceSummary.keyPoint).toContain('一晩だけなら');
    });

    it('判断の視点を含む', () => {
      const content = ReportGenerator.REPORT_CONTENT;

      expect(content.perspectives.sleepQuality).toBeDefined();
      expect(content.perspectives.continuity).toBeDefined();
      expect(content.perspectives.individualDifference).toBeDefined();
      expect(content.perspectives.nightActivity).toBeDefined();
    });

    it('夜の運動会についての補足説明を含む', () => {
      const content = ReportGenerator.REPORT_CONTENT;

      expect(content.perspectives.nightActivity.title).toBe('夜の運動会はねこ次第');
      expect(content.perspectives.nightActivity.points).toHaveLength(4);
      expect(content.perspectives.nightActivity.points).toContain(
        '呼ぶように鳴く子もいます。寂しそうに鳴く子もいます。'
      );
      expect(content.perspectives.nightActivity.points).toContain(
        '声の大きい子もいれば、声の小さめの子もいます。'
      );
      expect(content.perspectives.nightActivity.points).toContain(
        '布団に乗ってきたり、顔を触ってきたりする子もいます。'
      );
      expect(content.perspectives.nightActivity.points).toContain(
        '1人で走り回って、足音や物音が聞こえることもあります。'
      );
    });

    it('締めの文言を含む', () => {
      const content = ReportGenerator.REPORT_CONTENT;

      expect(content.closing.ifDifficult).toContain('自分には難しそう');
      expect(content.closing.takeYourTime).toContain('答えは急がなくて構いません');
    });
  });
});
