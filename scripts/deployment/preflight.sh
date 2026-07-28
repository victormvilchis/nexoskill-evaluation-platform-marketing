#!/usr/bin/env sh
set -eu
. "$(dirname "$0")/lib.sh"

require_command docker
require_command curl
require_command node
require_file "$COMPOSE_FILE"
require_file "$ENV_FILE"

load_environment
node "$PROJECT_ROOT/scripts/deployment/validate-production-env.mjs" --env "$ENV_FILE"
docker compose version >/dev/null
compose config --quiet

available_kb=$(df -Pk "$PROJECT_ROOT" | awk 'NR==2 {print $4}')
minimum_kb=2097152
if [ "${available_kb:-0}" -lt "$minimum_kb" ]; then
  fail "Se requieren al menos 2 GB libres para construir y conservar una versión anterior."
fi

log "Preflight productivo completado."
