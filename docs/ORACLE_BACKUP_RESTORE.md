# Respaldo y restauración Oracle

Marketing comparte el esquema aplicativo con la plataforma, pero sus objetos se identifican mediante el prefijo `MKT_`.

## Objetos mínimos

- `MKT_PROSPECT`
- `MKT_PROSPECT_SEQ`
- `MKT_FLYWAY_HISTORY`

## Data Pump

Los scripts utilizan `expdp` e `impdp`. El dump se crea en el filesystem del servidor Oracle asociado a `ORACLE_DIRECTORY`; no necesariamente en el servidor de marketing.

Se recomienda configurar `ORACLE_DATAPUMP_CONNECT` mediante Oracle Wallet para evitar contraseñas en la línea de comandos.

```env
ORACLE_DIRECTORY=DATA_PUMP_DIR
ORACLE_DATAPUMP_CONNECT=/@NEXOSKILL_BACKUP
ORACLE_BACKUP_DIR=./backups/oracle
ORACLE_RESTORE_TABLE_ACTION=SKIP
```

## Respaldo

```bash
./scripts/deployment/backup-oracle.sh
```

El script solicita un export de tablas y secuencias `MKT_%` y guarda localmente el parfile utilizado.

## Restauración

```bash
./scripts/deployment/restore-oracle.sh nexoskill_marketing_YYYYMMDDTHHMMSSZ.dmp
```

La restauración exige escribir `RESTAURAR`. Antes de usar `REPLACE` o `TRUNCATE`, confirma que no se perderán prospectos recientes.

## Validación posterior

```sql
SELECT object_name, object_type, status
FROM user_objects
WHERE object_name LIKE 'MKT_%'
ORDER BY object_name;

SELECT installed_rank, version, description, success
FROM MKT_FLYWAY_HISTORY
ORDER BY installed_rank;

SELECT COUNT(*) AS prospectos
FROM MKT_PROSPECT;
```
