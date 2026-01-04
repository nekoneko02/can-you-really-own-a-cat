/**
 * セッション関連のユーティリティ関数
 */

/**
 * UUIDv4 形式かどうかを検証する
 */
export function isValidSessionId(id: string | null | undefined): boolean {
  if (!id) {
    return false;
  }
  // UUIDv4 の正規表現パターン
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(id);
}

/**
 * UUIDv4 を生成する
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}
