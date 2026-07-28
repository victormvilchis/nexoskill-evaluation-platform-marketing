#!/usr/bin/env sh
set -eu
. "$(dirname "$0")/lib.sh"

require_file "$ENV_FILE"
load_environment
compose ps
printf '\n'
health_url="http://${MARKETING_BIND_ADDRESS:-127.0.0.1}:${MARKETING_HTTP_PORT:-8080}/health"
if curl -fsS "$health_url"; then
  printf '\nSitio saludable: %s\n' "$health_url"
else
  printf '\nSitio no disponible: %s\n' "$health_url" >&2
  exit 1
fi
