CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO reportings_source (id, reportings_id, source_type, control_unit_id, semaphore_id, source_name)
SELECT uuid_generate_v4(), r.id, 'SEMAPHORE', null, 46, null
from reportings r
where r.reporting_id IN ('2400345', '2402564', '2402580');

INSERT INTO reportings_source (id, reportings_id, source_type, control_unit_id, semaphore_id, source_name)
SELECT uuid_generate_v4(), r.id, 'SEMAPHORE', null, 43, null
from reportings r
where r.reporting_id IN ('2400805', '2402562', '2402563');

COMMIT;
