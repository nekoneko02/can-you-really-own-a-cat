# UI層実装ガイド

## Next.js ページ実装（App Router）

### 基本構成

1ゲーム画面 = 1 Next.jsページ + 1 Phaser.Scene具象クラス

### ページの責務

- 画面遷移・ルーティング
- API呼び出し（ApiClient経由）
- セッション状態の受け渡し
- Phaserゲームの起動・終了制御

実装例は既存ページを参照。

## React コンポーネント実装

### UIコンポーネント

- ゲーム画面外のUI（メニュー、設定、結果表示など）
- ゲーム開始前・終了後の画面
- モーダル・ダイアログ

### 実装原則

- **Atomic Design**: atoms, molecules, organisms, templatesで構成
- **再利用性**: 汎用的なコンポーネントは`presentation/components/`に配置
- **状態管理**: Next.jsのClient Componentsで状態管理

## Phaser Scene 実装（ステートレス設計）

### Sceneの責務

- 描画・入力処理
- ゲームロジック実行
- ドメインモデル（Cat, Game）との連携

### ステートレス設計の原則

- **状態を持たない**: Sceneは状態を保持せず、init(data)で受け取る
- **1ゲーム = 1インスタンス**: おもちゃ切り替え時は破棄→再生成
- **状態保存はNext.js側**: Scene終了時にonGameEndコールバックで状態を返す

実装例は既存Sceneクラスを参照。

## Next.js と Phaser の責務分担

### Next.js の責務

- 画面遷移・ルーティング
- API呼び出し・セッション管理
- 内部状態の永続化
- ゲーム開始・終了のトリガ

### Phaser の責務

- 描画・入力処理
- ゲームロジック実行
- ステートレス設計（状態は受け取り、返すのみ）

### 共通モジュールの役割

- **ApiClient**: API呼び出しの統一インターフェース
- **GameManager**: Phaserライフサイクル管理
- **StateSaver**: 状態保存・復元処理

## API呼び出し（ApiClient 必須）

### 禁止事項

- UI層から直接`fetch()`を使用することは禁止

### 必須事項

- 必ず`@/infrastructure/api/ApiClient.ts`のラッパー関数を使用

### 新しいAPI追加時

ApiClientにラッパー関数を追加：

```typescript
// infrastructure/api/ApiClient.ts
async getScenarioData(scenarioId: string): Promise<ApiResponse<ScenarioData>> {
  return this.request<ScenarioData>(`/api/scenarios/${scenarioId}`, {
    method: 'GET',
  });
}
```
