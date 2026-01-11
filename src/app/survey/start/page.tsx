'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { surveyApiClient } from '@/lib/api/client';
import { getSession, createSession } from '@/lib/session/actions';
import type { WantToCatLevel, Expectation } from '@/lib/api/types';
import { ALLOWED_EXPECTATIONS } from '@/lib/api/types';

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
 * 期待値の選択肢
 */
const EXPECTATION_OPTIONS: Expectation[] = [...ALLOWED_EXPECTATIONS];

/**
 * その他の期待の最大文字数
 */
const OTHER_EXPECTATION_MAX_LENGTH = 200;

/**
 * 開始時アンケート画面
 *
 * 効果測定のベースライン取得用。
 * 回答後、APIを呼び出してデータを記録し、シナリオ体験へ遷移する。
 */
export default function StartSurveyPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォーム状態
  const [wantToCatLevel, setWantToCatLevel] = useState<WantToCatLevel | null>(
    null
  );
  const [expectations, setExpectations] = useState<Expectation[]>([]);
  const [otherExpectation, setOtherExpectation] = useState('');

  // セッション取得（なければ自動作成）
  useEffect(() => {
    async function loadOrCreateSession() {
      try {
        let session = await getSession();
        if (!session?.sessionId) {
          // セッションがなければ自動作成
          session = await createSession('night-crying');
        }
        setSessionId(session.sessionId);
      } catch {
        setError('セッションの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    }

    loadOrCreateSession();
  }, []);

  // 期待値のトグル
  const handleExpectationToggle = useCallback((expectation: Expectation) => {
    setExpectations((prev) => {
      if (prev.includes(expectation)) {
        return prev.filter((e) => e !== expectation);
      }
      return [...prev, expectation];
    });
  }, []);

  // フォーム送信
  const handleSubmit = useCallback(async () => {
    if (!sessionId || wantToCatLevel === null) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const preSurvey = {
        wantToCatLevel,
        expectations,
        ...(otherExpectation.trim() && { otherExpectation: otherExpectation.trim() }),
      };

      await surveyApiClient.startScenario('night-crying', sessionId, preSurvey);

      router.push('/experience');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('送信に失敗しました。もう一度お試しください。');
      }
      setIsSubmitting(false);
    }
  }, [sessionId, wantToCatLevel, expectations, otherExpectation, router]);

  // ボタンの有効/無効
  const isButtonDisabled =
    wantToCatLevel === null || isSubmitting || isLoading || !sessionId;

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
            体験前のアンケート
          </h1>
          <p className="text-gray-400 text-sm">
            効果測定のため、いくつかお聞かせください
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
          <h2 className="text-lg font-semibold text-white mb-2">
            この体験に期待することは？
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            複数選択可・任意
          </p>
          <div className="space-y-3">
            {EXPECTATION_OPTIONS.map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                  expectations.includes(option)
                    ? 'bg-blue-500/20 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={expectations.includes(option)}
                  onChange={() => handleExpectationToggle(option)}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                    expectations.includes(option)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-500'
                  }`}
                >
                  {expectations.includes(option) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                {option}
              </label>
            ))}
          </div>

          {/* その他の期待（自由テキスト） */}
          <div className="mt-6">
            <h3 className="text-base font-medium text-white mb-2">
              その他のご期待があればお書きください（任意）
            </h3>
            <textarea
              value={otherExpectation}
              onChange={(e) => setOtherExpectation(e.target.value)}
              maxLength={OTHER_EXPECTATION_MAX_LENGTH}
              rows={3}
              placeholder="自由にお書きください..."
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            />
            <div className="text-right text-gray-500 text-sm mt-1">
              {otherExpectation.length} / {OTHER_EXPECTATION_MAX_LENGTH}
            </div>
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
            {isSubmitting ? '送信中...' : '次へ'}
          </button>
        </div>
      </div>
    </div>
  );
}
