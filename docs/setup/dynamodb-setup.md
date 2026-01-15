# DynamoDB セットアップガイド

このドキュメントでは、アンケートデータの永続化に使用するDynamoDBのセットアップ手順を説明します。

## 環境構成

| 環境 | Next.js | DynamoDB | 用途 |
|------|---------|----------|------|
| ローカルデバッグ | localhost | AWS dev環境（実際のDynamoDB） | 開発・動作確認 |
| 単体テスト | localhost | モック | CI/CD、テスト自動化 |
| 本番 | Amplify Hosting | 本番DynamoDB | プロダクション |

## 前提条件

- Node.js 18以上
- AWS CLI（設定済み）
- npm または yarn

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Amplify Sandbox環境の起動（開発用）

個人開発用のsandbox環境を起動します。

```bash
npx ampx sandbox
```

このコマンドは以下を実行します:
- DynamoDBテーブルの作成
- `amplifyconfiguration.json` の生成

### 3. 既存環境の設定取得

既にデプロイ済みの環境（dev/prod）の設定を取得する場合:

```bash
npx ampx generate outputs --branch <branch>
```

例:
```bash
npx ampx generate outputs --branch main
```

## テーブル設計

### テーブル名
`Survey`（Amplifyが自動生成）

### スキーマ

| 属性 | 型 | 説明 |
|------|-----|------|
| sessionId (PK) | String | セッション識別子（UUID v4） |
| scenarioSlug | String | シナリオ識別子 |
| preSurvey | JSON | 事前アンケート回答 |
| postSurvey | JSON | 事後アンケート回答 |
| startedAt | String | 開始日時（ISO8601） |
| completedAt | String | 完了日時（ISO8601） |

## 認証設定

MVP段階では認証なし（guest access）で構成されています。

```typescript
// amplify/data/resource.ts
.authorization((allow) => [allow.guest()])
```

## トラブルシューティング

### amplifyconfiguration.json が見つからない

```
Error: Amplify configuration not found
```

以下を実行して設定ファイルを生成してください:
```bash
npx ampx sandbox
# または
npx ampx generate outputs --branch <branch>
```

### DynamoDB書き込みエラー

エラーはログに出力されますが、ユーザー体験には影響しません。
CloudWatch Logsで `Failed to save` を検索してエラーを確認してください。

## 参考リンク

- [Amplify Gen2 Data ドキュメント](https://docs.amplify.aws/gen2/build-a-backend/data/)
- [DynamoDB 開発者ガイド](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/)
