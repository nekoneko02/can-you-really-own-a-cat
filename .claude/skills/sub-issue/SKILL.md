---
name: sub-issue
description: GitHub Issueの親子関係（階層構造）を管理します。Intent/Unit構造のIssue作成、子Issue追加、一覧表示を行う際に使用します。サブIssue、子Issue、親子Issueといったキーワードで呼び出されます。
allowed-tools: Bash
---

# gh sub-issue - GitHub Issue 階層管理

GitHub CLIの拡張機能で、Issue間の親子関係を管理します。

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `gh sub-issue add <親> <子>` | 既存Issueを親の子として追加 |
| `gh sub-issue create --parent <親> --title "タイトル"` | 新規子Issueを作成 |
| `gh sub-issue list <親>` | 親Issueの子Issue一覧を表示 |
| `gh sub-issue remove <親> <子>` | 子Issueの関連付けを解除 |

## 使用例

### 既存Issueを子として追加

```bash
# Issue #456 を Issue #123 の子として追加
gh sub-issue add 123 456
```

### 新規子Issueを作成

```bash
# Issue #10 の子として新規Issueを作成
gh sub-issue create --parent 10 --title "サブタスク: 認証機能の実装"

# bodyも指定する場合
gh sub-issue create --parent 10 --title "タイトル" --body "詳細説明"
```

### 子Issue一覧を表示

```bash
# Issue #10 の子Issue一覧を表示
gh sub-issue list 10
```

### 子Issueの関連付けを解除

```bash
# Issue #123 から Issue #456 の関連付けを解除（Issueは削除されない）
gh sub-issue remove 123 456
```

## AI-DLC Issue運用との連携

このプロジェクトでは以下の階層でIssueを管理します：

```
[Intent] ビジネス意図 (親Issue)
  └─ [Unit] 実装単位 (子Issue)
       └─ [Unit] サブUnit (孫Issue、必要な場合のみ)
```

### Intent Issue作成後にUnit Issueを紐付ける例

```bash
# 1. Intent Issueを作成（通常のgh issue create）
gh issue create --title "[Intent] ユーザー認証機能" --body "..."

# 2. Unit Issueを子として作成
gh sub-issue create --parent 1 --title "[Unit] ログイン画面の実装"
gh sub-issue create --parent 1 --title "[Unit] セッション管理の実装"
```
