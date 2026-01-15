import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * アンケートデータのスキーマ定義
 * テーブル論理名: can-you-own-a-cat-surveys
 *
 * 認証設定:
 * - API Key を使用したパブリックアクセス（認証なし）
 * - MVP段階では認証機能を使用しないため、publicApiKey を採用
 */
const schema = a.schema({
  Survey: a
    .model({
      sessionId: a.string().required(),
      scenarioSlug: a.string().required(),
      preSurvey: a.json(),
      postSurvey: a.json(),
      startedAt: a.string().required(),
      scenarioCompletedAt: a.string(),
      completedAt: a.string(),
    })
    .identifier(['sessionId'])
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
