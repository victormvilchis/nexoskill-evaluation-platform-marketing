#!/usr/bin/env sh
set -eu
. "$(dirname "$0")/lib.sh"

require_command expdp
require_file "$ENV_FILE"
load_environment

[ -n "${ORACLE_DATAPUMP_CONNECT:-}" ] || fail "Configura ORACLE_DATAPUMP_CONNECT, preferentemente con Oracle Wallet."
[ -n "${ORACLE_DIRECTORY:-}" ] || fail "Configura ORACLE_DIRECTORY con un DIRECTORY de Oracle Data Pump."

backup_dir=${ORACLE_BACKUP_DIR:-$PROJECT_ROOT/backups/oracle}
mkdir -p "$backup_dir"
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
dump_file="nexoskill_marketing_${timestamp}.dmp"
log_file="nexoskill_marketing_${timestamp}.log"
par_file="$backup_dir/nexoskill_marketing_${timestamp}.par"

cat > "$par_file" <<PAR
DIRECTORY=${ORACLE_DIRECTORY}
DUMPFILE=${dump_file}
LOGFILE=${log_file}
SCHEMAS=${DB_USERNAME}
INCLUDE=TABLE:"LIKE 'MKT_%'"
INCLUDE=SEQUENCE:"LIKE 'MKT_%'"
COMPRESSION=ALL
REUSE_DUMPFILES=NO
PAR

chmod 600 "$par_file"
log "Iniciando Data Pump. El dump se escribirá en el DIRECTORY Oracle ${ORACLE_DIRECTORY}."
expdp "$ORACLE_DATAPUMP_CONNECT" parfile="$par_file"
printf '%s\n' "$dump_file" > "$backup_dir/latest-dump.txt"
log "Respaldo solicitado: ${dump_file}. Conserva también el log ${log_file} del servidor Oracle."
