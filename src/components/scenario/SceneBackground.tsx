'use client';

import React from 'react';

export type TimeOfDay = 'night' | 'dawn' | 'day';

export interface SceneBackgroundProps {
  timeOfDay: TimeOfDay;
  children?: React.ReactNode;
}

/**
 * 時間帯と背景画像のマッピング
 * - night: 夜の部屋 (room_night.png)
 * - dawn: 深夜の部屋 (room_midnight.png)
 * - day: 朝の部屋 (room_morning.png)
 */
const backgroundImages: Record<TimeOfDay, string> = {
  night: '/assets/backgrounds/room_night.png',
  dawn: '/assets/backgrounds/room_midnight.png',
  day: '/assets/backgrounds/room_morning.png',
};

export function SceneBackground({ timeOfDay, children }: SceneBackgroundProps) {
  return (
    <div
      data-testid="scene-background"
      className="scene-background min-h-screen w-full transition-background"
      style={{
        backgroundImage: `url('${backgroundImages[timeOfDay]}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      {children}
    </div>
  );
}
