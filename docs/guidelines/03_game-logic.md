# ゲームロジック実装ガイド

## シナリオエンジン（Compositeパターン）

シナリオはCompositeパターンで階層構造を実現します。

### シナリオの種類

1. **Scenario**: 抽象基底クラス
2. **SequenceScenario**: 子シナリオを順番に実行
3. **BranchScenario**: 条件分岐で子シナリオを選択
4. **EventScenario**: イベントを発生させる葉ノード
5. **EndScenario**: シナリオ終了を示す葉ノード

詳細は既存実装を参照。

## Event → EventResult → ParameterChange の流れ

### 基本フロー

1. **Event**: イベント発生（例: 猫が鳴く、トイレを使う）
2. **EventResult**: イベント結果の計算（感情変化、なつき度変化）
3. **ParameterChange**: パラメータ変更の適用（状態更新）

実装例は既存コードを参照。

## ターン制の状態管理

### 基本原則

- **ターン単位**: ゲームはターン単位で進行（リアルタイムではない）
- **状態保存**: 各ターン終了時にセッションに状態を保存
- **時間ベースの更新**: 1秒あたりの変化量で定義し、実行時にFPSで割る

## セッション管理（iron-session）

### セッションデータ構造

```typescript
export interface SessionData {
  username: string | null;
  catName: string | null;
  catState: CatState | null;
}

export interface CatState {
  bonding: {
    level: number;
    gauge: number;
  };
  emotion: {
    comfort: number;
    arousal: number;
    safety: number;
  };
}
```

### API設計

```typescript
// 状態取得
GET /api/cat-state
Response: { catState: CatState | null, catName: string | null }

// 状態保存
POST /api/cat-state
Body: { catState: CatState }
```

## 静的シナリオの原則

- **すべてのユーザーが同じイベントを同じタイミングで体験**
- ランダム性は排除し、再現性を確保
- シナリオはデータ駆動（JSON/YAMLで定義）

詳細は `@docs/adr/ADR-0004_シナリオエンジンのスクラッチ開発.md` を参照。
