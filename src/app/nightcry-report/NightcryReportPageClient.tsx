'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { NightcryReportData } from '@/domain/scenarios/nightcry/NightcryScenarioState';
import {
  ReportGenerator,
  type ReportContent,
} from '@/domain/scenarios/nightcry/ReportGenerator';
import { surveyApiClient } from '@/lib/api/client';
import { getSession } from '@/lib/session/actions';

/**
 * 夜泣きシナリオ最終レポート画面（クライアントコンポーネント）
 *
 * シナリオ設計書のレポート全文を表示し、ユーザーの選択履歴を動的に挿入する。
 * 落ち着いたデザイン（穏やか、静か）で、スクロール可能な読み物形式。
 */
export default function NightcryReportPageClient() {
  const router = useRouter();
  const [report, setReport] = useState<ReportContent | null>(null);
  const [loading, setLoading] = useState(true);
  const scenarioCompleteCalledRef = useRef(false);

  useEffect(() => {
    const dataStr = localStorage.getItem('nightcryReportData');
    if (dataStr) {
      try {
        const reportData: NightcryReportData = JSON.parse(dataStr);
        const generatedReport = ReportGenerator.generateReport(reportData);
        setReport(generatedReport);
      } catch {
        console.error('Failed to parse nightcryReportData');
      }
    }
    setLoading(false);
  }, []);

  // シナリオ完了をDynamoDBに記録
  useEffect(() => {
    async function markScenarioComplete() {
      // 重複呼び出し防止
      if (scenarioCompleteCalledRef.current) return;
      scenarioCompleteCalledRef.current = true;

      try {
        const session = await getSession();
        if (session?.sessionId) {
          await surveyApiClient.markScenarioComplete('night-crying', session.sessionId);
        }
      } catch (error) {
        // エラーはログ出力のみ（ユーザー体験に影響させない）
        console.error('Failed to mark scenario complete:', error);
      }
    }

    markScenarioComplete();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center text-slate-200">
          <p className="mb-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center text-slate-200">
          <p className="mb-4">データが見つかりませんでした。</p>
          <button
            onClick={() => router.push('/')}
            className="bg-slate-700 text-slate-100 px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors"
          >
            トップに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 py-12 px-4">
      <main className="max-w-2xl mx-auto space-y-10">
        {/* 振り返りレポート（冒頭セクション） */}
        <section className="space-y-4">
          <h1 className="text-2xl font-bold text-slate-100 mb-6">
            振り返りレポート
          </h1>
          <p className="text-slate-300 leading-relaxed">
            {report.header.intro}
          </p>
          <p className="text-slate-300 leading-relaxed">
            {report.header.duration}
          </p>
          <p className="text-slate-300 leading-relaxed">
            {report.header.catLifespan}
          </p>
          <p className="text-lg text-amber-300 font-medium mt-6 leading-relaxed">
            {report.header.mainQuestion}
          </p>
        </section>

        <hr className="border-slate-700" />

        {/* 統計情報 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">
            {report.statistics.title}
          </h2>
          <p className="text-slate-300 leading-relaxed">
            {report.statistics.regretRate}
          </p>
          <p className="text-slate-300 leading-relaxed">
            {report.statistics.sleepDeprivationRate}
          </p>
          <div className="text-sm text-slate-500 mt-4">
            <p>出典:</p>
            <ul className="list-disc list-inside">
              {report.statistics.sources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          </div>
        </section>

        <hr className="border-slate-700" />

        {/* 体験サマリー */}
        <section className="space-y-4">
          <p className="text-slate-300 leading-relaxed">
            {report.experienceSummary.intro}
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            {report.experienceSummary.events.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
          <p className="text-slate-300 leading-relaxed mt-4">
            {report.experienceSummary.keyPoint}
          </p>
        </section>

        <hr className="border-slate-700" />

        {/* あなたの体験を振り返る */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">
            あなたの体験を振り返る
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            体験中、いくつかの選択がありました。これは正解・不正解ではなく、「自分はこうかもしれない」という傾向に気づくためのものです。
          </p>
          <div className="bg-slate-800 rounded-lg p-4 space-y-2">
            {report.userChoices.map((choice) => (
              <div
                key={choice.phaseNumber}
                className="flex justify-between text-slate-300 py-1 border-b border-slate-700 last:border-b-0"
              >
                <span className="text-slate-400">{choice.phaseTitle}:</span>
                <span className="font-medium">{choice.choiceText}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-300 leading-relaxed bg-slate-800 rounded-lg p-4 mt-4 whitespace-pre-line">
            {report.commonMessage}
          </p>
        </section>

        <hr className="border-slate-700" />

        {/* 判断するための視点 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">
            {report.perspectives.title}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            猫を飼うかどうかを考えるとき、以下の視点が参考になるかもしれません。
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-200">
                {report.perspectives.sleepQuality.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {report.perspectives.sleepQuality.description}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-200">
                {report.perspectives.continuity.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {report.perspectives.continuity.description}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-200">
                {report.perspectives.individualDifference.title}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {report.perspectives.individualDifference.points.map(
                  (point, index) => (
                    <li key={index}>{point}</li>
                  )
                )}
              </ul>
              <p className="text-slate-400 text-sm mt-2">
                {report.perspectives.individualDifference.note}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-200">
                {report.perspectives.nightActivity.title}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {report.perspectives.nightActivity.points.map(
                  (point, index) => (
                    <li key={index}>{point}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-slate-700" />

        {/* 最後に */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">最後に</h2>
          <p className="text-slate-300 leading-relaxed">
            {report.closing.ifDifficult}
          </p>
          <p className="text-slate-300 leading-relaxed">
            {report.closing.respectChoice}
          </p>
          <p className="text-slate-300 leading-relaxed">
            {report.closing.takeYourTime}
          </p>
          <p className="text-slate-400 text-sm mt-4 leading-relaxed">
            {report.closing.note}
          </p>
        </section>

        {/* アクションボタン */}
        <div className="pt-8">
          <button
            onClick={() => router.push('/survey/end')}
            className="w-full bg-slate-700 text-slate-100 text-lg font-bold px-8 py-4 rounded-lg hover:bg-slate-600 transition-colors"
          >
            アンケートに回答する
          </button>
        </div>
      </main>
    </div>
  );
}
