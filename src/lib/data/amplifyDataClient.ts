/**
 * Amplify Data Client
 * サーバーサイドでのAmplify Gen2 SDK初期化
 */

import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api';
import { cookies } from 'next/headers';
import type { Schema } from '@/amplify/data/resource';
import outputs from '@/amplify_outputs.json';

/**
 * Amplify Server Runner
 * Next.jsのサーバーコンテキストでAmplifyを実行するためのユーティリティ
 */
export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

/**
 * Amplify Data Clientを取得
 * サーバーサイドでDynamoDB操作を行うためのクライアント
 *
 * Next.js App Router の Server Component や Route Handler から使用可能
 */
export function getDataClient() {
  return generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
  });
}
