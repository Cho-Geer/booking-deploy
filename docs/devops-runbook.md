# Booking 系统 DevOps Runbook

本文档提供 Booking 系统的运维保障手册，包含运行手册、回滚策略、故障处理指南和日志规范。

## 1. 系统架构概述

### 1.1 服务组件

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  PostgreSQL │
│  (Next.js)  │◀────│  (NestJS)   │◀────│   (v16)     │
└─────────────┘     └─────────────┘     └─────────────┘
        │                   │                   │
        │                   ▼                   │
        │             ┌─────────────┐           │
        └────────────▶│    Redis    │◀──────────┘
                      │ (7-alpine)  │
                      └─────────────┘
```

### 1.2 关键配置文件位置

| 组件             | 配置文件路径                  | 说明            |
| -------------- | ----------------------- | ------------- |
| 后端应用           | `booking-backend/`       | NestJS 应用源代码  |
| 前端应用           | `booking-frontend/`      | Next.js 应用源代码 |
| Docker Compose | `booking-deploy/compose/` | 开发/生产环境编排     |
| 环境变量           | `booking-deploy/env/`    | 各环境配置         |
| 部署脚本           | `booking-deploy/scripts/` | 自动化部署脚本       |

### 1.3 端口与端点

| 服务         | 端口   | 健康检查端点                  | 管理端点                      |
| ---------- | ---- | ----------------------- | ------------------------- |
| 前端         | 3000 | `http://localhost:3000` | -                         |
| 后端         | 3001 | `GET /v1/health`        | `GET /api/docs` (Swagger) |
| PostgreSQL | 5432 | `pg_isready`            | -                         |
| Redis      | 6379 | `redis-cli ping`        | -                         |

## 2. 日常运维操作

### 2.1 服务状态检查

```bash
# 检查所有服务状态
cd deploy
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env ps

# 检查后端健康
curl http://localhost:3001/v1/health | jq .

# 检查数据库连接
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec postgres pg_isready -U postgres

# 检查 Redis 连接
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec redis redis-cli ping
```

### 2.2 日志查看

```bash
# 查看所有服务日志
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs

# 查看后端应用日志
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs backend

# 查看特定时间范围的日志
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs --since 10m

# 实时跟踪日志
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs -f backend
```

### 2.3 服务重启

```bash
# 重启单个服务（如后端）
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env restart backend

# 重启所有服务
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env restart

# 完全重建并重启
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env up -d --build
```

### 2.4 数据库维护

```bash
# 进入 PostgreSQL 容器
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec postgres psql -U postgres -d booking_system

# 备份数据库
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec postgres pg_dump -U postgres booking_system > backup_$(date +%Y%m%d).sql

# 查看数据库大小
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec postgres psql -U postgres -d booking_system -c "SELECT pg_size_pretty(pg_database_size('booking_system'));"
```

## 3. 回滚策略

### 3.1 基于镜像标签的回滚

Booking 系统使用 Docker 镜像标签进行版本管理，支持快速回滚。

#### 回滚步骤：

1. **识别当前版本**

   ```bash
   # 查看当前运行的镜像版本
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env images backend
   ```

2. **查看可用版本**

   ```bash
   # 查看 Docker Hub 上的可用标签
   docker pull cho-geer/booking-backend --list-tags 2>/dev/null || echo "使用 Docker Hub 网站查看标签"
   ```

3. **更新环境变量文件**

   ```bash
   # 编辑环境变量文件，将镜像标签改为旧版本
   # deploy/compose/dev.compose.env
   BACKEND_IMAGE=docker.io/cho-geer/booking-backend:previous-tag
   FRONTEND_IMAGE=docker.io/cho-geer/booking-frontend:previous-tag
   ```

4. **执行回滚部署**

   ```bash
   cd deploy
   ./scripts/deploy-dev.sh  # 或 deploy-prod.sh
   ```

5. **验证回滚**

   ```bash
   curl http://localhost:3001/v1/health
   # 验证关键功能
   ```

#### 回滚时间要求：

* **开发环境**: 5分钟内完成

* **生产环境**: 15分钟内完成（含验证）

### 3.2 数据库迁移回滚注意事项

#### 前向兼容性原则

* 数据库迁移应保持前向兼容性至少 2 个版本

* 禁止删除已使用的列或表（可标记为弃用）

* 新增列应设置合理的默认值或允许 NULL

#### 迁移失败处理

如果迁移失败导致回滚：

1. **停止迁移容器**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env rm -f migration
   ```

2. **手动回滚数据库（如必要）**

   ```bash
   # 连接到数据库并执行回滚 SQL
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec postgres psql -U postgres -d booking_system -c "DROP TABLE IF EXISTS new_problematic_table;"
   ```

3. **恢复旧版本镜像并重启**

### 3.3 回滚决策树

```
迁移失败？ ——→ 是 ——→ 停止迁移容器
    ↓否                   ↓
应用启动失败？ ——→ 是 ——→ 检查日志，决定是否回滚
    ↓否                   ↓
健康检查失败？ ——→ 是 ——→ 等待重试（2次）→ 仍失败 → 回滚
    ↓否                   ↓
功能测试失败？ ——→ 是 ——→ 评估影响 → 关键功能 → 回滚
    ↓否                           ↓非关键 → 记录问题
正常运行                        保持监控
```

## 4. 故障手册

### 4.1 数据库连接失败

#### 症状

* 后端日志: `PrismaClientInitializationError` 或 `Connection refused`

* 健康检查: `"database": "down"`

* 应用: 返回 500 错误，涉及数据库的操作失败

#### 诊断步骤

1. **检查 PostgreSQL 容器状态**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env ps postgres
   ```

2. **检查 PostgreSQL 日志**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs postgres
   ```

3. **测试直接连接**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec postgres pg_isready -U postgres
   ```

4. **检查网络连接**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec backend nc -zv postgres 5432
   ```

#### 解决方案

1. **重启 PostgreSQL 服务**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env restart postgres
   ```

2. **检查磁盘空间**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec postgres df -h /var/lib/postgresql/data
   ```

3. **检查内存使用**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec postgres free -m
   ```

4. **恢复备份（如数据损坏）**

   ```bash
   # 停止应用
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env stop backend frontend

   # 恢复备份
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec -T postgres psql -U postgres -d booking_system < backup_file.sql
   ```

### 4.2 Redis 连接失败

#### 症状

* 后端日志: `Redis connection error` 或 `ECONNREFUSED`

* 健康检查: `"redis": "down"`

* 应用: 会话丢失，缓存失效

#### 诊断步骤

1. **检查 Redis 容器状态**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env ps redis
   ```

2. **测试 Redis 连接**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec redis redis-cli ping
   ```

3. **检查内存使用**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec redis redis-cli info memory
   ```

#### 解决方案

1. **重启 Redis 服务**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env restart redis
   ```

2. **清除 Redis 缓存（如内存满）**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec redis redis-cli FLUSHALL
   ```

3. **调整内存策略**

   ```bash
   # 编辑 Redis 配置
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec redis redis-cli CONFIG SET maxmemory 256mb
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
   ```

### 4.3 健康检查持续失败

#### 症状

* 健康端点返回非 200 状态码

* 部署脚本超时

* 负载均衡器标记服务不健康

#### 诊断步骤

1. **检查应用日志**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs backend
   ```

2. **手动调用健康端点**

   ```bash
   curl -v http://localhost:3001/v1/health
   ```

3. **检查依赖服务**

   ```bash
   # 分别检查数据库和 Redis
   curl http://localhost:3001/v1/health | jq '.checks'
   ```

4. **进入容器调试**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec backend sh
   # 在容器内测试连接
   node -e "require('pg').Client('postgresql://postgres:5382@postgres:5432/booking_system').connect().then(()=>console.log('DB OK')).catch(e=>console.error(e))"
   ```

#### 解决方案

1. **增加健康检查超时（临时）**

   ```bash
   # 编辑 docker-compose.dev.yml，增加健康检查超时时间
   healthcheck:
     timeout: 10s  # 从 5s 增加到 10s
     interval: 30s # 从 15s 增加到 30s
   ```

2. **修复根本原因**

   * 数据库连接问题：见 4.1

   * Redis 连接问题：见 4.2

   * 应用代码问题：检查最新变更

3. **重启应用**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env restart backend
   ```

### 4.4 前端白屏/无法访问

#### 症状

* 浏览器显示白屏或连接错误

* 控制台有 JavaScript 错误

* 后端正常但前端无响应

#### 诊断步骤

1. **检查前端容器状态**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env ps frontend
   ```

2. **查看前端日志**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs frontend
   ```

3. **检查网络连通性**

   ```bash
   # 从前端容器访问后端
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec frontend curl -s http://backend:3001/v1/health
   ```

4. **检查浏览器控制台**

   * 打开浏览器开发者工具

   * 查看 Console 和 Network 标签页

#### 解决方案

1. **重启前端服务**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env restart frontend
   ```

2. **清除浏览器缓存**

   * 浏览器中按 Ctrl+Shift+R (硬刷新)

   * 或清除站点数据

3. **检查环境变量**

   ```bash
   # 检查前端环境变量
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec frontend printenv | grep NEXT_PUBLIC
   ```

4. **重建前端镜像**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env up -d --build frontend
   ```

### 4.5 迁移失败处理

#### 症状

* 迁移容器退出码非 0

* 部署脚本在迁移步骤失败

* 数据库模式不一致

#### 诊断步骤

1. **查看迁移日志**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs migration
   ```

2. **检查数据库迁移状态**

   ```bash
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec backend npx prisma migrate status
   ```

3. **检查 Prisma 模式**

   ```bash
   # 比较当前模式与迁移文件
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec backend npx prisma db pull
   ```

#### 解决方案

1. **修复迁移冲突**

   ```bash
   # 手动解决迁移冲突
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec backend npx prisma migrate resolve --applied <migration_name>
   ```

2. **创建修复迁移**

   ```bash
   # 生成修复迁移
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec backend npx prisma migrate dev --create-only --name fix_conflict

   # 手动编辑生成的迁移文件
   # 然后应用
   docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env exec backend npx prisma migrate deploy
   ```

3. **回退到上一版本（紧急）**

   ```bash
   # 恢复数据库备份
   # 然后回滚镜像版本
   ```

## 5. 结构化日志规范

### 5.1 日志级别与格式

Booking 系统使用结构化日志，便于查询和分析。

#### 日志级别

* `ERROR`: 需要立即处理的错误（如数据库连接失败）

* `WARN`: 需要注意但不需要立即处理的问题（如缓存未命中）

* `INFO`: 正常操作信息（如服务启动、请求处理）

* `DEBUG`: 调试信息（开发环境使用）

* `TRACE`: 详细跟踪信息（排查复杂问题时使用）

#### 日志格式示例

```json
{
  "timestamp": "2026-04-07T10:30:00.000Z",
  "level": "INFO",
  "service": "booking-backend",
  "message": "Server started on port 3001",
  "context": "bootstrap",
  "environment": "development",
  "traceId": "abc123def456"
}
```

### 5.2 关键日志位置

| 组件         | 日志位置                    | 查看命令                           |
| ---------- | ----------------------- | ------------------------------ |
| 后端应用       | 容器标准输出 + `logs/app.log` | `docker compose logs backend`  |
| 前端应用       | 容器标准输出                  | `docker compose logs frontend` |
| PostgreSQL | 容器标准输出                  | `docker compose logs postgres` |
| Redis      | 容器标准输出                  | `docker compose logs redis`    |

### 5.3 日志查询示例

```bash
# 查找错误日志
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs backend | grep -i error

# 查找特定时间的日志
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs --since "2026-04-07T10:00:00" --until "2026-04-07T11:00:00"

# 查找数据库连接相关日志
docker compose -f compose/docker-compose.dev.yml --env-file compose/dev.compose.env logs backend | grep -E "(database|postgres|connection)"

# 使用 jq 处理结构化日志（如日志文件）
cat logs/app.log | jq 'select(.level == "ERROR")'
```

### 5.4 日志轮转与保留

* 开发环境: 保留 7 天日志

* 生产环境: 保留 30 天日志

* 使用 Docker 日志驱动进行轮转

* 重要错误日志发送到监控系统

## 6. 监控与告警

### 6.1 关键监控指标

| 指标         | 正常范围    | 告警阈值     | 检查命令                                                                                | <br />                       |
| ---------- | ------- | -------- | ----------------------------------------------------------------------------------- | :--------------------------- |
| 后端响应时间     | < 500ms | > 2000ms | `curl -w "%{time_total}" -o /dev/null -s http://localhost:3001/v1/health`           | <br />                       |
| 数据库连接数     | < 50    | > 100    | `docker exec postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"` | <br />                       |
| Redis 内存使用 | < 80%   | > 90%    | \`docker exec redis redis-cli info memory                                           | grep used\_memory\_percent\` |
| 服务健康状态     | 所有服务健康  | 任一服务不健康  | \`curl -s <http://localhost:3001/v1/health>                                         | jq -r '.status'\`            |

### 6.2 告警策略

* **紧急告警**（P1）: 服务完全不可用，立即通知

* **重要告警**（P2）: 服务性能下降，1小时内处理

* **警告告警**（P3）: 潜在问题，24小时内处理

## 7. 容量规划

### 7.1 资源估算

| 组件         | CPU    | 内存    | 存储    | 并发用户 |
| ---------- | ------ | ----- | ----- | ---- |
| 后端         | 0.5 核  | 512MB | 1GB   | 100  |
| 前端         | 0.25 核 | 256MB | 500MB | 100  |
| PostgreSQL | 1 核    | 1GB   | 10GB  | 100  |
| Redis      | 0.25 核 | 256MB | 1GB   | 100  |

### 7.2 扩展策略

* **垂直扩展**: 增加单个容器资源

* **水平扩展**: 增加容器实例数（需配合负载均衡）

* **数据库扩展**: 读写分离，连接池优化

## 8. 灾难恢复

### 8.1 备份策略

* **数据库备份**: 每日全量备份，保留 7 天

* **配置文件备份**: 版本控制中

* **镜像备份**: Docker Hub 保留所有版本标签

### 8.2 恢复流程

1. **恢复基础设施**: 启动 Docker 环境
2. **恢复数据库**: 从最新备份恢复
3. **部署应用**: 使用稳定版本镜像
4. **验证功能**: 执行健康检查和关键功能测试

## 9. 附录

### 9.1 紧急联系人

* 开发团队: \[开发团队联系方式]

* 运维团队: \[运维团队联系方式]

* 管理层: \[管理层联系方式]

### 9.2 相关文档

* [部署指南](../deploy/README.md)

* [Docker Hub 配置](../booking-backend/docs/docker-hub-setup.md)

* [API 文档](../booking-backend/docs/api-contract.md)

### 9.3 更新记录

| 日期         | 版本  | 修改内容 | 修改人         |
| ---------- | --- | ---- | ----------- |
| 2026-04-07 | 1.0 | 初始版本 | DevOps Team |

***

*本 Runbook 应定期审查和更新，以反映系统变更和运维经验。*
