'use client';

import React, { useEffect, useCallback } from 'react';

export interface PageNavigationProps {
  onNext: () => void;
  onSkip: () => void;
  isTextComplete: boolean;
  disabled?: boolean;
}

export function PageNavigation({
  onNext,
  onSkip,
  isTextComplete,
  disabled = false,
}: PageNavigationProps) {
  const handleInteraction = useCallback(() => {
    if (disabled) return;

    if (isTextComplete) {
      onNext();
    } else {
      onSkip();
    }
  }, [disabled, isTextComplete, onNext, onSkip]);

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
      data-testid="page-navigation"
      className="page-navigation fixed inset-0 cursor-pointer"
      onClick={handleInteraction}
    >
      {isTextComplete && (
        <div
          data-testid="next-indicator"
          className="absolute bottom-8 right-8 text-gray-400 animate-pulse"
        >
          Click or press Enter to continue
        </div>
      )}
    </div>
  );
}
