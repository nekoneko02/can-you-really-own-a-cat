/**
 * セッション関連のユーティリティ関数テスト
 */

import { isValidSessionId, generateSessionId } from '@/lib/session/utils';

describe('Session Utilities', () => {
  describe('isValidSessionId', () => {
    it('should return true for valid UUID v4', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      expect(isValidSessionId(validUuid)).toBe(true);
    });

    it('should return true for another valid UUID v4', () => {
      const validUuid = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
      expect(isValidSessionId(validUuid)).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isValidSessionId('')).toBe(false);
    });

    it('should return false for random string', () => {
      expect(isValidSessionId('invalid-uuid')).toBe(false);
      expect(isValidSessionId('123')).toBe(false);
      expect(isValidSessionId('abc')).toBe(false);
    });

    it('should return false for UUID with invalid version (v1)', () => {
      // UUID v1 (version 1 in the third group)
      const uuidV1 = '550e8400-e29b-11d4-a716-446655440000';
      expect(isValidSessionId(uuidV1)).toBe(false);
    });

    it('should return false for UUID with invalid version (v5)', () => {
      // UUID v5 (version 5 in the third group)
      const uuidV5 = '550e8400-e29b-51d4-a716-446655440000';
      expect(isValidSessionId(uuidV5)).toBe(false);
    });

    it('should return false for UUID with invalid variant', () => {
      // Invalid variant (should be 8, 9, a, or b in the fourth group)
      const invalidVariant = '550e8400-e29b-41d4-0716-446655440000';
      expect(isValidSessionId(invalidVariant)).toBe(false);
    });

    it('should return true for uppercase UUID', () => {
      const upperCaseUuid = '550E8400-E29B-41D4-A716-446655440000';
      expect(isValidSessionId(upperCaseUuid)).toBe(true);
    });

    it('should return false for UUID without hyphens', () => {
      const noHyphens = '550e8400e29b41d4a716446655440000';
      expect(isValidSessionId(noHyphens)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidSessionId(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidSessionId(undefined)).toBe(false);
    });
  });

  describe('generateSessionId', () => {
    it('should generate a valid UUID v4', () => {
      const sessionId = generateSessionId();
      expect(isValidSessionId(sessionId)).toBe(true);
    });

    it('should generate unique IDs', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();
      expect(id1).not.toBe(id2);
    });
  });
});
