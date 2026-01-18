'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { surveyApiClient } from '@/lib/api/client';
import { getSession } from '@/lib/session/actions';
import type { WantToCatLevel, Awareness } from '@/lib/api/types';

/**
 * 猫を飼いたい度合いの選択肢
 */
const WANT_TO_CAT_OPTIONS: { value: WantToCatLevel; label: string }[] = [
  { value: 1, label: 'とても飼いたい' },
  { value: 2, label: 'やや飼いたい' },
  { value: 3, label: '迷っている' },
  { value: 4, label: 'あまり飼いたくない' },
  { value: 5, label: '飼うつもりはない' },
];

/**
 * 気づきの有無の選択肢
 */
const AWARENESS_OPTIONS: { value: Awareness; label: string }[] = [
  { value: 'new', label: '新しい気づきがあった' },
  { value: 'realized', label: '知っていたが、実感できた' },
  { value: 'none', label: '特に気づきはなかった' },
];

/**
 * 自由記述の最大文字数
 */
const FREE_TEXT_MAX_LENGTH = 1000;

/**
 * 終了時アンケート画面（クライアントコンポーネント）
 *
 * 行動変容と気づきの測定用アンケート。
 * 回答後、APIを呼び出してデータを記録し、ホーム画面へ遷移する。
 */
export default function EndSurveyPageClient() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォーム状態
  const [wantToCatLevel, setWantToCatLevel] = useState<WantToCatLevel | null>(
    null
  );
  const [awareness, setAwareness] = useState<Awareness | null>(null);
  const [freeText, setFreeText] = useState('');

  // セッション取得
  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getSession();
        if (session?.sessionId) {
          setSessionId(session.sessionId);
        } else {
          setError('セッションが見つかりません。最初からやり直してください。');
        }
      } catch {
        setError('セッションの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  // フォーム送信
  const handleSubmit = useCallback(async () => {
    if (!sessionId || wantToCatLevel === null || awareness === null) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const postSurvey = {
        wantToCatLevel,
        awareness,
        ...(freeText.trim() && { freeText: freeText.trim() }),
      };

      await surveyApiClient.completeScenario(
        'night-crying',
        sessionId,
        postSurvey
      );

      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('送信に失敗しました。もう一度お試しください。');
      }
      setIsSubmitting(false);
    }
  }, [sessionId, wantToCatLevel, awareness, freeText, router]);

  // ボタンの有効/無効
  const isButtonDisabled =
    wantToCatLevel === null ||
    awareness === null ||
    isSubmitting ||
    isLoading ||
    !sessionId;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            体験後のアンケート
          </h1>
          <p className="text-gray-400 text-sm">
            最後に、いくつかお聞かせください
          </p>
        </header>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* 質問1 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            今、猫を飼いたいと思っていますか？
            <span className="text-red-400 ml-1">*</span>
          </h2>
          <div className="space-y-3">
            {WANT_TO_CAT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                  wantToCatLevel === option.value
                    ? 'bg-blue-500/20 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="wantToCatLevel"
                  value={option.value}
                  checked={wantToCatLevel === option.value}
                  onChange={() => setWantToCatLevel(option.value)}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    wantToCatLevel === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-500'
                  }`}
                >
                  {wantToCatLevel === option.value && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>
                {option.label}
              </label>
            ))}
          </div>
        </section>

        {/* 質問2 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            この体験で気づきはありましたか？
            <span className="text-red-400 ml-1">*</span>
          </h2>
          <div className="space-y-3">
            {AWARENESS_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                  awareness === option.value
                    ? 'bg-blue-500/20 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="awareness"
                  value={option.value}
                  checked={awareness === option.value}
                  onChange={() => setAwareness(option.value)}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    awareness === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-500'
                  }`}
                >
                  {awareness === option.value && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>
                {option.label}
              </label>
            ))}
          </div>
        </section>

        {/* 質問3（自由記述） */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-2">
            気づいたことや感想があれば教えてください
          </h2>
          <p className="text-gray-400 text-sm mb-4">任意</p>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            maxLength={FREE_TEXT_MAX_LENGTH}
            rows={4}
            placeholder="自由にお書きください..."
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="text-right text-gray-500 text-sm mt-1">
            {freeText.length} / {FREE_TEXT_MAX_LENGTH}
          </div>
        </section>

        {/* 送信ボタン */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
              isButtonDisabled
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? '送信中...' : 'ホームに戻る'}
          </button>
        </div>
      </div>
    </div>
  );
}
