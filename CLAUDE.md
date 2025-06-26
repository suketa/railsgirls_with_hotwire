# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Rails Girls チュートリアルアプリケーションで、Rails 7.1.5 と Hotwire 機能（Turbo と Stimulus）を使用して構築されています。ユーザーがアイデアを作成、編集、削除し、Turbo Streams を使用してリアルタイム更新でコメントを追加できるアイデア管理システムです。

## 主要技術

- **Rails 7.1.5** with Ruby 3.2.5
- **Hotwire Stack**: Turbo Rails + Stimulus for SPA-like interactions
- **SQLite3** database for development
- **Active Storage** for file attachments (アイデアに画像添付可能)
- **ImportMap** for JavaScript module management

## コアモデル & リレーション

- **Idea**: メインエンティティ（name, description, 画像添付オプション）
- **Comment**: ideaに属する、user_nameとbodyを持つ、両フィールドの presence validation あり
- コメントは `recent` スコープで `created_at: :desc` 順に並び替え

## 開発コマンド

### サーバー & 開発
```bash
rails server              # 開発サーバー起動
rails console             # Rails コンソール
rails generate            # コード生成
```

### データベース
```bash
rails db:migrate          # マイグレーション実行
rails db:seed             # シードデータ読み込み
rails db:schema:load       # schema.rb からスキーマ読み込み
```

### テスト
```bash
rails test                 # 全テスト実行
rails test:system         # システムテストのみ実行
rails test test/models/    # 特定のテストディレクトリ実行
```

## Hotwire アーキテクチャ

### Turbo Frames
- コメントセクションは `app/views/ideas/show.html.erb:27` で `turbo_frame_tag "comments"` を使用してターゲット更新
- 個別コメントは `app/views/comments/_comment.html.erb:1` で `turbo_frame_tag comment` でラップして個別編集/削除

### Turbo Streams
- コメント作成: `app/views/comments/create.turbo_stream.erb` 
- コメント削除: `app/views/comments/destroy.turbo_stream.erb`
- コントローラーアクションはリアルタイム更新のために Turbo Stream フォーマットでレスポンス

### コントローラーパターン
- `CommentsController` は Turbo Stream レスポンスのためにリダイレクトの代わりに `render :create, status: :created` を返す
- `IdeasController` で JSON API サポートのために `respond_to` ブロックを使用
- ideas と comments 両方で strong parameters が適切に設定済み

## ファイル構造ノート

### Views
- Ideas views は `app/views/ideas/` で標準 Rails 規約に従う
- Comments はパーシャルを使用: `_comment.html.erb`, `_form.html.erb`
- 動的更新用の Turbo Stream テンプレート

### JavaScript
- Stimulus controllers は `app/javascript/controllers/` に配置
- `hello_controller.js` がサンプルとして含まれる
- ImportMap 設定は `config/importmap.rb`

### スタイリング
- テンプレート全体で Bootstrap クラスを使用
- CSS は `app/assets/stylesheets/application.css`

## 重要な実装パターン

### コメントバリデーション & エラーハンドリング
- コメントは `user_name` と `body` の両方の presence が必要
- コントローラーでのエラーハンドリングは適切なステータスコードを返す
- フォームバリデーションは Turbo Stream 更新と統合

### ネストしたリソース
- Comments は ideas の下にネスト: `resources :ideas do resources :comments end`
- コントローラーアクションは `@idea = Idea.find(params[:idea_id])` パターンを使用

### Active Storage 統合
- Ideas は画像添付可能
- `image_tag(url_for(@idea.picture))` パターンで画像表示
- ファイルアップロードは strong parameters で処理

## 重要な規約

- コード内の日本語コメントは許可（models と controllers で確認済み）
- Ruby ファイルで `frozen_string_literal: true` を使用
- controllers, models, views で Rails ネーミング規約に従う
- 一貫したインデントと Ruby スタイルを維持