#!/usr/bin/env sh
set -eu
. "$(dirname "$0")/lib.sh"

require_file "$STATE_DIR/previous.env"
require_file "$ENV_FILE"
load_environment

set -a
# shellcheck disable=SC1090
. "$STATE_DIR/previous.env"
set +a

log "Restaurando imágenes con tag ${MARKETING_IMAGE_TAG}."
compose up -d --no-build --remove-orphans

health_url="http://${MARKETING_BIND_ADDRESS:-127.0.0.1}:${MARKETING_HTTP_PORT:-8080}/health"
if ! wait_for_url "$health_url" 30 2; then
  compose logs --tail=120 marketing-api marketing-web
  fail "El rollback no alcanzó estado saludable."
fi

cp "$STATE_DIR/previous.env" "$STATE_DIR/current.env"
compose ps
log "Rollback completado. No se modificaron datos Oracle."
