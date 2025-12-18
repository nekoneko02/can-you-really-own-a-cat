'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SurveyData {
  desireAfterPlay: string; // プレイ後の飼育意欲
  understanding: number; // 飼育に対する理解度（1-5）
  mostImpressive: string; // 最も印象に残ったシーン
}

export default function SurveyPage() {
  const router = useRouter();
  const [data, setData] = useState<SurveyData>({
    desireAfterPlay: '',
    understanding: 0,
    mostImpressive: '',
  });

  const handleSubmit = () => {
    // アンケート結果を保存（API送信等）
    localStorage.setItem('surveyData', JSON.stringify(data));
    console.log('アンケート結果:', data);
    router.push('/decision');
  };

  const isFormValid = data.desireAfterPlay && data.understanding > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <main className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            プレイ後アンケート
          </h1>
          <div className="border-b-2 border-gray-300 mb-6"></div>

          <p className="text-gray-600 mb-6">
            ゲームをプレイしていただき、ありがとうございました。
            今後の改善のため、簡単なアンケートにご協力ください。
          </p>

          {/* Q1: プレイ後の飼育意欲 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Q1. プレイ後、猫を飼いたいと思いますか？
            </h2>
            <div className="space-y-2">
              {[
                { value: 'very_much', label: '非常に飼いたい' },
                { value: 'somewhat', label: 'やや飼いたい' },
                { value: 'think_more', label: 'もう少し考えたい' },
                { value: 'decided_not', label: 'やめておこうと思う' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="desireAfterPlay"
                    value={option.value}
                    checked={data.desireAfterPlay === option.value}
                    onChange={(e) =>
                      setData({ ...data, desireAfterPlay: e.target.value })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </section>

          <div className="border-t border-gray-300 my-6"></div>

          {/* Q2: 飼育に対する理解度 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Q2. プレイ前と比べて、飼育に対する理解は深まりましたか？
            </h2>
            <div className="flex justify-center gap-2 my-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setData({ ...data, understanding: rating })}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    data.understanding >= rating
                      ? 'bg-yellow-400 border-yellow-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400 hover:border-yellow-400'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>全く深まらなかった</span>
              <span>とても深まった</span>
            </div>
          </section>

          <div className="border-t border-gray-300 my-6"></div>

          {/* Q3: 最も印象に残ったシーン */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Q3. どのシーンが最も印象に残りましたか？
            </h2>
            <textarea
              value={data.mostImpressive}
              onChange={(e) =>
                setData({ ...data, mostImpressive: e.target.value })
              }
              placeholder="例: 夜中に起こされて睡眠不足になったシーン&#10;例: 猫と遊ぶのが楽しかったシーン"
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-sm text-gray-600 mt-2">
              自由に記述してください（任意）
            </p>
          </section>

          <div className="border-t border-gray-300 my-6"></div>

          {/* 送信ボタン */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="bg-blue-500 text-white text-lg font-bold px-12 py-4 rounded-lg hover:bg-blue-600 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              送信
            </button>
            {!isFormValid && (
              <p className="text-sm text-red-600 mt-3">
                すべての質問に回答してください
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
