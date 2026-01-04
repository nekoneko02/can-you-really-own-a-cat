import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SceneBackground, TimeOfDay } from '@/components/scenario/SceneBackground';

describe('SceneBackground', () => {
  describe('時間帯による背景色', () => {
    it('nightの場合、暗い青の背景が表示される', () => {
      render(<SceneBackground timeOfDay="night" />);

      const background = screen.getByTestId('scene-background');
      expect(background).toHaveClass('bg-night');
    });

    it('dawnの場合、薄明るい背景が表示される', () => {
      render(<SceneBackground timeOfDay="dawn" />);

      const background = screen.getByTestId('scene-background');
      expect(background).toHaveClass('bg-dawn');
    });

    it('dayの場合、明るい背景が表示される', () => {
      render(<SceneBackground timeOfDay="day" />);

      const background = screen.getByTestId('scene-background');
      expect(background).toHaveClass('bg-day');
    });
  });

  describe('子要素のレンダリング', () => {
    it('子要素を正しく表示する', () => {
      render(
        <SceneBackground timeOfDay="night">
          <div data-testid="child">テストコンテンツ</div>
        </SceneBackground>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('テストコンテンツ')).toBeInTheDocument();
    });
  });

  describe('トランジション', () => {
    it('背景にtransitionクラスが適用されている', () => {
      render(<SceneBackground timeOfDay="night" />);

      const background = screen.getByTestId('scene-background');
      expect(background).toHaveClass('transition-background');
    });
  });

  describe('フルスクリーン', () => {
    it('背景が画面全体を覆う', () => {
      render(<SceneBackground timeOfDay="night" />);

      const background = screen.getByTestId('scene-background');
      expect(background).toHaveClass('min-h-screen');
    });
  });
});
