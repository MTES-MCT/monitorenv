CREATE INDEX idx_vessel_ship_batch_row
    ON vessels (ship_id, batch_id, row_number);