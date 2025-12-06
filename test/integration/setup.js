/**
 * 統合テスト用のセットアップ
 * @edge-runtime/jest-environment 用
 */

// TextEncoder/TextDecoderのpolyfill
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Next.js環境変数のモック
process.env.SESSION_SECRET = 'test_secret_at_least_32_characters_long_for_testing';
process.env.NODE_ENV = 'test';
