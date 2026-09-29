CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE checks (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    checked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    response_time_ms INTEGER,
    status_code INTEGER,
    is_up BOOLEAN NOT NULL
);