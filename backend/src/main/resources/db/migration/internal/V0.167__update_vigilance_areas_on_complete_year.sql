/* Update of zones of vigilance for the whole of 2024 with no end condition to isAtAllTimes = true */

UPDATE vigilance_areas
SET end_date_period   = NULL,
    start_date_period = NULL,
    frequency         = NULL,
    ending_condition  = NULL,
    is_at_all_times   = TRUE
WHERE frequency = 'ALL_YEARS'
  AND ending_condition = 'NEVER'
  AND end_date_period = '2024-12-31 23:59:59'
  AND start_date_period = '2024-01-01 00:00:00'
;
