#!/usr/bin/env bash
# 完整的 Docker 镜像构建和推送脚本 (Bash 版本)
# 用于 booking-system 项目

set -euo pipefail

DOCKER_HUB_USER="zhaogeyinzuo"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "========================================"
echo "  Booking System - 完整镜像构建流程"
echo "========================================"

# 1. 检查 Docker 是否运行
echo ""
echo "[1/7] 检查 Docker 状态..."
if docker ps >/dev/null 2>&1; then
    echo "✓ Docker 正在运行"
else
    echo "✗ Docker 未运行，请先启动 Docker Desktop"
    exit 1
fi

# 2. 检查 Docker Hub 登录状态
echo ""
echo "[2/7] 检查 Docker Hub 登录状态..."
if docker info 2>&1 | grep -q "Username"; then
    echo "✓ 已登录 Docker Hub"
else
    echo "⚠ 未检测到登录信息，请执行: docker login"
    read -p "是否现在登录? (Y/N): " login
    if [[ "$login" == "Y" || "$login" == "y" ]]; then
        docker login
    else
        echo "跳过登录，稍后请手动执行"
    fi
fi

# 3. 构建后端镜像
echo ""
echo "[3/7] 构建后端主镜像..."
cd "${DEPLOY_DIR}/../booking-backend"
docker build -t booking-backend:latest -f Dockerfile .
echo "✓ 后端镜像构建成功"

# 4. 构建数据库迁移镜像
echo ""
echo "[4/7] 构建数据库迁移镜像..."
docker build -t booking-migrate:latest -f Dockerfile.migrate .
echo "✓ 迁移镜像构建成功"

# 5. 构建前端镜像
echo ""
echo "[5/7] 构建前端镜像..."
cd "${DEPLOY_DIR}/../booking-frontend"
docker build -t booking-frontend:latest -f Dockerfile .
echo "✓ 前端镜像构建成功"

# 6. 打 Docker Hub 标签
echo ""
echo "[6/7] 打 Docker Hub 标签..."
cd "${DEPLOY_DIR}"
docker tag booking-backend:latest ${DOCKER_HUB_USER}/booking-system-backend:latest
docker tag booking-migrate:latest ${DOCKER_HUB_USER}/booking-system-migrate:latest
docker tag booking-frontend:latest ${DOCKER_HUB_USER}/booking-system-frontend:latest
echo "✓ 标签创建成功"

# 7. 推送镜像到 Docker Hub
echo ""
echo "[7/7] 推送镜像到 Docker Hub..."
read -p "是否现在推送镜像到 Docker Hub? (Y/N): " push
if [[ "$push" == "Y" || "$push" == "y" ]]; then
    echo "推送后端镜像..."
    docker push ${DOCKER_HUB_USER}/booking-system-backend:latest
    
    echo "推送迁移镜像..."
    docker push ${DOCKER_HUB_USER}/booking-system-migrate:latest
    
    echo "推送前端镜像..."
    docker push ${DOCKER_HUB_USER}/booking-system-frontend:latest
    
    echo "✓ 所有镜像推送成功!"
else
    echo "跳过推送，您可以稍后手动执行:"
    echo "  docker push ${DOCKER_HUB_USER}/booking-system-backend:latest"
    echo "  docker push ${DOCKER_HUB_USER}/booking-system-migrate:latest"
    echo "  docker push ${DOCKER_HUB_USER}/booking-system-frontend:latest"
fi

# 显示构建的镜像
echo ""
echo "========================================"
echo "  构建完成的镜像列表"
echo "========================================"
docker images --filter "reference=booking-*" --filter "reference=${DOCKER_HUB_USER}/booking-system-*" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

echo ""
echo "✓ 所有任务完成!"
