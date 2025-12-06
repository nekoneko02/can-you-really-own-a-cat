'use client';

/**
 * ResultUIコンポーネント
 * 分岐後の結果テキストを表示（propsのみ依存）
 * GameServiceには依存しない
 * 次へボタンクリック時は親にイベント通知
 */

export interface ResultData {
  text: string;
}

interface ResultUIProps {
  result: ResultData | null;
  onNextClicked: () => void;
  disabled?: boolean;
}

export function ResultUI({ result, onNextClicked, disabled = false }: ResultUIProps) {
  if (!result) {
    return null;
  }

  return (
    <div className="mt-4 p-5 bg-green-50 rounded-lg border-2 border-green-300 shadow-sm">
      <div className="flex items-start mb-3">
        <span className="text-2xl mr-2">✨</span>
        <h3 className="text-lg font-bold text-green-900">結果</h3>
      </div>
      <p className="text-gray-700 leading-relaxed mb-4 pl-8">
        {result.text}
      </p>
      <div className="flex justify-end">
        <button
          onClick={onNextClicked}
          disabled={disabled}
          className={`
            px-6 py-2 rounded-lg font-semibold transition-all
            ${disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-md hover:shadow-lg'
            }
          `}
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
