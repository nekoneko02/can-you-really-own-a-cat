'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Decision = 'adopt' | 'not_adopt' | 'think_more' | null;

export default function DecisionPage() {
  const router = useRouter();
  const [decision, setDecision] = useState<Decision>(null);

  const handleDecision = (choice: Decision) => {
    setDecision(choice);
    // 決断を保存
    localStorage.setItem('finalDecision', choice || '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <main className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            あなたの決断
          </h1>
          <div className="border-b-2 border-gray-300 mb-6"></div>

          <p className="text-gray-700 text-center mb-8">
            アンケートへのご協力ありがとうございました。
            <br />
            最後に、あなたの決断をお聞かせください。
          </p>

          {decision === null && (
            <div className="space-y-4">
              {/* 猫を飼う */}
              <button
                onClick={() => handleDecision('adopt')}
                className="w-full bg-green-50 border-2 border-green-300 rounded-lg p-6 text-left hover:bg-green-100 transition-colors"
              >
                <div className="flex items-start">
                  <span className="text-3xl mr-4">🐱</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      猫を飼う決断をした
                    </h2>
                    <p className="text-gray-600 text-sm">
                      次のステップへ進む:
                      保護猫団体の紹介、ペットショップ検索、飼育準備チェックリスト
                    </p>
                  </div>
                </div>
              </button>

              {/* 飼わない */}
              <button
                onClick={() => handleDecision('not_adopt')}
                className="w-full bg-blue-50 border-2 border-blue-300 rounded-lg p-6 text-left hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-start">
                  <span className="text-3xl mr-4">💭</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      飼わない決断をした
                    </h2>
                    <p className="text-gray-600 text-sm">
                      それも立派な決断です！
                      この体験があなたの役に立ったことを願っています。
                    </p>
                  </div>
                </div>
              </button>

              {/* もう少し考える */}
              <button
                onClick={() => handleDecision('think_more')}
                className="w-full bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-left hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-start">
                  <span className="text-3xl mr-4">🤔</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      もう少し考える
                    </h2>
                    <p className="text-gray-600 text-sm">
                      さらに情報を集めたい方へ:
                      猫の飼育ガイド、よくある質問、獣医師に相談する
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* 猫を飼う選択後 */}
          {decision === 'adopt' && (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
                🎉 素晴らしい決断です！
              </h2>
              <p className="text-gray-700 mb-6">
                猫との生活を始める前に、しっかりと準備を整えましょう。
                以下のリソースが役立ちます:
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">
                    📋 飼育準備チェックリスト
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 住居環境の確認（ペット可物件か）</li>
                    <li>• 初期費用の準備（2〜3万円）</li>
                    <li>• 月々の費用計画（5,000〜10,000円）</li>
                    <li>• 動物病院の事前調査</li>
                    <li>• 必要なグッズの購入リスト</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">
                    🏠 保護猫団体の紹介
                  </h3>
                  <p className="text-sm text-gray-700">
                    保護猫を迎えることで、命を救うことができます。
                    <br />
                    ※ 実際のリンクは今後実装予定
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">
                    📚 飼育ガイド
                  </h3>
                  <p className="text-sm text-gray-700">
                    初めて猫を飼う方向けのガイドブックをご用意しています。
                    <br />
                    ※ 今後実装予定
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setDecision(null)}
                  className="flex-1 bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={() => router.push('/game')}
                  className="flex-1 bg-blue-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  もう一度プレイ
                </button>
              </div>
            </div>
          )}

          {/* 飼わない選択後 */}
          {decision === 'not_adopt' && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
                💙 それも立派な決断です
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                猫を飼わないという決断は、とても責任ある選択です。
                <br />
                このゲームを通じて、猫を飼うことの大変さを知り、
                慎重に判断されたあなたは素晴らしいと思います。
              </p>

              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">
                  📊 あなたと同じように考えている人は多くいます
                </h3>
                <p className="text-gray-700 mb-3 text-sm">
                  令和5年度の猫の殺処分数: 6,899頭
                </p>
                <p className="text-gray-700 text-sm">
                  「やっぱり飼わない」という選択は、
                  無責任な飼育放棄を防ぐ第一歩です。
                  この体験があなたの役に立ったことを願っています。
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  💡 猫を飼わなくても、猫と触れ合う方法はあります:
                  <br />
                  • 猫カフェに行く
                  <br />
                  • ボランティアとして保護猫施設を手伝う
                  <br />• 友人の猫を預かる（一時的な体験）
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setDecision(null)}
                  className="flex-1 bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={() => router.push('/game')}
                  className="flex-1 bg-blue-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  もう一度プレイ
                </button>
              </div>
            </div>
          )}

          {/* もう少し考える選択後 */}
          {decision === 'think_more' && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-yellow-800 mb-4 text-center">
                🤔 じっくり考えましょう
              </h2>
              <p className="text-gray-700 mb-6">
                猫を飼うかどうか、慎重に考えることは大切です。
                以下のリソースで、さらに情報を集めてください:
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">
                    📖 猫の飼育ガイド
                  </h3>
                  <p className="text-sm text-gray-700">
                    猫の基本的な飼育方法、必要な費用、飼育環境について学べます。
                    <br />
                    ※ 今後実装予定
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">
                    ❓ よくある質問
                  </h3>
                  <p className="text-sm text-gray-700">
                    「猫を飼う前に知っておくべきこと」「費用はどれくらいかかる？」など
                    <br />
                    ※ 今後実装予定
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">
                    🩺 獣医師に相談する
                  </h3>
                  <p className="text-sm text-gray-700">
                    猫の健康管理や病気について、専門家に相談できます。
                    <br />
                    ※ 今後実装予定
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setDecision(null)}
                  className="flex-1 bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={() => router.push('/game')}
                  className="flex-1 bg-blue-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  もう一度プレイ
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
