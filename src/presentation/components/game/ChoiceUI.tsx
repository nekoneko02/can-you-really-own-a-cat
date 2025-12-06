'use client';

/**
 * ChoiceUIコンポーネント
 * 選択肢を表示し、選択を受け付ける（propsのみ依存）
 * GameServiceには依存しない
 * 選択時は親にイベント通知
 */

export interface ChoiceData {
  id: string;
  text: string;
}

interface ChoiceUIProps {
  choices: ChoiceData[];
  onChoiceSelected: (choiceId: string) => void;
  disabled?: boolean;
}

export function ChoiceUI({ choices, onChoiceSelected, disabled = false }: ChoiceUIProps) {
  if (choices.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="text-sm font-semibold text-blue-900 mb-3">どうしますか？</h3>
      <div className="space-y-2">
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => onChoiceSelected(choice.id)}
            disabled={disabled}
            className={`
              w-full px-4 py-3 text-left rounded-lg font-medium transition-all
              ${disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }
            `}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}
