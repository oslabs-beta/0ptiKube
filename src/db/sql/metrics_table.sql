-- created metrics schema/table for time series data.
-- drizzle orm  does not fully support time series data, which will be the metrics table.


-- table created rawSQL
CREATE TABLE metrics (
    time TIMESTAMPTZ NOT NULL,
    cluster_name TEXT NOT NULL, -- Time column for time-series data
    pod_name TEXT NOT NULL,     -- Name of the pod
    cpu_usage DOUBLE PRECISION, -- CPU usage in some unit (e.g., millicores)
    memory_usage DOUBLE PRECISION, -- Memory usage in MiB
    created_at TIMESTAMPTZ DEFAULT NOW() -- Timestamp for when the metric was recorded
    id bigint generated always as identity, 
    PRIMARY KEY (time, cluster_name, pod_name) --composite primary keys for table
);

-- Converted the metrics table into a hypertable to handle time series data
SELECT create_hypertable('metrics', 'time');


CREATE INDEX ON metrics (time DESC);  -- Create the index on time in descending order
CREATE INDEX ON metrics (cluster_name);
CREATE INDEX ON metrics (pod_name);
