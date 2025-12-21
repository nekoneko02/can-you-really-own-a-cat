/**
 * TimeScales テスト
 *
 * アクション毎のスケール定義のテスト
 */

import { TimeScales, getTimeScale } from '@/domain/time/TimeScales';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';

describe('TimeScales', () => {
  describe('定義値', () => {
    it('PLAYING のスケールが定義されている', () => {
      expect(TimeScales.PLAYING).toBeDefined();
      expect(typeof TimeScales.PLAYING).toBe('number');
      expect(TimeScales.PLAYING).toBeGreaterThan(0);
    });

    it('PETTING のスケールが定義されている', () => {
      expect(TimeScales.PETTING).toBeDefined();
      expect(typeof TimeScales.PETTING).toBe('number');
    });

    it('IGNORING のスケールが定義されている', () => {
      expect(TimeScales.IGNORING).toBeDefined();
      expect(typeof TimeScales.IGNORING).toBe('number');
    });

    it('LOCKED_OUT のスケールが定義されている', () => {
      expect(TimeScales.LOCKED_OUT).toBeDefined();
      expect(typeof TimeScales.LOCKED_OUT).toBe('number');
    });

    it('DEFAULT のスケールが1.0', () => {
      expect(TimeScales.DEFAULT).toBe(1.0);
    });
  });

  describe('getTimeScale()', () => {
    it('PLAYING アクションのスケールを取得できる', () => {
      const scale = getTimeScale(NightCryActionType.PLAYING);
      expect(scale).toBe(TimeScales.PLAYING);
    });

    it('PETTING アクションのスケールを取得できる', () => {
      const scale = getTimeScale(NightCryActionType.PETTING);
      expect(scale).toBe(TimeScales.PETTING);
    });

    it('IGNORING アクションのスケールを取得できる', () => {
      const scale = getTimeScale(NightCryActionType.IGNORING);
      expect(scale).toBe(TimeScales.IGNORING);
    });

    it('LOCKED_OUT アクションのスケールを取得できる', () => {
      const scale = getTimeScale(NightCryActionType.LOCKED_OUT);
      expect(scale).toBe(TimeScales.LOCKED_OUT);
    });

    it('未定義のアクションはDEFAULTスケールを返す', () => {
      const scale = getTimeScale(NightCryActionType.CATCHING);
      expect(scale).toBe(TimeScales.DEFAULT);
    });

    it('nullの場合はDEFAULTスケールを返す', () => {
      const scale = getTimeScale(null);
      expect(scale).toBe(TimeScales.DEFAULT);
    });
  });
});
