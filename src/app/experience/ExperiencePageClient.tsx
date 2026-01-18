'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SceneBackground } from '@/components/scenario/SceneBackground';
import { TextDisplay } from '@/components/scenario/TextDisplay';
import { ChoicePanel } from '@/components/scenario/ChoicePanel';
import {
  NightcryScenarioEngine,
  type EngineState,
} from '@/domain/scenarios/nightcry';
import { MeowPlayer } from '@/lib/audio/MeowPlayer';

/**
 * 夜泣きシナリオ体験画面（クライアントコンポーネント）
 *
 * ノベルゲーム形式で夜泣きの疑似体験を提供します。
 */
export default function ExperiencePageClient() {
  const router = useRouter();
  const [engineState, setEngineState] = useState<EngineState>(() =>
    NightcryScenarioEngine.createInitialState()
  );
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // 現在の表示テキスト
  const currentText = NightcryScenarioEngine.getCurrentPage(engineState);

  // 現在の時間帯（背景）
  const timeOfDay = NightcryScenarioEngine.getTimeOfDay(engineState);

  // 選択肢
  const choices = NightcryScenarioEngine.getChoices(engineState);

  // 選択肢表示中かどうか
  const showChoices = engineState.step === 'choices';

  // 鳴き声再生（フェーズ変更時）
  useEffect(() => {
    if (engineState.step === 'pages' && engineState.pageIndex === 0) {
      if (
        NightcryScenarioEngine.shouldPlayAudio(engineState.phase) &&
        audioEnabled
      ) {
        MeowPlayer.play();
      }
    }
  }, [engineState.phase, engineState.step, engineState.pageIndex, audioEnabled]);

  // シナリオ完了時の処理
  useEffect(() => {
    if (NightcryScenarioEngine.isCompleted(engineState)) {
      // レポートデータを保存
      const reportData = {
        selections: engineState.selections,
      };
      localStorage.setItem('nightcryReportData', JSON.stringify(reportData));

      // レポートページへ遷移
      router.push('/nightcry-report');
    }
  }, [engineState, router]);

  // テキスト表示完了時のコールバック
  const handleTextComplete = useCallback(() => {
    setIsTextComplete(true);
  }, []);

  // 次へ進む
  const handleNext = useCallback(() => {
    if (!isTextComplete) return;

    setIsTextComplete(false);

    switch (engineState.step) {
      case 'pages':
        setEngineState((prev) => NightcryScenarioEngine.advancePage(prev));
        break;
      case 'response':
        setEngineState((prev) =>
          NightcryScenarioEngine.advanceFromResponse(prev)
        );
        break;
      case 'closing':
        // フェーズ間はフェード演出
        setIsFading(true);
        setTimeout(() => {
          setEngineState((prev) =>
            NightcryScenarioEngine.advanceFromClosing(prev)
          );
          setIsFading(false);
        }, 500);
        break;
    }
  }, [isTextComplete, engineState.step]);

  // 選択肢を選んだとき
  const handleChoiceSelect = useCallback((choiceId: string) => {
    const selection = choiceId as 'A' | 'B' | 'C';
    setEngineState((prev) =>
      NightcryScenarioEngine.selectChoice(prev, selection)
    );
    setIsTextComplete(false);
  }, []);

  // 音声ON/OFF切り替え
  const handleToggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      const newValue = !prev;
      MeowPlayer.setMuted(!newValue);
      return newValue;
    });
  }, []);

  return (
    <SceneBackground timeOfDay={timeOfDay}>
      <div
        className={`min-h-screen flex flex-col transition-opacity duration-500 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* ヘッダー（フェーズ表示 + 音声切り替え） */}
        <header className="flex justify-between items-center p-4">
          <div className="text-white/60 text-sm">
            Phase {engineState.phase} / 5
          </div>
          <button
            onClick={handleToggleAudio}
            className="text-white/60 text-sm hover:text-white transition-colors"
            aria-label={audioEnabled ? '音声をオフにする' : '音声をオンにする'}
          >
            {audioEnabled ? '音声 ON' : '音声 OFF'}
          </button>
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 flex flex-col justify-center items-center px-4">
          <div className="max-w-2xl w-full">
            {/* テキスト表示エリア */}
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 mb-6">
              <TextDisplay
                text={currentText}
                onComplete={handleTextComplete}
                onNext={handleNext}
                speed={50}
                disableInteraction={showChoices}
              />
            </div>

            {/* 選択肢パネル */}
            {showChoices && isTextComplete && (
              <ChoicePanel
                choices={choices.map((c) => ({ id: c.id, text: c.text }))}
                onSelect={handleChoiceSelect}
                visible={true}
              />
            )}
          </div>
        </main>

        {/* フッター（進行ヒント） */}
        <footer className="p-4 text-center">
          {!showChoices && isTextComplete && (
            <p className="text-white/40 text-sm animate-pulse">
              Click or press Enter to continue
            </p>
          )}
        </footer>
      </div>
    </SceneBackground>
  );
}
