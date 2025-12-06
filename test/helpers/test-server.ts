/**
 * 統合テスト用のヘルパー関数
 * Next.js API Routeをテストするためのユーティリティ
 */

import { NextRequest } from 'next/server';

/**
 * テスト用のNextRequestを作成
 */
export function createTestRequest(
  url: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): NextRequest {
  const { method = 'GET', body, headers = {} } = options;

  const requestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    requestInit.body = JSON.stringify(body);
  }

  return new NextRequest(url, requestInit);
}

/**
 * レスポンスからJSONを取得
 */
export async function getResponseJSON(response: Response): Promise<any> {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
