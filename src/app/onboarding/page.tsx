'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Step = 1 | 2 | 3;

interface OnboardingData {
  // ステップ2: あなたについて
  desireLevel: string;
  concerns: string[];
  // ステップ3: 基本情報
  monthlyBudget: string;
  dailyFreeTime: string;
  housingType: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<OnboardingData>({
    desireLevel: '',
    concerns: [],
    monthlyBudget: '',
    dailyFreeTime: '',
    housingType: '',
  });

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as Step);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleSkip = () => {
    router.push('/cat-name');
  };

  const handleConcernToggle = (concern: string) => {
    setData((prev) => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter((c) => c !== concern)
        : [...prev.concerns, concern],
    }));
  };

  const handleSubmit = () => {
    // データを保存（localStorage）
    localStorage.setItem('onboardingData', JSON.stringify(data));
    router.push('/cat-name');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <main className="max-w-2xl px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            プロフィール設定
          </h1>
          <div className="border-b-2 border-gray-300 mb-6"></div>

          {/* ステップ1: ゲームの目的 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                【ステップ1/3: ゲームの目的】
              </h2>
              <div className="text-gray-700 leading-relaxed mb-6 space-y-4">
                <p>このゲームは「気づき」を与えるツールです。</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>責任感を押し付けない</li>
                  <li>リアルな大変さを体験</li>
                  <li>「やめた」も成功</li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  このゲームでは、猫との1週間の生活を疑似体験します。
                  実際の飼育で起こりうる状況を通じて、
                  「本当に自分は猫を飼えるのか」を考えるきっかけを提供します。
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleNext}
                  className="flex-1 bg-blue-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  次へ
                </button>
                <button
                  onClick={handleSkip}
                  className="bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  スキップ
                </button>
              </div>
            </div>
          )}

          {/* ステップ2: あなたについて */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                【ステップ2/3: あなたについて】
              </h2>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-3">
                  猫を飼いたいと思っていますか？
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'very_much', label: '非常に飼いたい' },
                    { value: 'somewhat', label: 'やや飼いたい' },
                    { value: 'uncertain', label: '迷っている' },
                    { value: 'not_much', label: 'あまり飼いたくない' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="desireLevel"
                        value={option.value}
                        checked={data.desireLevel === option.value}
                        onChange={(e) =>
                          setData({ ...data, desireLevel: e.target.value })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-3">
                  飼育に対する不安はありますか？（複数選択可）
                </label>
                <div className="space-y-2">
                  {[
                    '時間的負担',
                    '経済的負担',
                    '住環境',
                    '睡眠への影響',
                    '衛生面',
                    '生活の自由度',
                    'その他',
                  ].map((concern) => (
                    <label
                      key={concern}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={data.concerns.includes(concern)}
                        onChange={() => handleConcernToggle(concern)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">{concern}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-blue-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  次へ
                </button>
              </div>
            </div>
          )}

          {/* ステップ3: 基本情報 */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                【ステップ3/3: 基本情報】
              </h2>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">
                  自由に使えるお金/月:
                </label>
                <input
                  type="number"
                  value={data.monthlyBudget}
                  onChange={(e) =>
                    setData({ ...data, monthlyBudget: e.target.value })
                  }
                  placeholder="10000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-600 mt-1">
                  ※ 初期費用2〜3万円、月5,000〜10,000円が目安
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">
                  自由時間/日:
                </label>
                <input
                  type="number"
                  value={data.dailyFreeTime}
                  onChange={(e) =>
                    setData({ ...data, dailyFreeTime: e.target.value })
                  }
                  placeholder="2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-600 mt-1">
                  ※ 朝夕最低30分、トイレ掃除など
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-3">
                  住環境:
                </label>
                <div className="space-y-2">
                  {[
                    {
                      value: 'owned_pet_ok',
                      label: '持ち家ペット可',
                    },
                    {
                      value: 'rental_pet_ok',
                      label: '賃貸ペット可',
                    },
                    {
                      value: 'rental_pet_ng',
                      label: '賃貸ペット不可',
                    },
                    { value: 'other', label: 'その他' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="housingType"
                        value={option.value}
                        checked={data.housingType === option.value}
                        onChange={(e) =>
                          setData({ ...data, housingType: e.target.value })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {data.housingType === 'rental_pet_ng' && (
                  <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      ⚠️ 賃貸ペット不可の場合、飼育は推奨されません
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  ゲーム開始
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
