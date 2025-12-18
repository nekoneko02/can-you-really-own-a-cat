import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <main className="max-w-2xl px-8 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          君はねこを飼えるか？
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          プロトタイプ版
        </p>
        <p className="text-sm text-gray-500 mb-8">
          飼う前に、猫を知ろう
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            このゲームについて
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            このゲームは「ねこを飼うか迷っている人」に向けた、判断材料を提供するシミュレーションです。<br />
            責任感を押し付けるのではなく、「気づき」を与えることを目的としています。<br />
            <br />
            <strong>プロトタイプ版では、3つの基本的なイベントを体験できます。</strong>
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              📊 令和5年度の猫の殺処分数: <strong>6,899頭</strong><br />
              「やっぱり飼わない」という選択も、成功です。
            </p>
          </div>
        </div>

        <Link
          href="/onboarding"
          className="inline-block bg-blue-500 text-white text-lg font-bold px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
        >
          ゲームを始める
        </Link>
      </main>
    </div>
  );
}
