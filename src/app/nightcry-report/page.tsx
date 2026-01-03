'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  NightcryReportData,
  PhaseSelections,
  SelectionTendency,
} from '@/domain/scenarios/nightcry/NightcryScenarioState';

/**
 * 各フェーズの選択肢ラベル
 */
const PHASE_CHOICES: Record<keyof PhaseSelections, Record<'A' | 'B' | 'C', string>> = {
  phase1: {
    A: 'すぐまた眠れた',
    B: '様子を見に行った',
    C: 'しばらく寝付けなかった',
  },
  phase2: {
    A: '前より気にならなかった',
    B: 'またか、と思った',
    C: '少し嫌だと感じた',
  },
  phase3: {
    A: 'そのあとすぐに眠れた',
    B: 'なかなか眠れなかった',
    C: 'そのまま起きてしまった',
  },
  phase4: {
    A: 'そこまで影響はない',
    B: '集中しづらい日がある',
    C: '明らかに影響している',
  },
  phase5: {
    A: '続けられそう',
    B: 'よくわからない',
    C: 'かなり大変そう',
  },
};

/**
 * 傾向に応じたテキスト
 */
const TENDENCY_TEXT: Record<SelectionTendency, string> = {
  resilient:
    '睡眠が削られても、比較的うまく適応できている傾向があります。ただ、これが長期間続いたときにどうなるかは、注意が必要かもしれません。',
  aware:
    '変化には気づいているものの、判断を保留している傾向があります。慎重に考えているとも言えますし、まだ決められないとも言えます。',
  struggling:
    '睡眠不足の影響を強く感じている傾向があります。もし実際にこうした生活が続いたとき、自分がどうなるかを想像してみてください。',
  mixed:
    '選択に一貫した傾向は見られませんでした。状況によって感じ方が変わるのは自然なことです。',
};

/**
 * フェーズタイトル
 */
const PHASE_TITLES: Record<keyof PhaseSelections, string> = {
  phase1: '初めての夜泣き',
  phase2: 'また起こされる',
  phase3: '早朝に起こされる',
  phase4: '慢性化と消耗',
  phase5: 'しばらく経ったあと',
};

export default function NightcryReportPage() {
  const router = useRouter();
  const [reportData, setReportData] = useState<NightcryReportData | null>(null);

  useEffect(() => {
    const dataStr = localStorage.getItem('nightcryReportData');
    if (dataStr) {
      try {
        setReportData(JSON.parse(dataStr));
      } catch {
        console.error('Failed to parse nightcryReportData');
      }
    }
  }, []);

  if (!reportData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <p className="mb-4">データを読み込んでいます...</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            トップに戻る
          </button>
        </div>
      </div>
    );
  }

  const { selections, tendency } = reportData;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
      <main className="max-w-3xl mx-auto space-y-8">
        {/* セクション1: 問い（冒頭） */}
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-4">
            これだけは考えてみてください：
          </h2>
          <p className="text-lg italic mb-6">
            それでも、この生活を続けたいと思えますか？
          </p>

          <h3 className="font-bold text-gray-300 mb-2">判断のヒント：</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6">
            <li>
              <strong>睡眠の質</strong>:
              自分の生活で、睡眠がどの程度重要か？削られたとき、どうなりそうか？
            </li>
            <li>
              <strong>継続性</strong>:
              1日ではなく「年単位」で続く可能性がある。それでも続けられそうか？
            </li>
            <li>
              <strong>個体差</strong>:
              この体験より軽いことも、重いこともある。最悪のケースを想定できるか？
            </li>
          </ul>

          <h3 className="font-bold text-gray-300 mb-2">考えてもいい問い（任意）：</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>
              夜泣きが「たまに」ではなく「これからも続く」としたら、どう感じますか？
            </li>
            <li>眠りが削られた状態でも、守りたい日常はありますか？</li>
          </ul>
        </section>

        <hr className="border-gray-700" />

        {/* セクション2: 参考情報 */}
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">参考情報</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>
              猫の飼い主の<strong className="text-amber-300">約半数（47%）</strong>
              が「大変だった、後悔したと感じたことがある」
            </li>
            <li>
              生活面（26%）や猫の生態（16%）で大変だったという回答には、夜間の睡眠中断が含まれる
            </li>
          </ul>
        </section>

        <hr className="border-gray-700" />

        {/* セクション3: 体験の全体像 */}
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">体験の全体像</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
            <li>ある日突然、夜に起こされる</li>
            <li>数日後、また同じことが起こる</li>
            <li>早朝に起こされることもある</li>
            <li>毎日ではないが、長い期間にわたって続く</li>
          </ul>
          <p className="text-amber-300 font-medium">
            ポイント：「一晩だけなら耐えられるかもしれないことが、生活として続いたときどうなるか」
          </p>
        </section>

        <hr className="border-gray-700" />

        {/* セクション4: 夜泣きは「日常」になる */}
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">
            夜泣きは「日常」になる
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
            <li>予測できない</li>
            <li>でも珍しくもない</li>
            <li>完全には避けられない</li>
          </ul>
          <p className="text-gray-300 mb-4">
            <strong>生活の一部</strong>として存在し始める。
          </p>
          <p className="text-amber-300 font-medium">
            大事なのは、「つらいかどうか」よりも、「これが&#34;前提条件&#34;になった生活を、自分は続けられそうか」
          </p>
        </section>

        <hr className="border-gray-700" />

        {/* セクション5: 選択について */}
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">選択について</h2>

          <h3 className="font-bold text-gray-300 mb-3">あなたの選択：</h3>
          <div className="space-y-2 mb-6">
            {(Object.keys(selections) as Array<keyof PhaseSelections>).map((phase) => {
              const selection = selections[phase];
              const label = selection ? PHASE_CHOICES[phase][selection] : '未選択';
              return (
                <div key={phase} className="flex justify-between text-gray-300">
                  <span>{PHASE_TITLES[phase]}：</span>
                  <span className="font-medium">{label}</span>
                </div>
              );
            })}
          </div>

          <h3 className="font-bold text-gray-300 mb-2">傾向：</h3>
          <p className="text-gray-300 bg-gray-700 rounded p-4">
            {TENDENCY_TEXT[tendency]}
          </p>
        </section>

        <hr className="border-gray-700" />

        {/* セクション6: 決断について */}
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">決断について</h2>

          <h3 className="font-bold text-gray-300 mb-2">猫の個体差：</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300 mb-4">
            <li>夜泣きがほとんどない子もいれば、もっと激しい子もいます</li>
            <li>性格や健康状態は、飼ってみないとわかりません</li>
          </ul>

          <h3 className="font-bold text-gray-300 mb-2">人生の変化：</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300 mb-4">
            <li>転勤、結婚、離婚、出産など、生活環境は変わります</li>
            <li>あなた自身や家族の病気、怪我もありえます</li>
          </ul>

          <h3 className="font-bold text-gray-300 mb-2">環境の変化：</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300 mb-4">
            <li>引っ越し先でペット可物件が見つからないこともあります</li>
          </ul>

          <p className="text-amber-300 font-medium">
            「自分には難しそう」と感じたなら、それも大切な気づき。
            <br />
            飼わないという選択は、後悔のない判断かもしれない。
          </p>
        </section>

        <hr className="border-gray-700" />

        {/* セクション7: 最後に */}
        <section className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">最後に</h2>
          <p className="text-gray-300 mb-4">
            この体験を通して、結論を出す必要はない。
          </p>
          <p className="text-gray-300 mb-4">
            「意外と大変そうだな」も「続けられるかもしれない」も、一つの気づき。
          </p>
          <p className="text-amber-300 font-medium">
            答えは急がなくて構いません。ゆっくり考え、覚悟を持って、決断をしてください。
          </p>
        </section>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            トップに戻る
          </button>
        </div>
      </main>
    </div>
  );
}
