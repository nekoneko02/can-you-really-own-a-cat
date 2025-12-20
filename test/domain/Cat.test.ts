/**
 * Catのテスト
 */

import { Cat } from '@/domain/Cat';
import { CatState, CatMood, ToyType } from '@/domain/types';

describe('Cat', () => {
  describe('constructor', () => {
    it('should create Cat with default values', () => {
      const cat = new Cat();

      expect(cat.x).toBe(0);
      expect(cat.y).toBe(0);
      expect(cat.state).toBe(CatState.SLEEPING);
      expect(cat.mood).toBe(CatMood.NEUTRAL);
      expect(cat.currentAnimation).toBe('cat_sleeping');
    });

    it('should create Cat with custom values', () => {
      const cat = new Cat({
        x: 100,
        y: 200,
        state: CatState.SITTING,
        mood: CatMood.HAPPY,
      });

      expect(cat.x).toBe(100);
      expect(cat.y).toBe(200);
      expect(cat.state).toBe(CatState.SITTING);
      expect(cat.mood).toBe(CatMood.HAPPY);
      expect(cat.currentAnimation).toBe('cat_sitting');
    });
  });

  describe('setState', () => {
    it('should change cat state', () => {
      const cat = new Cat();

      cat.setState(CatState.WALKING);
      expect(cat.state).toBe(CatState.WALKING);

      cat.setState(CatState.PLAYING);
      expect(cat.state).toBe(CatState.PLAYING);
    });

    it('should update currentAnimation when state changes', () => {
      const cat = new Cat();
      expect(cat.currentAnimation).toBe('cat_sleeping');

      cat.setState(CatState.SITTING);
      expect(cat.currentAnimation).toBe('cat_sitting');

      cat.setState(CatState.WALKING);
      expect(cat.currentAnimation).toBe('cat_walking');

      cat.setState(CatState.RUNNING);
      expect(cat.currentAnimation).toBe('cat_running');

      cat.setState(CatState.PLAYING);
      expect(cat.currentAnimation).toBe('cat_playing');
    });
  });

  describe('setMood', () => {
    it('should change cat mood', () => {
      const cat = new Cat();

      cat.setMood(CatMood.HAPPY);
      expect(cat.mood).toBe(CatMood.HAPPY);

      cat.setMood(CatMood.ANGRY);
      expect(cat.mood).toBe(CatMood.ANGRY);
    });
  });

  describe('moveTo', () => {
    it('should move cat to specified position', () => {
      const cat = new Cat({ x: 0, y: 0 });

      cat.moveTo(150, 250);

      expect(cat.x).toBe(150);
      expect(cat.y).toBe(250);
    });

    it('should set state to WALKING when moving', () => {
      const cat = new Cat({ state: CatState.SITTING });

      cat.moveTo(100, 200);

      expect(cat.state).toBe(CatState.WALKING);
    });
  });

  describe('catch', () => {
    it('should set state to SITTING and mood to ANGRY when caught', () => {
      const cat = new Cat({ state: CatState.RUNNING, mood: CatMood.NEUTRAL });

      cat.catch();

      expect(cat.state).toBe(CatState.SITTING);
      expect(cat.mood).toBe(CatMood.ANGRY);
    });
  });

  describe('playWith', () => {
    it('should set state to PLAYING and mood to HAPPY when playing with toy', () => {
      const cat = new Cat({ state: CatState.SITTING, mood: CatMood.NEUTRAL });

      cat.playWith(ToyType.BALL);

      expect(cat.state).toBe(CatState.PLAYING);
      expect(cat.mood).toBe(CatMood.HAPPY);
    });

    it('should accept different toy types', () => {
      const cat = new Cat();

      cat.playWith(ToyType.MOUSE);
      expect(cat.state).toBe(CatState.PLAYING);

      cat.playWith(ToyType.FEATHER);
      expect(cat.state).toBe(CatState.PLAYING);
    });
  });

  describe('sleep', () => {
    it('should set state to SLEEPING and mood to SLEEPY', () => {
      const cat = new Cat({ state: CatState.WALKING, mood: CatMood.HAPPY });

      cat.sleep();

      expect(cat.state).toBe(CatState.SLEEPING);
      expect(cat.mood).toBe(CatMood.SLEEPY);
    });
  });
});
