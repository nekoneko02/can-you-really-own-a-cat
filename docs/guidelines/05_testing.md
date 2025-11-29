# テスト実装ガイド

## TDD原則（Red-Green-Refactor）

### 基本サイクル

1. **Red**: 失敗するテストを書く
2. **Green**: テストを通す最小限の実装をする
3. **Refactor**: コードをリファクタリングする

### テスト作成の対象

- **ドメインモデル**: エンティティ、値オブジェクト（必須）
- **ビジネスロジック**: アクション、計算ロジック（必須）
- **ユーティリティ**: ヘルパー関数、ユーティリティクラス（必須）

### テスト作成の対象外

- **UIコンポーネント**: React コンポーネント、Phaser Scene（手動テストで確認）
- **純粋なインフラ層**: Next.js API ルート、データベース接続（E2Eテストで確認）

## 単体テスト作成ガイドライン

### テストファイルの配置

テストファイル（*.test.ts）は`test/`ディレクトリに配置：

```
src/domain/entities/Cat.ts
→ test/domain/entities/Cat.test.ts

src/lib/utils/calculateDistance.ts
→ test/lib/utils/calculateDistance.test.ts
```

### テスト対象

- **全メソッド**: publicメソッドだけでなく、privateメソッドも単体テストを作成
- **カバレッジ基準**: 最低C1カバレッジ（分岐網羅）を確保
- **結合テスト**: 公開メソッドについては、主要シナリオの結合テストも作成

### テストの基本構造

```typescript
// test/domain/entities/Cat.test.ts
import { Cat } from '@/domain/entities/Cat';

describe('Cat', () => {
  describe('update', () => {
    it('正常系: 状態を更新できる', () => {
      // Arrange
      const cat = Cat.createDefault();

      // Act
      const result = cat.update(externalState, 100, 100);

      // Assert
      expect(result).toBeDefined();
    });

    it('異常系: null値の場合エラーを返す', () => {
      const cat = Cat.createDefault();
      expect(() => cat.update(null, 100, 100)).toThrow();
    });
  });
});
```

## 分岐網羅（C1カバレッジ）

### 分岐条件のテスト

- if文の真偽両方をテスト
- switch文の全caseをテスト
- 三項演算子の両方の結果をテスト
- エラーケースも含める

実装例は既存テストコードを参照。

## 境界値テスト

### 境界値の確認

- 数値の上限・下限をテスト
- 範囲チェック処理（clamp等）の境界値を確認
- 例: 値が0～1の範囲の場合、-0.1, 0, 0.5, 1, 1.1 をテスト

実装例は既存テストコードを参照。

## モックの作成方法

### モック作成の指針

- **外部依存のモック化**: GameTimeManager等の外部クラスはモックを作成
- **純粋な単体テスト**: 依存クラスの実装詳細に影響されないテストを作成
- **制御可能性**: テスト用に状態を制御できるモックを実装

実装例は既存モックコードを参照。

## テストファイルの配置（`test/` ディレクトリ）

### ディレクトリ構造

```
test/
├── domain/
│   ├── entities/
│   │   ├── Cat.test.ts
│   │   └── User.test.ts
│   └── valueObjects/
│       ├── Emotion.test.ts
│       └── Position.test.ts
├── lib/
│   └── utils/
│       └── calculateDistance.test.ts
└── mocks/
    └── MockGameTimeManager.ts
```

### Jest設定

`jest.config.js`でテストディレクトリとモジュール解決を設定：

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',  // @/エイリアスの解決
},
roots: ['<rootDir>/test'],         // テストルートディレクトリ
```
