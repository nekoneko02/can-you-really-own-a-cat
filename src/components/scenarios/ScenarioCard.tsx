'use client';

import React, { useState } from 'react';
import { ScenarioMetadata } from '@/domain/scenarios/scenarioRegistry';

export interface ScenarioCardProps {
  scenario: ScenarioMetadata;
  onStart: (scenarioId: string) => void;
}

/**
 * シナリオカードコンポーネント
 *
 * アコーディオン形式でシナリオの概要と詳細を表示する
 */
export function ScenarioCard({ scenario, onStart }: ScenarioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStart(scenario.id);
  };

  const getIcon = () => {
    // アイコンに応じた絵文字を返す
    switch (scenario.icon) {
      case 'moon':
        return '\uD83C\uDF19';
      default:
        return '\uD83D\uDC31';
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300">
      {/* カードヘッダー（クリックで展開/折りたたみ） */}
      <button
        onClick={handleToggle}
        className="w-full text-left p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{getIcon()}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{scenario.title}</h3>
            {!isExpanded && (
              <p className="text-gray-400 mt-1">{scenario.shortDescription}</p>
            )}
          </div>
        </div>
        <span
          className={`text-amber-400 text-2xl transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          {isExpanded ? '\u25B2' : '\u25BC'}
        </span>
      </button>

      {/* アコーディオン展開部分 */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-slate-700/50">
          {/* 体験の前提 */}
          <div className="mt-4 mb-4">
            <p className="text-white">
              あなたは架空の猫の飼い主として、日常を体験します。
            </p>
          </div>

          {/* 詳細説明 */}
          <div className="mb-4">
            <p className="text-gray-300 leading-relaxed">
              {scenario.fullDescription}
            </p>
          </div>

          {/* 所要時間 */}
          <div className="mb-4">
            <p className="text-gray-400">
              所要時間：
              <span className="text-amber-200">{scenario.estimatedTime}</span>
            </p>
          </div>

          {/* 注意事項 */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm">※ 音声が流れます</p>
          </div>

          {/* 開始ボタン */}
          <div className="text-center">
            <button
              onClick={handleStart}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-lg px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              このシナリオを体験する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
