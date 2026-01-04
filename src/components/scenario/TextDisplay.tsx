'use client';

import React, { useState, useEffect, useCallback } from 'react';

export interface TextDisplayProps {
  text: string;
  onComplete: () => void;
  onNext: () => void;
  speed?: number; // ms per character
}

export function TextDisplay({
  text,
  onComplete,
  onNext,
  speed = 50,
}: TextDisplayProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // テキストが変更されたらリセット
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
  }, [text]);

  // ストリーミング表示
  useEffect(() => {
    if (displayedText.length >= text.length) {
      if (!isComplete) {
        setIsComplete(true);
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedText, text, speed, isComplete, onComplete]);

  // スキップまたは次へ
  const handleInteraction = useCallback(() => {
    if (isComplete) {
      onNext();
    } else {
      // 全文即時表示
      setDisplayedText(text);
      setIsComplete(true);
      onComplete();
    }
  }, [isComplete, text, onNext, onComplete]);

  // キーボードイベント
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleInteraction();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleInteraction]);

  return (
    <div
      data-testid="text-display"
      className="text-display p-6 text-lg leading-relaxed text-gray-800 cursor-pointer min-h-[100px]"
      onClick={handleInteraction}
    >
      {displayedText}
      {isComplete && (
        <span className="inline-block ml-2 animate-pulse text-gray-400">
          |
        </span>
      )}
    </div>
  );
}
