#!/usr/bin/env sh
set -eu
. "$(dirname "$0")/lib.sh"

"$SCRIPT_DIR/preflight.sh"
load_environment

export APP_BUILD_TIME=${APP_BUILD_TIME:-$(date -u +%Y-%m-%dT%H:%M:%SZ)}
if [ "${APP_COMMIT:-unknown}" = "unknown" ] && command -v git >/dev/null 2>&1; then
  APP_COMMIT=$(git -C "$PROJECT_ROOT" rev-parse HEAD 2>/dev/null || printf unknown)
  export APP_COMMIT
fi

log "Construyendo imágenes ${MARKETING_IMAGE_TAG}."
compose build --pull
log "Iniciando servicios."
compose up -d --remove-orphans

health_url="http://${MARKETING_BIND_ADDRESS:-127.0.0.1}:${MARKETING_HTTP_PORT:-8080}/health"
if ! wait_for_url "$health_url" 45 2; then
  compose ps
  compose logs --tail=120 marketing-api marketing-web
  fail "El despliegue no alcanzó estado saludable."
fi

save_current_release
compose ps
log "Despliegue saludable en $health_url"
