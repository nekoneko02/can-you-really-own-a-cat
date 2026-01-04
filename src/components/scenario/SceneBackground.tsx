'use client';

import React from 'react';

export type TimeOfDay = 'night' | 'dawn' | 'day';

export interface SceneBackgroundProps {
  timeOfDay: TimeOfDay;
  children?: React.ReactNode;
}

const backgroundStyles: Record<TimeOfDay, string> = {
  night: 'bg-night',
  dawn: 'bg-dawn',
  day: 'bg-day',
};

export function SceneBackground({ timeOfDay, children }: SceneBackgroundProps) {
  return (
    <div
      data-testid="scene-background"
      className={`scene-background min-h-screen w-full transition-background ${backgroundStyles[timeOfDay]}`}
      style={{
        transition: 'background-color 1s ease-in-out',
      }}
    >
      {children}
    </div>
  );
}
