/**
 * Amplify Data Client
 * サーバーサイドでのAmplify SDK初期化
 */

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

// Amplify設定ファイルを読み込み（存在する場合）
let isConfigured = false;

/**
 * Amplifyを初期化
 * 設定ファイルが存在しない場合はエラーをログ出力して続行
 */
export function configureAmplify(): void {
  if (isConfigured) {
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const config = require('@/amplifyconfiguration.json');
    Amplify.configure(config, { ssr: true });
    isConfigured = true;
  } catch (error) {
    console.warn('Amplify configuration not found. DynamoDB operations will fail.', error);
  }
}

/**
 * Amplify Data Clientを取得
 */
export function getDataClient() {
  configureAmplify();
  return generateClient<Schema>();
}
