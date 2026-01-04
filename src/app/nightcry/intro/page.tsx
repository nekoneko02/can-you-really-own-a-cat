'use client';

import { useRouter } from 'next/navigation';

/**
 * シナリオ説明画面
 *
 * 体験内容の説明と心構えを作る。
 * これから何を体験するか説明し、開始時アンケートへ遷移する。
 */
export default function IntroPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/nightcry/survey/start');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center px-4 py-8">
      <main className="max-w-lg w-full">
        {/* タイトルエリア */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            夜泣き・睡眠不足
          </h1>
          <div className="w-24 h-0.5 bg-amber-400 mx-auto mb-3" />
          <p className="text-lg text-amber-200">ある飼い主の体験</p>
        </header>

        {/* 体験の前提 */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 mb-6">
          <p className="text-lg text-white font-medium text-center">
            あなたは架空の猫の飼い主として、日常を体験します。
          </p>
        </div>

        {/* 概要 */}
        <div className="bg-slate-900/30 rounded-xl p-6 mb-6">
          <p className="text-gray-300 leading-relaxed mb-4">
            猫を迎えて数週間。
            <br />
            ある夜、鳴き声で目が覚めた——
          </p>
          <p className="text-gray-300 leading-relaxed">
            この体験では、夜泣きによる睡眠不足がどのように日常に影響するかを体験します。
          </p>
        </div>

        {/* 所要時間 */}
        <div className="text-center mb-4">
          <p className="text-gray-400">
            所要時間：<span className="text-amber-200">約5〜10分</span>
          </p>
        </div>

        {/* 注意事項 */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            ※ 音声が流れます
          </p>
        </div>

        {/* CTAボタン */}
        <div className="text-center">
          <button
            onClick={handleStart}
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-lg px-10 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            体験をはじめる
          </button>
        </div>
      </main>
    </div>
  );
}
