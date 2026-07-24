CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,

    customer_id INTEGER NOT NULL
        REFERENCES customers(id)
        ON DELETE CASCADE,

    type VARCHAR(20) NOT NULL,

    name VARCHAR(100) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    start_date DATE NOT NULL,

    end_date DATE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);