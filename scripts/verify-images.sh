#!/usr/bin/env bash
# 验证 Docker 镜像的部署就绪性脚本
# 使用与真实部署相同的 Docker Compose 拓扑和环境变量
# 用法: ./verify-images.sh [environment]
# environment: dev (默认) 或 prod

set -euo pipefail

ENV="${1:-dev}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_DIR="${DEPLOY_DIR}/compose"
ENV_DIR="${DEPLOY_DIR}/env"

echo "🔍 验证 $ENV 环境镜像部署就绪性..."
echo "部署目录: ${DEPLOY_DIR}"
echo "Compose 目录: ${COMPOSE_DIR}"

# 确定 Compose 文件和环境文件
if [ "$ENV" = "prod" ]; then
    COMPOSE_FILE="${COMPOSE_DIR}/docker-compose.prod.yml"
    ENV_FILE="${COMPOSE_DIR}/prod.compose.env"
    ENV_BACKEND_FILE="${ENV_DIR}/prod/backend.env"
    ENV_FRONTEND_FILE="${ENV_DIR}/prod/frontend.env"
else
    COMPOSE_FILE="${COMPOSE_DIR}/docker-compose.dev.yml"
    ENV_FILE="${COMPOSE_DIR}/dev.compose.env"
    ENV_BACKEND_FILE="${ENV_DIR}/dev/backend.env"
    ENV_FRONTEND_FILE="${ENV_DIR}/dev/frontend.env"
fi

# 检查必需文件
for file in "${COMPOSE_FILE}" "${ENV_FILE}"; do
    if [ ! -f "${file}" ]; then
        echo "❌ 错误: 找不到文件 ${file}"
        echo "请从示例文件创建: ${file}.example"
        exit 1
    fi
done

# 加载环境变量用于显示
echo "📋 部署配置:"
echo "  Compose 文件: $(basename "${COMPOSE_FILE}")"
echo "  环境文件: $(basename "${ENV_FILE}")"
source "${ENV_FILE}" 2>/dev/null || true
echo "  后端镜像: ${BACKEND_IMAGE:-未设置}"
echo "  迁移镜像: ${BACKEND_MIGRATION_IMAGE:-未设置}"
echo "  前端镜像: ${FRONTEND_IMAGE:-未设置}"

# 拉取最新镜像
echo "⬇️  拉取镜像..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" pull || {
    echo "❌ 错误: 拉取镜像失败"
    exit 1
}

# 停止任何可能正在运行的测试容器
echo "🧹 清理之前的测试容器..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" down -v --remove-orphans 2>/dev/null || true

# 启动依赖服务 (PostgreSQL, Redis)
echo "🚀 启动依赖服务..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d postgres redis

# 等待依赖服务健康
echo "⏳ 等待 PostgreSQL 健康..."
for i in {1..30}; do
    if docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" exec -T postgres pg_isready -U postgres -d booking_system >/dev/null 2>&1; then
        echo "  ✅ PostgreSQL 就绪"
        break
    fi
    echo "  等待 PostgreSQL... ($i/30)"
    sleep 2
done

echo "⏳ 等待 Redis 健康..."
for i in {1..30}; do
    if docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" exec -T redis redis-cli ping >/dev/null 2>&1; then
        echo "  ✅ Redis 就绪"
        break
    fi
    echo "  等待 Redis... ($i/30)"
    sleep 2
done

# 运行迁移
echo "🔄 运行数据库迁移..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" run --rm migration || {
    echo "❌ 错误: 迁移失败"
    docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" logs migration
    docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" down -v
    exit 1
}

# 启动后端和前端服务
echo "🚀 启动应用服务..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d backend frontend

# 等待后端健康检查
echo "⏳ 等待后端健康检查..."
BACKEND_HEALTH_URL="http://localhost:3001/v1/health"
for i in {1..40}; do
    if curl -sSf "${BACKEND_HEALTH_URL}" >/dev/null 2>&1; then
        echo "  ✅ 后端健康检查通过"
        break
    fi
    echo "  等待后端... ($i/40)"
    sleep 3
done

# 验证后端健康响应
echo "📊 验证后端健康状态..."
HEALTH_RESPONSE=$(curl -sS "${BACKEND_HEALTH_URL}" || echo "{}")
if command -v jq >/dev/null 2>&1; then
    echo "健康响应:"
    echo "${HEALTH_RESPONSE}" | jq .
else
    echo "健康响应: ${HEALTH_RESPONSE}"
fi

# 检查数据库和 Redis 状态
if echo "${HEALTH_RESPONSE}" | grep -q '"database":"connected"' && echo "${HEALTH_RESPONSE}" | grep -q '"redis":"connected"'; then
    echo "  ✅ 数据库和 Redis 连接正常"
else
    echo "  ⚠️  数据库或 Redis 连接可能有问题"
fi

# 验证前端可访问性
echo "🌐 验证前端可访问性..."
FRONTEND_URL="http://localhost:3000"
for i in {1..30}; do
    if curl -sSf "${FRONTEND_URL}" >/dev/null 2>&1; then
        echo "  ✅ 前端可访问"
        break
    fi
    echo "  等待前端... ($i/30)"
    sleep 2
done

# 验证 Swagger 文档
echo "📚 验证 Swagger 文档..."
SWAGGER_URL="http://localhost:3001/api/docs"
if curl -sSf "${SWAGGER_URL}" >/dev/null 2>&1; then
    echo "  ✅ Swagger 文档可访问"
else
    echo "  ⚠️  Swagger 文档不可访问"
fi

# 显示服务状态
echo "📈 服务状态:"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" ps

# 停止所有服务但保留数据卷
echo "🛑 停止测试服务..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" down

echo ""
echo "✅ 所有镜像验证通过! 系统已准备好部署到 $ENV 环境。"
echo ""
echo "下一步:"
echo "1. 检查环境文件: ${ENV_FILE}"
echo "2. 运行完整部署: docker compose -f ${COMPOSE_FILE} --env-file ${ENV_FILE} up -d"
echo "3. 监控日志: docker compose -f ${COMPOSE_FILE} --env-file ${ENV_FILE} logs -f"
echo ""
echo "注意: 此验证使用了真实的部署拓扑和依赖关系。"