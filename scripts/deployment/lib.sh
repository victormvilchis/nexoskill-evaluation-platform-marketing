#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
ENV_FILE=${ENV_FILE:-$PROJECT_ROOT/.env.production}
COMPOSE_FILE=${COMPOSE_FILE:-$PROJECT_ROOT/docker-compose.production.yml}
STATE_DIR=${STATE_DIR:-$PROJECT_ROOT/.deploy}

log() {
  printf '[valtieris] %s\n' "$*"
}

fail() {
  printf '[valtieris] ERROR: %s\n' "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "No se encontró el comando requerido: $1"
}

require_file() {
  [ -f "$1" ] || fail "No existe el archivo requerido: $1"
}

load_environment() {
  require_file "$ENV_FILE"
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
}

compose() {
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
}

wait_for_url() {
  url=$1
  attempts=${2:-30}
  delay=${3:-2}
  count=1
  while [ "$count" -le "$attempts" ]; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$delay"
    count=$((count + 1))
  done
  return 1
}

save_current_release() {
  mkdir -p "$STATE_DIR"
  cat > "$STATE_DIR/current.env" <<STATE
MARKETING_IMAGE_TAG=${MARKETING_IMAGE_TAG:-unknown}
MARKETING_API_IMAGE=${MARKETING_API_IMAGE:-valtieris/marketing-api}
MARKETING_WEB_IMAGE=${MARKETING_WEB_IMAGE:-valtieris/marketing-web}
APP_COMMIT=${APP_COMMIT:-unknown}
APP_BUILD_TIME=${APP_BUILD_TIME:-unknown}
STATE
}
