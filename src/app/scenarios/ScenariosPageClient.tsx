'use client';

import { useRouter } from 'next/navigation';
import { getAllScenarios } from '@/domain/scenarios/scenarioRegistry';
import { ScenarioCard } from '@/components/scenarios/ScenarioCard';

/**
 * シナリオ選択画面（クライアントコンポーネント）
 *
 * シナリオ一覧を表示し、ユーザーが体験したいシナリオを選択できる。
 */
export default function ScenariosPageClient() {
  const router = useRouter();
  const scenarios = getAllScenarios();

  const handleStart = (_scenarioId: string) => {
    // 将来的にはシナリオIDに基づいて異なるアンケートへ遷移する可能性がある
    router.push('/survey/start');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center px-4 py-8">
      <main className="max-w-lg w-full">
        {/* タイトルエリア */}
        <header className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            シナリオを選んでください
          </h1>
          <div className="w-24 h-0.5 bg-amber-400 mx-auto" />
        </header>

        {/* シナリオ一覧 */}
        <div className="space-y-4">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onStart={handleStart}
            />
          ))}
        </div>

        {/* 将来的に複数シナリオが追加された場合のメッセージ */}
        {scenarios.length === 1 && (
          <p className="text-center text-gray-500 text-sm mt-8">
            ※ 他のシナリオは順次追加予定です
          </p>
        )}
      </main>
    </div>
  );
}
