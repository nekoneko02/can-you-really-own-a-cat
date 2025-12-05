# リリース前チェックガイド

## ビルドチェック

### 必須チェック項目

コード変更後は、必ず以下のビルドチェックを実行：

#### 1. 基本ビルドチェック

```bash
NEXT_BUILD_DIR=.next_tmp npm run build --no-lint
```

#### 2. 型チェック付きビルド

```bash
NEXT_BUILD_DIR=.next_tmp npm run build
```

#### 3. テスト実行

```bash
npm test              # 全テスト実行
npm run test:watch    # watchモードでテスト実行
npm run test:coverage # カバレッジ付きテスト実行
```

#### 4. Lintチェック

```bash
npm run lint
```

### チェック基準

- **エラー**: ビルドエラーが発生した場合は必ず修正
- **警告**: ESLintの警告は可能な限り修正（未使用変数など）
- **プリレンダリング**: SSG/SSRエラーが発生しないことを確認
- **型安全性**: TypeScriptの型エラーがないことを確認

### 注意事項

- **npm run dev 等のローカルサーバーは起動しない**: 既に起動済みであることが多いため、明示的に起動・停止しない
