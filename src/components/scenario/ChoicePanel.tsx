'use client';

import React from 'react';

export interface Choice {
  id: string;
  text: string;
}

export interface ChoicePanelProps {
  choices: Choice[];
  onSelect: (choiceId: string) => void;
  visible?: boolean;
}

const MAX_CHOICES = 3;

export function ChoicePanel({
  choices,
  onSelect,
  visible = true,
}: ChoicePanelProps) {
  if (!visible || choices.length === 0) {
    return null;
  }

  // 最大3つまで表示
  const displayChoices = choices.slice(0, MAX_CHOICES);

  return (
    <div
      data-testid="choice-panel"
      className="choice-panel flex flex-col gap-3 p-4"
    >
      {displayChoices.map((choice) => (
        <button
          key={choice.id}
          className="choice-button bg-white border-2 border-gray-300 text-gray-800 text-lg px-6 py-4 rounded-lg hover:bg-gray-100 hover:border-blue-400 transition-all shadow-sm"
          onClick={() => onSelect(choice.id)}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
}
