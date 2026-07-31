# 予約システム デプロイガイド

このドキュメントは、予約システムの完全なデプロイ手順を、開発環境と本番環境の両方を対象に説明するものです。

## ディレクトリ構成

```
booking-deploy/
├── compose/                    # Docker Compose 設定ファイル
│   ├── docker-compose.dev.yml     # 開発環境オーケストレーション
│   ├── docker-compose.prod.yml    # 本番環境オーケストレーション
│   ├── dev.compose.env.example    # 開発環境変数のテンプレート
│   └── prod.compose.env.example   # 本番環境変数のテンプレート
├── env/                       # アプリケーション環境変数
│   ├── dev/                   # 開発環境
│   │   ├── backend.env.example
│   │   └── frontend.env.example
│   └── prod/                  # 本番環境
│       ├── backend.env.example
│       └── frontend.env.example
└── scripts/                   # デプロイスクリプト
    ├── deploy-dev.sh          # 開発環境デプロイスクリプト
    ├── deploy-prod.sh         # 本番環境デプロイスクリプト
    └── verify-images.sh       # イメージ検証スクリプト
```

## 環境準備

### 1. Docker と Docker Compose
- Docker Engine 20.10+ または Docker Desktop
- Docker Compose v2+ (推奨) または docker-compose v1.29+

### 2. 環境変数の準備

#### 開発環境
```bash
# テンプレートファイルをコピー
cd booking-deploy

# Compose 用環境変数
cp compose/dev.compose.env.example compose/dev.compose.env
# 必要に応じて dev.compose.env を編集し、Docker Hub のイメージアドレスを更新

# アプリケーション用環境変数
cp env/dev/backend.env.example env/dev/backend.env
cp env/dev/frontend.env.example env/dev/frontend.env
# .env ファイルを編集し、実際の値(JWT_SECRET など)を設定
```

#### 本番環境
```bash
cd booking-deploy
cp compose/prod.compose.env.example compose/prod.compose.env
cp env/prod/backend.env.example env/prod/backend.env
cp env/prod/frontend.env.example env/prod/frontend.env

# 重要: 本番環境では強いパスワードと本物のシークレットが必要
```

## イメージタグ戦略

予約システムの CI/CD パイプラインは、複数種類の Docker イメージタグを自動生成します。それぞれ目的と信頼性の特性が異なります。

### タグの種類

| タグ種別 | 形式例 | 変更可否 | 推奨用途 | 信頼性 |
|----------|---------------|------------|----------------|-------------|
| **ブランチタグ** | `dev`, `main` | **可変** — プッシュのたびに更新 | 迅速な開発、統合テスト | 低 — 本番には不適 |
| **コミットタグ** | `dev-abc123`, `main-def456` | **不変** — 特定コミットに紐付け | 信頼性のあるデプロイ、ロールバック、監査 | 高 — 本番推奨 |
| **セマンティックバージョン** | `v1.0.0`, `v1.2.3` | **不変** — バージョン付けされたリリース | 公式リリース、バージョン管理 | 最高 — 本番のベストプラクティス |
| **PR タグ** | `pr-123` | **可変** — PR のビルド | PR 検証、コードレビュー | 低 — 一時用途のみ |
| **latest** | `latest` | **可変** — main の最新 | 開発便宜 | 低 — 本番禁止 |

### 選定ガイド

1. **開発環境**:
   - 迅速なイテレーション: `dev` ブランチタグを使用
   - 信頼性のあるテスト: `dev-<commit-hash>` コミットタグを使用

2. **本番環境**:
   - **不変タグを必ず使用**: コミットタグまたはセマンティックバージョンタグ
   - 緊急修正: `main-<commit-hash>` を使用
   - 公式リリース: `v1.0.0` のようなセマンティックバージョンを使用
   - **禁止: `main` または `latest` タグ**

### イメージ検証

すべてのイメージは実際のデプロイトポロジーで検証されます:
- ✅ PostgreSQL と Redis の依存関係を含む
- ✅ データベースマイグレーションを実行
- ✅ ヘルスエンドポイント(`/v1/health`)を検証
- ✅ データベースと Redis の接続状態を確認
- ✅ フロントエンドのアクセシビリティを検証

### 利用可能なタグの確認

イメージタグは GitHub Actions のワークフローにより自動生成されます:
- バックエンドイメージ: [booking-backend/.github/workflows/backend-image.yml](../booking-backend/.github/workflows/backend-image.yml)
- フロントエンドイメージ: [booking-frontend/.github/workflows/frontend-image.yml](../booking-frontend/.github/workflows/frontend-image.yml)
- マイグレーションイメージ: 専用の `booking-backend-migration` イメージ

### ロールバック操作

以前のバージョンへロールバックするには:
1. 以前のコミットタグ(例: `main-abc123def`)を確認
2. `prod.compose.env` ファイル内のイメージタグを更新
3. デプロイスクリプトを再実行

```bash
# 特定のコミットへロールバック
BACKEND_IMAGE=docker.io/cho-geer/booking-backend:main-previous-commit
BACKEND_MIGRATION_IMAGE=docker.io/cho-geer/booking-backend-migration:main-previous-commit
FRONTEND_IMAGE=docker.io/cho-geer/booking-frontend:main-previous-commit
```

## デプロイ手順

### 開発環境のデプロイ
```bash
# booking-deploy ディレクトリへ移動
cd booking-deploy

# デプロイスクリプトを実行
./scripts/deploy-dev.sh
```

デプロイスクリプトは以下の手順を実行します:
1. **環境変数ファイルの存在をチェック**
2. Docker Hub から**最新イメージを取得**
3. **データベースマイグレーションを実行**(独立したマイグレーションサービス)
4. **すべてのサービスを開始**(PostgreSQL、Redis、バックエンド、フロントエンド)
5. **ヘルスチェック**ですべてのサービスが利用可能かを確認
   - バックエンドヘルスエンドポイント: `http://localhost:3001/v1/health`
   - バックエンド Swagger: `http://localhost:3001/api/docs`
   - フロントエンドページ: `http://localhost:3000`

### 本番環境のデプロイ
```bash
cd booking-deploy
./scripts/deploy-prod.sh
```

本番環境のデプロイ手順は開発環境と同じですが、設定が異なります:
- 異なる Docker Compose ファイル(`docker-compose.prod.yml`)
- 異なる環境変数ファイル(`prod.compose.env`、`env/prod/`)
- ネットワーク構成やリソース制限が異なる可能性あり

## サービス構成

### 開発環境サービス
| サービス | イメージ | ポート | 説明 |
|---------|-------|------|-------------|
| PostgreSQL | `postgres:16` | 5432 | メインデータベース |
| Redis | `redis:7-alpine` | 6379 | キャッシュとセッションストア |
| Backend | `${BACKEND_IMAGE}` | 3001 | NestJS API サービス |
| Frontend | `${FRONTEND_IMAGE}` | 3000 | Next.js フロントエンドアプリケーション |
| Migration | `${BACKEND_MIGRATION_IMAGE}` | - | データベースマイグレーションサービス |

### 本番環境との違い
- コンテナ化された PostgreSQL の代わりに外部データベース(例: RDS)を使用する場合あり
- 外部 Redis クラスターを使用する場合あり
- ロードバランサーや監視サービスを追加する場合あり
- リソース制限や再起動ポリシーが異なる

## データベースマイグレーション

### 独立したマイグレーションサービス
デプロイプロセスには、独立した `migration` サービスが含まれており、以下を保証します:
1. **マイグレーションはアプリ起動前に実行される**
2. **失敗時にはデプロイを停止**し、アプリが整合性のない DB に接続するのを防ぐ
3. **冪等性**: `prisma migrate deploy` は安全に繰り返し実行可能

### 手動でのマイグレーション実行
```bash
# 開発環境
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env run --rm migration

# 本番環境
docker compose -f compose/docker-compose.prod.yml --env-file compose/prod.compose.env run --rm migration
```

## ヘルスチェックと監視

### 内蔵ヘルスチェック
- **Backend**: `GET /v1/health` — アプリ、DB、Redis の状態を返す
- **PostgreSQL**: Docker ヘルスチェックは `pg_isready` を使用
- **Redis**: Docker ヘルスチェックは `redis-cli ping` を使用

### デプロイ後の検証
デプロイスクリプトは以下を自動検証します:
1. バックエンドのヘルスエンドポイントが `200 OK` を返すこと
2. Swagger UI にアクセス可能であること
3. フロントエンドのホームページにアクセス可能であること

### 手動検証
```bash
# バックエンドのヘルスチェック
curl http://localhost:3001/v1/health | jq .

# サービスステータスの確認
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env ps
```

## トラブルシューティング

### よくある問題

#### 1. 環境変数ファイルの欠落
```
Missing booking-deploy/compose/dev.compose.env
Create it from booking-deploy/compose/dev.compose.env.example
```
**解決策**: テンプレートファイルをコピーし、実際の値を入力してください。

#### 2. マイグレーション失敗
```
Error: P3009: migrate found failed migrations in the target database
```
**解決策**:
- データベース接続文字列を確認
- 手動でマイグレーションを修正: `docker compose exec postgres psql -U postgres -d booking_system`
- マイグレーションログを確認

#### 3. ヘルスチェック失敗
デプロイスクリプトは 80 秒でタイムアウトします。
**解決策**:
- サービスログを確認: `docker compose logs backend`
- データベース接続を確認: `docker compose exec backend npm run prisma:deploy`
- ポート競合を確認

#### 4. イメージ取得失敗
```
Error response from daemon: pull access denied for cho-geer/booking-backend
```
**解決策**:
- Docker Hub リポジトリが存在し、公開されていることを確認
- もしくはローカルビルドイメージを使うように `compose/dev.compose.env` を更新

### ログの確認
```bash
# 全サービスのログを表示
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs

# 特定サービスのログを表示
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs backend

# リアルタイムでログを追跡
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs -f
```

## アップグレードとロールバック

### バージョンアップグレード
1. `compose/dev.compose.env` または `compose/prod.compose.env` の**イメージタグを更新**
2. **デプロイスクリプトを実行**
3. 新バージョンの機能を**検証**

### ロールバック操作
1. 環境変数ファイルの**古いイメージタグを復元**
2. **デプロイスクリプトを実行**
3. **データベース前方互換性**: 古いバージョンのアプリが現在の DB スキーマで動作することを確認

### ゼロダウンタイムデプロイ(将来の拡張)
現在のデプロイ戦略はローリング再起動を使用しており、将来的には次のような拡張が可能です:
- ブルーグリーンデプロイ
- カナリーリリース
- Docker Swarm または Kubernetes の利用

## セキュリティ考慮事項

### 1. 機密情報の管理
- `.env` ファイルをバージョン管理に**絶対にコミットしない**
- 本番シークレットにはシークレット管理サービス(例: AWS Secrets Manager)を使用
- JWT シークレットや DB パスワードを定期的にローテーション

### 2. ネットワークセキュリティ
- 本番環境には専用ネットワークを使用
- データベースと Redis への外部アクセスを制限
- ファイアウォールルールを有効化

### 3. イメージセキュリティ
- イメージの脆弱性を定期的にスキャン
- 最小限のベースイメージを使用
- 依存関係を迅速に更新

## 自動化された CI/CD(将来)

現在のデプロイは手動起動ですが、将来的に CI/CD パイプラインと統合する予定です:

### GitHub Actions ワークフロー
```yaml
name: Deploy to Production
on:
  push:
    tags:
      - 'v*'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/booking-system/booking-deploy
            ./scripts/deploy-prod.sh
```

### 承認プロセス
本番デプロイには以下を含める必要があります:
1. コードレビュー
2. 自動テスト合格
3. 手動承認
4. デプロイ後の検証

---

## 付録

### A. 手動デプロイコマンドリファレンス
```bash
# イメージを取得
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env pull

# マイグレーションを実行
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env run --rm migration

# サービスを起動
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env up -d

# サービスを停止
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env down

# ステータスを表示
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env ps
```

### B. 環境変数の説明
各 `.env.example` ファイルのコメントを参照してください。

### C. 関連ドキュメント
- [Docker Hub イメージビルド設定](../booking-backend/docs/docker-hub-setup.md)
- [バックエンド API ドキュメント](../booking-backend/docs/api-contract.md)
- [フロントエンド開発ガイド](../booking-frontend/README.md)

---

*最終更新: 2026-04-08*
*メンテナー: DevOps チーム*

---

## 🇬🇧 English | 🇨🇳 中文

- [English version](./README.en.md)
- [中文版本](./README.zh.md)