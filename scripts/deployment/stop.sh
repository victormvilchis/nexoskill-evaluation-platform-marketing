#!/usr/bin/env sh
set -eu
. "$(dirname "$0")/lib.sh"
require_file "$ENV_FILE"
load_environment
compose down --remove-orphans
log "Servicios detenidos. Los volúmenes y la base Oracle no fueron eliminados."
