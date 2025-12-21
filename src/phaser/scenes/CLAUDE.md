# Phaser シーン開発ガイド

このドキュメントは、Phaserシーンを作成する際の共通設計ルールです。

---

## UI共通設計

### レイアウト定数（UIConstants.ts）

すべてのUI要素は `@/phaser/ui/UIConstants` の定数を使用すること。

```typescript
import { UIColors, UIFonts, UIButtonSizes, UILayout } from '@/phaser/ui/UIConstants';
```

#### 画面レイアウト（800x600）

| エリア | 位置 | サイズ | 用途 |
|--------|------|--------|------|
| プレイエリア | 左上 | 590x470 | キャラクター・背景表示 |
| 選択肢エリア | 右端 | 190x340 | 選択肢ボタン（縦配置） |
| ダイアログエリア | 下部 | 800x120 | テキスト表示 |
| 進行状況 | 左上 | 120x55 | Day + 時刻 |

### ボタン作成

#### BaseButton を使用する

```typescript
import { BaseButton } from '@/phaser/ui/components/BaseButton';

// プライマリボタン（シーン遷移など）
const button = new BaseButton(this, x, y, 'ラベル', onClick, { size: 'primary' });

// 選択肢ボタン
const choice = new BaseButton(this, x, y, 'ラベル', onClick, { size: 'choice' });

// セカンダリボタン（モーダル内など）
const secondary = new BaseButton(this, x, y, 'ラベル', onClick, {
  size: 'secondary',
  color: UIColors.accent
});
```

#### ボタンサイズ

| サイズ | 幅x高 | 用途 |
|--------|-------|------|
| primary | 200x50 | シーン遷移、主要アクション |
| choice | 170x40 | イベント選択肢 |
| secondary | 120x36 | モーダル内ボタン |

### ダイアログ表示

#### テキスト送り対応（推奨）

```typescript
import { DialogSystem, DialogData } from '@/phaser/ui/DialogSystem';

const dialog = new DialogSystem(this);

// ページ配列でテキストを渡す
const data: DialogData = {
  pages: [
    { text: '1ページ目のテキスト' },
    { text: '2ページ目のテキスト', style: 'highlight' }
  ]
};

dialog.showPages(data, () => {
  // 全ページ表示完了時のコールバック
});
```

#### レガシー表示（既存互換）

```typescript
dialog.show('タイトル', '説明文', ['猫の様子1', '猫の様子2']);
```

### 進行状況表示

```typescript
import { ProgressIndicator } from '@/phaser/ui/ProgressIndicator';

const progress = new ProgressIndicator(this, 20, 20);
progress.update(day, time, phase);
```

---

## シーン作成チェックリスト

1. [ ] UIConstants の定数を使用している
2. [ ] ボタンは BaseButton を使用している
3. [ ] ダイアログは DialogSystem を使用している
4. [ ] 色は UIColors から参照している
5. [ ] フォントは UIFonts から参照している
6. [ ] レイアウトは UILayout の座標を参照している

---

## ファイル構成

```
src/phaser/
├── scenes/          # シーン定義
│   ├── CLAUDE.md   # このファイル
│   ├── RoomScene.ts
│   └── ...
├── ui/              # UIコンポーネント
│   ├── UIConstants.ts      # 共通定数
│   ├── DialogSystem.ts     # ダイアログ
│   ├── ProgressIndicator.ts # 進行状況
│   ├── ChoiceButton.ts     # 選択肢ボタン
│   └── components/
│       └── BaseButton.ts   # 基底ボタン
└── ...
```

---

## 参考リンク

- @src/phaser/ui/UIConstants.ts - 共通定数の定義
- @src/phaser/ui/components/BaseButton.ts - 基底ボタンの実装
- @src/phaser/ui/DialogSystem.ts - ダイアログシステムの実装
