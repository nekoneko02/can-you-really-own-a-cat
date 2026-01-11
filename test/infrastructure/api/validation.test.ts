/**
 * APIバリデーション関数のテスト
 */

import {
  isValidScenarioSlug,
  isValidWantToCatLevel,
  isValidAwareness,
  isValidExpectations,
  isValidOtherExpectation,
  isValidFreeText,
  validateStartRequest,
  validateCompleteRequest,
} from '@/lib/api/validation';

describe('API Validation', () => {
  describe('isValidScenarioSlug', () => {
    it('should return true for "night-crying"', () => {
      expect(isValidScenarioSlug('night-crying')).toBe(true);
    });

    it('should return false for other slugs', () => {
      expect(isValidScenarioSlug('other-scenario')).toBe(false);
      expect(isValidScenarioSlug('')).toBe(false);
      expect(isValidScenarioSlug('nightcrying')).toBe(false);
    });
  });

  describe('isValidWantToCatLevel', () => {
    it('should return true for valid levels 1-5', () => {
      expect(isValidWantToCatLevel(1)).toBe(true);
      expect(isValidWantToCatLevel(2)).toBe(true);
      expect(isValidWantToCatLevel(3)).toBe(true);
      expect(isValidWantToCatLevel(4)).toBe(true);
      expect(isValidWantToCatLevel(5)).toBe(true);
    });

    it('should return false for out of range values', () => {
      expect(isValidWantToCatLevel(0)).toBe(false);
      expect(isValidWantToCatLevel(6)).toBe(false);
      expect(isValidWantToCatLevel(-1)).toBe(false);
    });

    it('should return false for non-integer values', () => {
      expect(isValidWantToCatLevel(1.5)).toBe(false);
      expect(isValidWantToCatLevel(NaN)).toBe(false);
    });
  });

  describe('isValidAwareness', () => {
    it('should return true for valid awareness values', () => {
      expect(isValidAwareness('new')).toBe(true);
      expect(isValidAwareness('realized')).toBe(true);
      expect(isValidAwareness('none')).toBe(true);
    });

    it('should return false for invalid awareness values', () => {
      expect(isValidAwareness('other')).toBe(false);
      expect(isValidAwareness('')).toBe(false);
    });
  });

  describe('isValidExpectations', () => {
    it('should return true for valid expectations array', () => {
      expect(isValidExpectations(['飼育の大変さを知りたい'])).toBe(true);
      expect(isValidExpectations(['猫との生活をイメージしたい', '飼う前に気づきを得たい'])).toBe(true);
      expect(isValidExpectations(['その他'])).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isValidExpectations(undefined)).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isValidExpectations([])).toBe(true);
    });

    it('should return false for invalid expectations', () => {
      expect(isValidExpectations(['invalid expectation'])).toBe(false);
      expect(isValidExpectations(['飼育の大変さを知りたい', 'invalid'])).toBe(false);
    });
  });

  describe('isValidOtherExpectation', () => {
    it('should return true for valid text', () => {
      expect(isValidOtherExpectation('猫アレルギーがあるかもしれない')).toBe(true);
      expect(isValidOtherExpectation('')).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isValidOtherExpectation(undefined)).toBe(true);
    });

    it('should return false for text exceeding 200 characters', () => {
      const longText = 'a'.repeat(201);
      expect(isValidOtherExpectation(longText)).toBe(false);
    });

    it('should return true for exactly 200 characters', () => {
      const maxText = 'a'.repeat(200);
      expect(isValidOtherExpectation(maxText)).toBe(true);
    });
  });

  describe('isValidFreeText', () => {
    it('should return true for valid text', () => {
      expect(isValidFreeText('夜泣きがこんなに続くとは思わなかった')).toBe(true);
      expect(isValidFreeText('')).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isValidFreeText(undefined)).toBe(true);
    });

    it('should return false for text exceeding 1000 characters', () => {
      const longText = 'a'.repeat(1001);
      expect(isValidFreeText(longText)).toBe(false);
    });

    it('should return true for exactly 1000 characters', () => {
      const maxText = 'a'.repeat(1000);
      expect(isValidFreeText(maxText)).toBe(true);
    });
  });

  describe('validateStartRequest', () => {
    const validSessionId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return null for valid request', () => {
      const request = {
        sessionId: validSessionId,
        preSurvey: {
          wantToCatLevel: 3,
          expectations: ['飼育の大変さを知りたい'],
        },
      };
      expect(validateStartRequest(request)).toBeNull();
    });

    it('should return error for missing sessionId', () => {
      const request = {
        preSurvey: {
          wantToCatLevel: 3,
        },
      };
      const error = validateStartRequest(request as unknown);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('INVALID_SESSION_ID');
    });

    it('should return error for invalid sessionId format', () => {
      const request = {
        sessionId: 'invalid-uuid',
        preSurvey: {
          wantToCatLevel: 3,
        },
      };
      const error = validateStartRequest(request);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('INVALID_SESSION_ID');
    });

    it('should return error for missing preSurvey', () => {
      const request = {
        sessionId: validSessionId,
      };
      const error = validateStartRequest(request as unknown);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('VALIDATION_ERROR');
    });

    it('should return error for invalid wantToCatLevel', () => {
      const request = {
        sessionId: validSessionId,
        preSurvey: {
          wantToCatLevel: 6,
        },
      };
      const error = validateStartRequest(request);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('VALIDATION_ERROR');
    });

    it('should return error for invalid expectations', () => {
      const request = {
        sessionId: validSessionId,
        preSurvey: {
          wantToCatLevel: 3,
          expectations: ['invalid'],
        },
      };
      const error = validateStartRequest(request);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('VALIDATION_ERROR');
    });

    it('should return null for valid request with otherExpectation', () => {
      const request = {
        sessionId: validSessionId,
        preSurvey: {
          wantToCatLevel: 3,
          expectations: ['その他'],
          otherExpectation: '猫アレルギーがあるかもしれない',
        },
      };
      expect(validateStartRequest(request)).toBeNull();
    });

    it('should return error for otherExpectation exceeding 200 characters', () => {
      const request = {
        sessionId: validSessionId,
        preSurvey: {
          wantToCatLevel: 3,
          expectations: ['その他'],
          otherExpectation: 'a'.repeat(201),
        },
      };
      const error = validateStartRequest(request);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('validateCompleteRequest', () => {
    const validSessionId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return null for valid request', () => {
      const request = {
        sessionId: validSessionId,
        postSurvey: {
          wantToCatLevel: 4,
          awareness: 'new' as const,
          freeText: '夜泣きがこんなに続くとは思わなかった',
        },
      };
      expect(validateCompleteRequest(request)).toBeNull();
    });

    it('should return error for missing sessionId', () => {
      const request = {
        postSurvey: {
          wantToCatLevel: 4,
          awareness: 'new',
        },
      };
      const error = validateCompleteRequest(request as unknown);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('INVALID_SESSION_ID');
    });

    it('should return error for missing postSurvey', () => {
      const request = {
        sessionId: validSessionId,
      };
      const error = validateCompleteRequest(request as unknown);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('VALIDATION_ERROR');
    });

    it('should return error for invalid awareness', () => {
      const request = {
        sessionId: validSessionId,
        postSurvey: {
          wantToCatLevel: 4,
          awareness: 'invalid',
        },
      };
      const error = validateCompleteRequest(request);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('VALIDATION_ERROR');
    });

    it('should return error for freeText exceeding limit', () => {
      const request = {
        sessionId: validSessionId,
        postSurvey: {
          wantToCatLevel: 4,
          awareness: 'new' as const,
          freeText: 'a'.repeat(1001),
        },
      };
      const error = validateCompleteRequest(request);
      expect(error).not.toBeNull();
      expect(error?.code).toBe('VALIDATION_ERROR');
    });
  });
});
