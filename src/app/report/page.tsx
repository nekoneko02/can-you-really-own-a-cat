'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameResult } from '@/phaser/bridge/types';

export default function ReportPage() {
  const router = useRouter();
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [catName, setCatName] = useState('たま');

  useEffect(() => {
    // gameResultを取得（localStorage）
    const resultStr = localStorage.getItem('gameResult');
    if (resultStr) {
      setGameResult(JSON.parse(resultStr));
    }

    // 猫の名前を取得
    const name = localStorage.getItem('catName');
    if (name) {
      setCatName(name);
    }
  }, []);

  if (!gameResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">読み込み中...</p>
          <button
            onClick={() => router.push('/game')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            ゲームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <main className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
            1週間、お疲れさまでした！
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {catName}との7日間を体験しました
          </p>

          {/* あなたの飼育適性診断 */}
          <div className="border-t-2 border-gray-300 pt-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              あなたの飼育適性診断
            </h2>
          </div>

          {/* プレイヤー統計 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              【あなたの1週間】
            </h3>
            <div className="bg-blue-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">総睡眠時間:</span>
                <span className="font-bold text-gray-800">
                  {gameResult.playerStats.totalSleepTime}時間
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">起こされた回数:</span>
                <span className="font-bold text-gray-800">
                  {gameResult.playerStats.interruptedCount}回
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">遊んだ回数:</span>
                <span className="font-bold text-gray-800">
                  {gameResult.playerStats.playedCount}回
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">撫でた回数:</span>
                <span className="font-bold text-gray-800">
                  {gameResult.playerStats.pettedCount}回
                </span>
              </div>
            </div>
          </section>

          {/* 猫の最終状態 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              【{catName}の最終的な様子】
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">なつき度</div>
                <div className="text-2xl font-bold text-green-700">
                  {gameResult.finalCatStatus.affection}/100
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${gameResult.finalCatStatus.affection}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">ストレス</div>
                <div className="text-2xl font-bold text-yellow-700">
                  {gameResult.finalCatStatus.stress}/100
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${gameResult.finalCatStatus.stress}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">健康度</div>
                <div className="text-2xl font-bold text-red-700">
                  {gameResult.finalCatStatus.health}/100
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${gameResult.finalCatStatus.health}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">空腹度</div>
                <div className="text-2xl font-bold text-purple-700">
                  {gameResult.finalCatStatus.hunger}/100
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${gameResult.finalCatStatus.hunger}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          {/* 振り返りレポート */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              【振り返りレポート】
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                {gameResult.report.summary}
              </p>

              {gameResult.report.strengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold text-green-700 mb-2">
                    得意だったこと:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {gameResult.report.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-700">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {gameResult.report.weaknesses.length > 0 && (
                <div>
                  <h4 className="font-bold text-red-700 mb-2">
                    苦手だったこと:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {gameResult.report.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-gray-700">
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {gameResult.report.strengths.length === 0 &&
                gameResult.report.weaknesses.length === 0 && (
                  <p className="text-sm text-gray-600">
                    詳細なレポート機能は今後のバージョンで実装予定です。
                  </p>
                )}
            </div>
          </section>

          {/* 統計データとの比較 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              【統計データとの比較】
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                あなたが体験したシーンは、実際の飼育放棄理由に基づいています。
              </p>

              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="font-bold text-gray-800 mb-2">
                  📊 令和5年度の猫の殺処分数: <span className="text-red-600">6,899頭</span>
                </p>
                <p className="text-sm text-gray-600 mb-3">主な原因:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 飼い主の病気・介護 (32%)</li>
                  <li>• 転居 (10%)</li>
                  <li>• 離婚 (8%)</li>
                  <li>• 問題行動 (3%)</li>
                </ul>
              </div>

              {gameResult.playerStats.interruptedCount > 10 && (
                <p className="text-gray-700">
                  睡眠不足で苦労したあなたは、実際の飼い主の多くと同じ経験をしました。
                </p>
              )}
            </div>
          </section>

          {/* 重要な注意 */}
          <section className="mb-8">
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-800 mb-3">
                【⚠️ 重要な注意】
              </h3>
              <div className="space-y-2 text-gray-700">
                <p className="font-bold text-lg">
                  ゲームで飼えた ≠ 実際に飼える
                </p>
                <p>実際はもっと大変です。</p>
                <p>この体験を踏まえて、慎重に判断してください。</p>
              </div>
            </div>
          </section>

          {/* イベント履歴 */}
          {gameResult.eventHistory.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                【イベント履歴】
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-2">
                  {gameResult.eventHistory.map((event, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 border-b border-gray-200 pb-2"
                    >
                      <span className="font-bold">
                        Day {event.day} ({event.time}時)
                      </span>
                      : {event.resultText}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => router.push('/survey')}
              className="flex-1 bg-blue-500 text-white text-lg font-bold px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
            >
              アンケートに答える
            </button>
            <button
              onClick={() => router.push('/game')}
              className="flex-1 bg-gray-300 text-gray-700 text-lg font-bold px-8 py-4 rounded-lg hover:bg-gray-400 transition-colors shadow-lg"
            >
              もう一度プレイ
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
