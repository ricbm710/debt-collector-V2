CREATE TABLE charges (
    id SERIAL PRIMARY KEY,

    contract_id INTEGER NOT NULL
        REFERENCES contracts(id)
        ON DELETE CASCADE,

    amount NUMERIC(10,2) NOT NULL,

    due_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0,

    paid_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);