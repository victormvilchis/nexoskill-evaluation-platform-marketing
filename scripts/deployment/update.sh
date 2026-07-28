#!/usr/bin/env sh
set -eu
. "$(dirname "$0")/lib.sh"

mkdir -p "$STATE_DIR"
if [ -f "$STATE_DIR/current.env" ]; then
  cp "$STATE_DIR/current.env" "$STATE_DIR/previous.env"
fi

"$SCRIPT_DIR/deploy.sh"
log "Actualización completada. La versión anterior quedó registrada en $STATE_DIR/previous.env"
