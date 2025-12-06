'use client';

import { useState, useEffect } from 'react';
import { GameApiClient } from '@/infrastructure/api';
import { EventUI, type EventData } from './EventUI';
import { ChoiceUI, type ChoiceData } from './ChoiceUI';
import { ResultUI, type ResultData } from './ResultUI';

/**
 * ScenarioUIコンポーネント
 * GameApiClientに依存し、ユースケースを実行
 * 子コンポーネント（EventUI, ChoiceUI, ResultUI）へpropsで値を渡す
 * 子からのイベント通知を受け取り、GameApiClientを呼び出す
 */

interface ScenarioUIProps {
  scenarioId: string;
  onGameEnd: () => void;
}

interface ExtendedEventData extends EventData {
  choices: ChoiceData[];
}

export function ScenarioUI({ scenarioId, onGameEnd }: ScenarioUIProps) {
  const [apiClient] = useState(() => new GameApiClient());
  const [currentEvent, setCurrentEvent] = useState<ExtendedEventData | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScenario();
  }, []);

  /**
   * シナリオ読み込み
   */
  const loadScenario = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // シナリオ初期化
      await apiClient.loadScenario(scenarioId);

      // 最初のイベント取得
      const event = await apiClient.getCurrentEvent(scenarioId);
      setCurrentEvent({
        id: event.id,
        title: event.title,
        description: event.description,
        choices: event.choices,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'シナリオの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 選択肢が選ばれた時のハンドラ
   */
  const handleChoiceSelected = async (choiceId: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      // 選択肢実行（Cat更新）
      await apiClient.executeChoice(scenarioId, choiceId);

      // 結果テキストを表示するため、現在のイベントから結果を取得
      // MVP期は簡易実装：選択肢実行後の固定メッセージ
      setResult({ text: '選択が反映されました' });

      // 選択肢を非表示
      setCurrentEvent((prev) => (prev ? { ...prev } : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : '選択肢の実行に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * 次へボタンが押された時のハンドラ
   */
  const handleNextClicked = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      setResult(null);

      // ターン進行
      await apiClient.advanceToNextTurn();

      // シナリオ完了判定
      const isComplete = await apiClient.isScenarioComplete(scenarioId);

      if (isComplete) {
        onGameEnd();
        return;
      }

      // 次のイベント取得
      const nextEvent = await apiClient.getCurrentEvent(scenarioId);
      setCurrentEvent({
        id: nextEvent.id,
        title: nextEvent.title,
        description: nextEvent.description,
        choices: nextEvent.choices,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ターン進行に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">シナリオを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 max-w-md">
          <div className="flex items-start mb-4">
            <span className="text-3xl mr-3">⚠️</span>
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-2">エラーが発生しました</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={loadScenario}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <EventUI event={currentEvent} />

      {!result && currentEvent && (
        <ChoiceUI
          choices={currentEvent.choices}
          onChoiceSelected={handleChoiceSelected}
          disabled={isProcessing}
        />
      )}

      {result && (
        <ResultUI result={result} onNextClicked={handleNextClicked} disabled={isProcessing} />
      )}
    </div>
  );
}
