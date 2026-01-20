# 開発者向けドキュメント

このドキュメントは、本プロジェクトの開発に参加する方向けの情報です。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **セッション管理**: iron-session
- **テスト**: Jest
- **ホスティング**: AWS Amplify
- **データ保管**: DynamoDB（現在はアンケート情報の保存のみ）

## プロジェクト構成

```
can-you-really-own-a-cat/
├── src/                    # ソースコード
│   ├── domain/            # ドメイン層
│   ├── application/       # アプリケーション層
│   ├── infrastructure/    # インフラ層
│   ├── presentation/      # プレゼンテーション層
│   └── lib/               # 共通ライブラリ
├── test/                  # テストコード
├── docs/                  # ドキュメント
│   ├── aidlc/            # AI-DLC関連
│   ├── guidelines/       # 開発ガイドライン
│   └── product/          # プロダクト仕様
└── CLAUDE.md             # AI開発ルール（ナビゲーション）
```

## 開発開始前に読むべきドキュメント

### 1. AI開発ルール（最重要）

- **[CLAUDE.md](CLAUDE.md)**: AI（Claude）との協働開発のナビゲーション
- **[docs/aidlc/AI_DLCとは.md](docs/aidlc/AI_DLCとは.md)**: AI-DLC（AI駆動開発ライフサイクル）の原則

### 2. 開発ガイドライン

- [01_project-context.md](docs/guidelines/01_project-context.md): プロジェクト固有情報（最初に必読）
- [06_releasing.md](docs/guidelines/06_releasing.md): リリース前チェックガイド
- [07_code-review.md](docs/guidelines/07_code-review.md): コードレビューガイド

### 3. プロダクト仕様

- [docs/product/君はねこを飼えるか/README.md](docs/product/君はねこを飼えるか/README.md): プロダクト概要
- [docs/product/君はねこを飼えるか/50-機能一覧の概要.md](docs/product/君はねこを飼えるか/50-機能一覧の概要.md): 機能要件

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# テスト実行
npm test
```

## 開発フロー（TDD）

1. タスクを受ける
2. 該当するガイドラインを読む（[CLAUDE.md](CLAUDE.md) 参照）
3. テストを書く（TDD: Red）
4. 実装する（TDD: Green）
5. リファクタリング（TDD: Refactor）
6. ビルドチェック（`npm run build`, `npm test`）
7. PR作成

## AI-DLC（AI駆動開発ライフサイクル）の原則

このプロジェクトはAI-DLCの原則に従って開発します:

1. **AIが実行し、人間が監視する**: AIが計画立案と実行を中心的に行い、人間は判断・意思決定に注力
2. **会話の方向性の逆転**: AIが会話を開始し、人間に質問・提案を行う
3. **迅速なサイクル（Bolt）**: 時間または日単位で測定される迅速な開発サイクル
4. **損失関数としての人間**: 各ステップで人間が検証し、エラーを早期に捕捉・修正

詳細は [docs/aidlc/AI_DLCとは.md](docs/aidlc/AI_DLCとは.md) を参照。

## ライセンス

Private
