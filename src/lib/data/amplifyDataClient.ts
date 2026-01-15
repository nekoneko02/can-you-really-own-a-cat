/**
 * Amplify Data Client
 * サーバーサイドでのAmplify SDK初期化
 */

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import * as fs from 'fs';
import * as path from 'path';

// Amplify設定ファイルを読み込み（存在する場合）
let isConfigured = false;

/**
 * amplify_outputs.json のパスを解決
 * Next.js のサーバーサイドでは process.cwd() がプロジェクトルートを指す
 */
function resolveAmplifyOutputsPath(): string {
  // プロジェクトルートの amplify_outputs.json を探す
  const possiblePaths = [
    path.join(process.cwd(), 'amplify_outputs.json'),
    path.resolve(__dirname, '../../../../amplify_outputs.json'),
    path.resolve(__dirname, '../../../amplify_outputs.json'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error(
    `amplify_outputs.json not found. Searched paths: ${possiblePaths.join(', ')}`
  );
}

/**
 * Amplifyを初期化
 * 設定ファイルが存在しない場合はエラーをログ出力して続行
 */
export function configureAmplify(): void {
  if (isConfigured) {
    return;
  }

  try {
    const configPath = resolveAmplifyOutputsPath();
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    Amplify.configure(config, { ssr: true });
    isConfigured = true;
    console.info(`Amplify configured successfully from: ${configPath}`);
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
