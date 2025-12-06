'use client';

/**
 * イベントUIコンポーネント
 * イベントタイトルと詳細を表示（propsのみ依存）
 * GameServiceには依存しない
 */

export interface EventData {
  id: string;
  title: string;
  description: string;
}

interface EventUIProps {
  event: EventData | null;
}

export function EventUI({ event }: EventUIProps) {
  if (!event) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">イベント読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-500 pb-2">
        {event.title}
      </h2>
      <p className="text-gray-700 leading-relaxed">
        {event.description}
      </p>
    </div>
  );
}
