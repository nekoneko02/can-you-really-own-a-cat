'use client';

import { useRouter } from 'next/navigation';

/**
 * ホーム画面
 *
 * プロダクトのコンセプトを伝え、ターゲットユーザーが「自分に必要だ」と感じられるようにする。
 * シナリオ体験への導線を提供する。
 */
export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/intro');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center px-4 py-8">
      <main className="max-w-lg w-full">
        {/* タイトルエリア */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            君はねこを飼えるか？
          </h1>
          <div className="w-24 h-0.5 bg-amber-400 mx-auto mb-3" />
          <p className="text-lg text-amber-200">飼う前に、猫を知ろう</p>
        </header>

        {/* 猫のイラスト */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/characters/cat/sitting_1.png"
            alt="猫のイラスト"
            className="w-48 h-48 object-contain opacity-90"
          />
        </div>

        {/* コンセプトエリア */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 mb-6">
          <p className="text-lg text-white font-medium mb-4 text-center">
            猫を飼うか迷っていますか？
          </p>
          <p className="text-gray-300 leading-relaxed text-center">
            夜中の鳴き声、突然の病院代、毎日のお世話——
            <br />
            飼ってから気づく日常を、ここで体験してみてください。
          </p>
        </div>

        {/* 強調メッセージ */}
        <p className="text-center text-amber-300 font-bold text-lg mb-8">
          飼った後に後悔しないために。
        </p>

        {/* CTAボタン */}
        <div className="text-center">
          <button
            onClick={handleStart}
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-lg px-10 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            はじめる
          </button>
        </div>
      </main>
    </div>
  );
}
