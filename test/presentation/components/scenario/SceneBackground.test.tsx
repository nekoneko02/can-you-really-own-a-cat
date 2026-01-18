import React from 'react';
import { render, screen } from '@testing-library/react';
import { SceneBackground, TimeOfDay } from '@/components/scenario/SceneBackground';

describe('SceneBackground', () => {
  describe('時間帯による背景画像', () => {
    it('nightの場合、room_night.pngが背景として表示される', () => {
      render(<SceneBackground timeOfDay="night" />);

      const background = screen.getByTestId('scene-background');
      expect(background).toHaveStyle({
        backgroundImage: "url('/assets/backgrounds/room_night.png')",
      });
    });

    it('dawnの場合、room_midnight.pngが背景として表示される', () => {
      render(<SceneBackground timeOfDay="dawn" />);

      const background = screen.getByTestId('scene-background');
      expect(background).toHaveStyle({
        backgroundImage: "url('/assets/backgrounds/room_midnight.png')",
      });
    });

    it('dayの場合、room_morning.pngが背景として表示される', () => {
      render(<SceneBackground timeOfDay="day" />);

      const background = screen.getByTestId('scene-background');
      expect(background).toHaveStyle({
        backgroundImage: "url('/assets/backgrounds/room_morning.png')",
      });
    });
  });

  describe('背景画像のスタイリング', () => {
    it('背景画像がcover指定で表示される', () => {
      render(<SceneBackground timeOfDay="night" />);

      const background = screen.getByTestId('scene-background');
      expect(background).toHaveStyle({
        backgroundSize: 'cover',
      });
    });

    it('背景画像が中央配置される', () => {
      render(<SceneBackground timeOfDay="night" />);

      const background = screen.getByTestId('scene-background');
      expect(background).toHaveStyle({
        backgroundPosition: 'center',
      });
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
