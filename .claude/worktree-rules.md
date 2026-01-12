# Git Worktree ルール

## 概要

Issue単位の開発では、`./worktree` ディレクトリ内の git worktree で作業を行います。

## 作業ディレクトリ

- 作業パス: `./worktree/issue-<issue-number>/`
- ブランチ名: `issue-<issue-number>`

## 注意事項

- **すべてのファイル操作はこの worktree 内で行うこと**
- メインの作業ディレクトリを変更しないこと
- worktree の作成・削除は呼び出し元（develop-issue スキル）が行う
