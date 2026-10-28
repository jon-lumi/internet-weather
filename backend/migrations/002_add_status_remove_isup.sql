ALTER TABLE checks ADD COLUMN status TEXT;

UPDATE checks
SET status = CASE
  WHEN NOT is_up THEN 'down'
  WHEN response_time_ms > 500 THEN 'degraded'
  ELSE 'up'
END;

ALTER TABLE checks ALTER COLUMN status SET NOT NULL;
ALTER TABLE checks ADD CONSTRAINT checks_status_valid
  CHECK (status IN ('up', 'degraded', 'down'));
ALTER TABLE checks DROP COLUMN is_up;