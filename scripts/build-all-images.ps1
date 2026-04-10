# 完整的 Docker 镜像构建和推送脚本
# 用于 booking-system 项目

$DOCKER_HUB_USER = "zhaogeyinzuo"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Booking System - 完整镜像构建流程" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. 检查 Docker 是否运行
Write-Host "`n[1/7] 检查 Docker 状态..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker 正在运行" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker 未运行，请先启动 Docker Desktop" -ForegroundColor Red
    exit 1
}

# 2. 检查 Docker Hub 登录状态
Write-Host "`n[2/7] 检查 Docker Hub 登录状态..." -ForegroundColor Yellow
$loginInfo = docker info 2>&1 | Select-String "Username"
if ($loginInfo) {
    Write-Host "✓ 已登录 Docker Hub" -ForegroundColor Green
} else {
    Write-Host "⚠ 未检测到登录信息，请执行: docker login" -ForegroundColor Yellow
    $login = Read-Host "是否现在登录? (Y/N)"
    if ($login -eq "Y" -or $login -eq "y") {
        docker login
    } else {
        Write-Host "跳过登录，稍后请手动执行" -ForegroundColor Gray
    }
}

# 3. 构建后端镜像
Write-Host "`n[3/7] 构建后端主镜像..." -ForegroundColor Yellow
Set-Location "../../booking-backend"
docker build -t booking-backend:latest -f Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 后端镜像构建失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 后端镜像构建成功" -ForegroundColor Green

# 4. 构建数据库迁移镜像
Write-Host "`n[4/7] 构建数据库迁移镜像..." -ForegroundColor Yellow
docker build -t booking-migrate:latest -f Dockerfile.migrate .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 迁移镜像构建失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 迁移镜像构建成功" -ForegroundColor Green

# 5. 构建前端镜像
Write-Host "`n[5/7] 构建前端镜像..." -ForegroundColor Yellow
Set-Location "../../booking-frontend"
docker build -t booking-frontend:latest -f Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 前端镜像构建失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 前端镜像构建成功" -ForegroundColor Green

# 6. 打 Docker Hub 标签
Write-Host "`n[6/7] 打 Docker Hub 标签..." -ForegroundColor Yellow
Set-Location "../../booking-deploy/scripts"
docker tag booking-backend:latest ${DOCKER_HUB_USER}/booking-system-backend:latest
docker tag booking-migrate:latest ${DOCKER_HUB_USER}/booking-system-migrate:latest
docker tag booking-frontend:latest ${DOCKER_HUB_USER}/booking-system-frontend:latest
Write-Host "✓ 标签创建成功" -ForegroundColor Green

# 7. 推送镜像到 Docker Hub
Write-Host "`n[7/7] 推送镜像到 Docker Hub..." -ForegroundColor Yellow
$push = Read-Host "是否现在推送镜像到 Docker Hub? (Y/N)"
if ($push -eq "Y" -or $push -eq "y") {
    Write-Host "推送后端镜像..." -ForegroundColor Cyan
    docker push ${DOCKER_HUB_USER}/booking-system-backend:latest
    
    Write-Host "推送迁移镜像..." -ForegroundColor Cyan
    docker push ${DOCKER_HUB_USER}/booking-system-migrate:latest
    
    Write-Host "推送前端镜像..." -ForegroundColor Cyan
    docker push ${DOCKER_HUB_USER}/booking-system-frontend:latest
    
    Write-Host "✓ 所有镜像推送成功!" -ForegroundColor Green
} else {
    Write-Host "跳过推送，您可以稍后手动执行:" -ForegroundColor Gray
    Write-Host "  docker push ${DOCKER_HUB_USER}/booking-system-backend:latest" -ForegroundColor Gray
    Write-Host "  docker push ${DOCKER_HUB_USER}/booking-system-migrate:latest" -ForegroundColor Gray
    Write-Host "  docker push ${DOCKER_HUB_USER}/booking-system-frontend:latest" -ForegroundColor Gray
}

# 显示构建的镜像
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  构建完成的镜像列表" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
docker images --filter "reference=booking-*" --filter "reference=${DOCKER_HUB_USER}/booking-system-*" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

Write-Host "`n✓ 所有任务完成!" -ForegroundColor Green
