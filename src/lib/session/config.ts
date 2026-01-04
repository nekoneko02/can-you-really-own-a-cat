/**
 * iron-session の設定
 */

import type { SessionOptions } from 'iron-session';

/**
 * iron-session の設定オプション
 */
export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    'complex_password_at_least_32_characters_long',
  cookieName: 'nightcry_session',
  cookieOptions: {
    // production 環境では secure を有効化
    secure: process.env.NODE_ENV === 'production',
    // XSS 対策
    httpOnly: true,
    // CSRF 対策
    sameSite: 'lax',
    // セッション有効期限（7日）
    maxAge: 60 * 60 * 24 * 7,
  },
};
