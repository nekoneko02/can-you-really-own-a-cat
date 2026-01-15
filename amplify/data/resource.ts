import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * アンケートデータのスキーマ定義
 * テーブル論理名: can-you-own-a-cat-surveys
 */
const schema = a.schema({
  Survey: a
    .model({
      sessionId: a.string().required(),
      scenarioSlug: a.string().required(),
      preSurvey: a.json(),
      postSurvey: a.json(),
      startedAt: a.string().required(),
      completedAt: a.string(),
    })
    .identifier(['sessionId'])
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
