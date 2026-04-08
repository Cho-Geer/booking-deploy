# Booking 系统部署指南

本文档描述 Booking 系统的完整部署流程，涵盖开发环境与生产环境。

## 目录结构

```
booking-deploy/
├── compose/                    # Docker Compose 配置文件
│   ├── docker-compose.dev.yml     # 开发环境编排
│   ├── docker-compose.prod.yml    # 生产环境编排
│   ├── dev.compose.env.example    # 开发环境变量模板
│   └── prod.compose.env.example   # 生产环境变量模板
├── env/                       # 应用环境变量
│   ├── dev/                   # 开发环境
│   │   ├── backend.env.example
│   │   └── frontend.env.example
│   └── prod/                  # 生产环境
│       ├── backend.env.example
│       └── frontend.env.example
└── scripts/                   # 部署脚本
    ├── deploy-dev.sh          # 开发环境部署脚本
    ├── deploy-prod.sh         # 生产环境部署脚本
    └── verify-images.sh       # 镜像验证脚本
```

## 环境准备

### 1. Docker 与 Docker Compose
- Docker Engine 20.10+ 或 Docker Desktop
- Docker Compose v2+（推荐）或 docker-compose v1.29+

### 2. 环境变量文件准备

#### 开发环境
```bash
# 复制模板文件
cd booking-deploy

# Compose 环境变量
cp compose/dev.compose.env.example compose/dev.compose.env
# 编辑 dev.compose.env，更新 Docker Hub 镜像地址（如果需要）

# 应用环境变量
cp env/dev/backend.env.example env/dev/backend.env
cp env/dev/frontend.env.example env/dev/frontend.env
# 编辑 .env 文件，设置实际值（如 JWT_SECRET 等）
```

#### 生产环境
```bash
cd booking-deploy
cp compose/prod.compose.env.example compose/prod.compose.env
cp env/prod/backend.env.example env/prod/backend.env
cp env/prod/frontend.env.example env/prod/frontend.env

# 重要：生产环境需要设置强密码和真实密钥
```

## 镜像标签策略

Booking 系统的 CI/CD 流水线会自动生成多种类型的 Docker 镜像标签，每种标签有不同的用途和可靠性特征：

### 标签类型

| 标签类型 | 格式示例 | 可变性 | 推荐用途 | 可靠性 |
|----------|----------|--------|----------|--------|
| **分支标签** | `dev`, `main` | **可变** - 每次推送都会更新 | 快速开发、集成测试 | 低 - 不适合生产 |
| **提交标签** | `dev-abc123`, `main-def456` | **不可变** - 绑定到特定提交 | 可靠部署、回滚、审计 | 高 - 生产推荐 |
| **语义版本** | `v1.0.0`, `v1.2.3` | **不可变** - 版本化发布 | 正式发布、版本管理 | 最高 - 生产最佳实践 |
| **PR 标签** | `pr-123` | **可变** - PR 构建 | PR 验证、代码评审 | 低 - 仅临时使用 |
| **latest** | `latest` | **可变** - main 分支最新 | 开发便利性 | 低 - 禁止用于生产 |

### 选择指南

1. **开发环境**:
   - 快速迭代: 使用 `dev` 分支标签
   - 可靠测试: 使用 `dev-<commit-hash>` 提交标签

2. **生产环境**:
   - **必须使用不可变标签**: 提交标签或语义版本标签
   - 紧急修复: 使用 `main-<commit-hash>`
   - 正式发布: 使用 `v1.0.0` 等语义版本
   - **禁止使用 `main` 或 `latest` 标签**

### 镜像验证

所有镜像都经过真实部署拓扑的验证：
- ✅ 包含 PostgreSQL 和 Redis 依赖
- ✅ 运行数据库迁移
- ✅ 验证健康端点 (`/v1/health`)
- ✅ 检查数据库和 Redis 连接状态
- ✅ 验证前端可访问性

### 查看可用标签

镜像标签由 GitHub Actions 工作流自动生成：
- 后端镜像: [booking-backend/.github/workflows/backend-image.yml](../booking-backend/.github/workflows/backend-image.yml)
- 前端镜像: [booking-frontend/.github/workflows/frontend-image.yml](../booking-frontend/.github/workflows/frontend-image.yml)
- 迁移镜像: 专用 `booking-backend-migration` 镜像

### 回滚操作

要回滚到之前的版本：
1. 查找之前的提交标签（如 `main-abc123def`）
2. 更新 `prod.compose.env` 文件中的镜像标签
3. 重新运行部署脚本

```bash
# 回滚到特定提交
BACKEND_IMAGE=docker.io/cho-geer/booking-backend:main-previous-commit
BACKEND_MIGRATION_IMAGE=docker.io/cho-geer/booking-backend-migration:main-previous-commit
FRONTEND_IMAGE=docker.io/cho-geer/booking-frontend:main-previous-commit
```

## 部署流程

### 开发环境部署
```bash
# 进入 booking-deploy 目录
cd booking-deploy

# 运行部署脚本
./scripts/deploy-dev.sh
```

部署脚本执行以下步骤：
1. **检查环境变量文件**是否存在
2. **拉取最新镜像**从 Docker Hub
3. **执行数据库迁移**（独立 migration 服务）
4. **启动所有服务**（PostgreSQL, Redis, Backend, Frontend）
5. **健康检查**验证所有服务可用
   - 后端健康端点：`http://localhost:3001/v1/health`
   - 后端 Swagger：`http://localhost:3001/api/docs`
   - 前端页面：`http://localhost:3000`

### 生产环境部署
```bash
cd booking-deploy
./scripts/deploy-prod.sh
```

生产环境部署流程与开发环境相同，但使用不同的配置：
- 不同的 Docker Compose 文件 (`docker-compose.prod.yml`)
- 不同的环境变量文件 (`prod.compose.env`, `env/prod/`)
- 可能不同的网络配置和资源限制

## 服务架构

### 开发环境服务
| 服务 | 镜像 | 端口 | 说明 |
|------|------|------|------|
| PostgreSQL | `postgres:16` | 5432 | 主数据库 |
| Redis | `redis:7-alpine` | 6379 | 缓存和会话存储 |
| Backend | `${BACKEND_IMAGE}` | 3001 | NestJS API 服务 |
| Frontend | `${FRONTEND_IMAGE}` | 3000 | Next.js 前端应用 |
| Migration | `${BACKEND_MIGRATION_IMAGE}` | - | 数据库迁移服务 |

### 生产环境差异
- 可能使用外部数据库（如 RDS）而非容器化 PostgreSQL
- 可能使用外部 Redis 集群
- 可能添加负载均衡和监控服务
- 资源限制和重启策略不同

## 数据库迁移

### 独立迁移服务
部署流程中包含独立的 `migration` 服务，确保：
1. **迁移先于应用启动**执行
2. **失败时停止部署**，防止应用连接到不一致的数据库
3. **幂等性**：`prisma migrate deploy` 可安全重复执行

### 手动执行迁移
```bash
# 开发环境
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env run --rm migration

# 生产环境
docker compose -f compose/docker-compose.prod.yml --env-file compose/prod.compose.env run --rm migration
```

## 健康检查与监控

### 内置健康检查
- **后端**: `GET /v1/health` - 返回应用、数据库、Redis 状态
- **PostgreSQL**: Docker 健康检查使用 `pg_isready`
- **Redis**: Docker 健康检查使用 `redis-cli ping`

### 部署后验证
部署脚本自动验证：
1. 后端健康端点返回 `200 OK`
2. Swagger UI 可访问
3. 前端首页可访问

### 手动验证
```bash
# 检查后端健康
curl http://localhost:3001/v1/health | jq .

# 检查服务状态
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env ps
```

## 故障排除

### 常见问题

#### 1. 环境变量文件缺失
```
Missing booking-deploy/compose/dev.compose.env
Create it from booking-deploy/compose/dev.compose.env.example
```
**解决**: 复制模板文件并填写实际值。

#### 2. 迁移失败
```
Error: P3009: migrate found failed migrations in the target database
```
**解决**:
- 检查数据库连接字符串
- 手动修复迁移：`docker compose exec postgres psql -U postgres -d booking_system`
- 查看迁移日志

#### 3. 健康检查失败
部署脚本在 80 秒后超时。
**解决**:
- 检查服务日志：`docker compose logs backend`
- 验证数据库连接：`docker compose exec backend npm run prisma:deploy`
- 检查端口冲突

#### 4. 镜像拉取失败
```
Error response from daemon: pull access denied for cho-geer/booking-backend
```
**解决**:
- 确认 Docker Hub 仓库存在且公开
- 或更新 `compose/dev.compose.env` 使用本地构建的镜像

### 日志查看
```bash
# 查看所有服务日志
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs

# 查看特定服务日志
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs backend

# 实时跟踪日志
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs -f
```

## 升级与回滚

### 版本升级
1. **更新镜像标签**在 `compose/dev.compose.env` 或 `compose/prod.compose.env`
2. **执行部署脚本**
3. **验证新版本**功能正常

### 回滚操作
1. **恢复旧镜像标签**在环境变量文件
2. **执行部署脚本**
3. **数据库前向兼容**：确保旧版本应用能工作在当前数据库模式

### 零停机部署（未来扩展）
当前部署策略为滚动重启，未来可扩展为：
- 蓝绿部署
- 金丝雀发布
- 使用 Docker Swarm 或 Kubernetes

## 安全注意事项

### 1. 敏感信息管理
- **切勿提交** `.env` 文件到版本控制
- 使用密钥管理服务（如 AWS Secrets Manager）存储生产密钥
- 定期轮换 JWT 密钥和数据库密码

### 2. 网络安全
- 生产环境使用专用网络
- 限制数据库和 Redis 的外部访问
- 启用防火墙规则

### 3. 镜像安全
- 定期扫描镜像漏洞
- 使用最小化基础镜像
- 及时更新依赖

## 自动化 CI/CD（未来）

当前部署为手动触发，未来可集成到 CI/CD 流水线：

### GitHub Actions 工作流
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

### 审批流程
生产部署应包含：
1. 代码审查
2. 自动化测试通过
3. 人工审批
4. 部署后验证

---

## 附录

### A. 手动部署命令参考
```bash
# 拉取镜像
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env pull

# 执行迁移
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env run --rm migration

# 启动服务
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env up -d

# 停止服务
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env down

# 查看状态
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env ps
```

### B. 环境变量说明
见各 `.env.example` 文件注释。

### C. 相关文档
- [Docker Hub 镜像构建配置](../booking-backend/docs/docker-hub-setup.md)
- [后端 API 文档](../booking-backend/docs/api-contract.md)
- [前端开发指南](../booking-frontend/README.md)

---

*最后更新: 2026-04-07*  
*维护者: DevOps 团队*