INSERT INTO charges
(contract_id, amount, due_date, status, paid_amount)
VALUES

-- Pending
(36, 120, CURRENT_DATE + 5, 'PENDING', 0),

(36, 120, CURRENT_DATE + 35, 'PENDING', 0),

(37, 25, CURRENT_DATE + 3, 'PENDING', 0),

(38, 40, CURRENT_DATE + 7, 'PENDING', 0),

-- Overdue
(36, 120, CURRENT_DATE - 10, 'OVERDUE', 0),

(39, 180, CURRENT_DATE - 20, 'OVERDUE', 0),

-- Paid
(40, 35, CURRENT_DATE - 5, 'PAID', 35)