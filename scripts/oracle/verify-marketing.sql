SET PAGESIZE 100
SET LINESIZE 220

PROMPT === Contexto de conexión ===
SELECT USER AS usuario,
       SYS_CONTEXT('USERENV', 'CURRENT_SCHEMA') AS esquema,
       SYS_CONTEXT('USERENV', 'CON_NAME') AS pdb
FROM dual;

PROMPT === Objetos de marketing ===
SELECT object_name, object_type, status
FROM user_objects
WHERE object_name LIKE 'MKT_%'
ORDER BY object_name;

PROMPT === Historial Flyway ===
SELECT installed_rank, version, description, script, installed_on, success
FROM MKT_FLYWAY_HISTORY
ORDER BY installed_rank;

PROMPT === Solicitudes por tipo y estado ===
SELECT request_type, status, COUNT(*) AS total
FROM MKT_PROSPECT
GROUP BY request_type, status
ORDER BY request_type, status;

PROMPT === Últimas solicitudes ===
SELECT id, request_type, status, first_name, email, company, created_at
FROM MKT_PROSPECT
ORDER BY created_at DESC
FETCH FIRST 20 ROWS ONLY;
