#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/booking-deploy/compose/docker-compose.dev.yml"
COMPOSE_ENV_FILE="${ROOT_DIR}/booking-deploy/compose/dev.compose.env"

if [[ ! -f "${COMPOSE_ENV_FILE}" ]]; then
  echo "Missing ${COMPOSE_ENV_FILE}"
  echo "Create it from ${ROOT_DIR}/booking-deploy/compose/dev.compose.env.example"
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD=(docker-compose)
else
  echo "Docker Compose not found. Install docker compose plugin or docker-compose."
  exit 1
fi

"${COMPOSE_CMD[@]}" -f "${COMPOSE_FILE}" --env-file "${COMPOSE_ENV_FILE}" pull
"${COMPOSE_CMD[@]}" -f "${COMPOSE_FILE}" --env-file "${COMPOSE_ENV_FILE}" run --rm migration
"${COMPOSE_CMD[@]}" -f "${COMPOSE_FILE}" --env-file "${COMPOSE_ENV_FILE}" up -d --remove-orphans

BACKEND_HEALTH_URL="http://localhost:3001/v1/health"
BACKEND_SWAGGER_URL="http://localhost:3001/api/docs"
FRONTEND_URL="http://localhost:3000"

http_status() {
  local url="$1"
  if command -v curl >/dev/null 2>&1; then
    curl -sS -o /dev/null -w "%{http_code}" "${url}" 2>/dev/null || echo "000"
    return 0
  fi

  python3 - "${url}" <<'PY'
import sys
import urllib.request
import urllib.error

url = sys.argv[1]
try:
  with urllib.request.urlopen(url, timeout=2) as r:
    print(r.getcode() or 0)
except urllib.error.HTTPError as e:
  print(e.code or 0)
except Exception:
  print(0)
PY
}

http_ok() {
  local code
  code="$(http_status "$1")"
  [[ "${code}" -ge 200 && "${code}" -lt 400 ]]
}

for i in {1..40}; do
  if command -v curl >/dev/null 2>&1; then
    if curl -fsS "${BACKEND_HEALTH_URL}" >/dev/null 2>&1; then
      break
    fi
  else
    if python3 -c "import urllib.request; urllib.request.urlopen('${BACKEND_HEALTH_URL}', timeout=2).read()" >/dev/null 2>&1; then
      break
    fi
  fi

  sleep 2
  if [[ "${i}" -eq 40 ]]; then
    echo "Backend health check failed: ${BACKEND_HEALTH_URL}"
    "${COMPOSE_CMD[@]}" -f "${COMPOSE_FILE}" --env-file "${COMPOSE_ENV_FILE}" ps
    exit 1
  fi
done

for i in {1..40}; do
  if http_ok "${BACKEND_SWAGGER_URL}"; then
    break
  fi

  sleep 2
  if [[ "${i}" -eq 40 ]]; then
    echo "Backend Swagger check failed: ${BACKEND_SWAGGER_URL}"
    "${COMPOSE_CMD[@]}" -f "${COMPOSE_FILE}" --env-file "${COMPOSE_ENV_FILE}" ps
    exit 1
  fi
done

for i in {1..40}; do
  if http_ok "${FRONTEND_URL}"; then
    break
  fi

  sleep 2
  if [[ "${i}" -eq 40 ]]; then
    echo "Frontend check failed: ${FRONTEND_URL}"
    "${COMPOSE_CMD[@]}" -f "${COMPOSE_FILE}" --env-file "${COMPOSE_ENV_FILE}" ps
    exit 1
  fi
done

echo "Backend health: ${BACKEND_HEALTH_URL}"
echo "Backend Swagger: ${BACKEND_SWAGGER_URL}"
echo "Frontend: ${FRONTEND_URL}"
