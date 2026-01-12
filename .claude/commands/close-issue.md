---
description: Issue完了処理（Merge, ブランチ削除, worktreeクリーンアップ, Issueクローズ）
argument-hint: issueNumbers
allowed-tools: Bash
---

# Issue完了処理

引数で指定されたIssue番号（スペース区切りで複数指定可）に対して、以下の完了処理を実行してください。

クローズするIssue番号: `$ARGUMENTS`

## 各Issueに対して以下を実行

### 1. ブランチのマージ

```bash
git checkout main
git merge issue-<issue-number> --no-ff -m "Merge branch 'issue-<issue-number>'"
```

### 2. worktree のクリーンアップ

```bash
git worktree remove ./worktree/issue-<issue-number>
```

### 3. ブランチの削除

```bash
# ローカルブランチ削除
git branch -d issue-<issue-number>
```

### 4. Issue のクローズ

```bash
gh issue close <issue-number> --comment <完了コメント>
```

## 注意事項

- マージ前にコンフリクトがないか確認すること
- エラーが発生した場合は処理を中断し、状況を報告すること
- 複数Issue指定時は順番に処理し、各Issueの結果を報告すること
