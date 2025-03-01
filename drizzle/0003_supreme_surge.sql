-- Backup the table (optional but recommended)
CREATE TABLE metrics_backup AS SELECT * FROM metrics;

-- Change id column type to uuid
ALTER TABLE metrics
ALTER COLUMN id SET DATA TYPE uuid USING gen_random_uuid();

-- Set default value for id column
ALTER TABLE metrics
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Change cpu_usage column type to double precision
ALTER TABLE metrics
ALTER COLUMN cpu_usage SET DATA TYPE double precision;

-- Change memory_usage column type to double precision
ALTER TABLE metrics
ALTER COLUMN memory_usage SET DATA TYPE double precision;

-- Change timestamp column type to timestamp with time zone
ALTER TABLE metrics
ALTER COLUMN timestamp SET DATA TYPE timestamp with time zone;

-- Validate the changes
\d metrics

-- Test inserting a new row
INSERT INTO metrics (pod_name, namespace, cpu_usage, timestamp, memory_usage)
VALUES (
    'test-pod',
    'default',
    10.5,
    NOW(),
    1024.0
);

-- Verify the new row
SELECT * FROM metrics WHERE pod_name = 'test-pod';