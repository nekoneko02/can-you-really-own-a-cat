import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';

/**
 * MVP用バックエンド定義
 * DynamoDBのみ（認証なし）
 * @see https://docs.amplify.aws/react/build-a-backend/
 */
defineBackend({
  data,
});
