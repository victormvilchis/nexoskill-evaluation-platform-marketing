#!/usr/bin/env sh
set -eu
. "$(dirname "$0")/lib.sh"

require_command impdp
require_file "$ENV_FILE"
load_environment

[ -n "${ORACLE_DATAPUMP_CONNECT:-}" ] || fail "Configura ORACLE_DATAPUMP_CONNECT, preferentemente con Oracle Wallet."
[ -n "${ORACLE_DIRECTORY:-}" ] || fail "Configura ORACLE_DIRECTORY."
[ "$#" -eq 1 ] || fail "Uso: restore-oracle.sh nombre-del-dump.dmp"

dump_file=$1
action=${ORACLE_RESTORE_TABLE_ACTION:-SKIP}
case "$action" in
  SKIP|APPEND|TRUNCATE|REPLACE) ;;
  *) fail "ORACLE_RESTORE_TABLE_ACTION debe ser SKIP, APPEND, TRUNCATE o REPLACE." ;;
esac

printf 'Se restaurarán objetos MKT_* desde %s con TABLE_EXISTS_ACTION=%s. Escribe RESTAURAR para continuar: ' "$dump_file" "$action"
read confirmation
[ "$confirmation" = "RESTAURAR" ] || fail "Restauración cancelada."

timestamp=$(date -u +%Y%m%dT%H%M%SZ)
log_file="nexoskill_marketing_restore_${timestamp}.log"
impdp "$ORACLE_DATAPUMP_CONNECT" \
  DIRECTORY="$ORACLE_DIRECTORY" \
  DUMPFILE="$dump_file" \
  LOGFILE="$log_file" \
  SCHEMAS="$DB_USERNAME" \
  INCLUDE=TABLE:"LIKE 'MKT_%'" \
  INCLUDE=SEQUENCE:"LIKE 'MKT_%'" \
  TABLE_EXISTS_ACTION="$action"

log "Restauración finalizada. Revisa ${log_file} y valida MKT_FLYWAY_HISTORY antes de iniciar la API."
