ALTER TABLE control_unit_contacts
    ADD COLUMN cell_phone VARCHAR,
    ADD COLUMN role VARCHAR;

ALTER TABLE control_unit_contacts ALTER COLUMN name DROP NOT NULL;

/* Move phone numbers starting with 06, 07, +881 6/7, or +594 6/7 to the cell_phone column */
UPDATE control_unit_contacts
SET cell_phone = phone,
    phone = NULL
WHERE phone ~ '^\s*(0[67]|\+(881|594)\s*[67])';

/* Move predefined contact names to the role column, keep custom names in name */
UPDATE control_unit_contacts
SET role = name,
    name = ''
WHERE name IN (
  'ADJUNCT',
  'BRIDGE',
  'COMMANDER',
  'COMMANDER_A',
  'COMMANDER_B',
  'CREW_A',
  'CREW_B',
  'DML',
  'DOCK',
  'LAND',
  'LAND_ON_CALL',
  'NEAR_COAST',
  'OFFICE',
  'ONBOARD_PHONE',
  'ON_CALL',
  'OPERATIONAL_CENTER',
  'OPERATIONAL_CENTER_HNO',
  'OPERATIONAL_CENTER_HO',
  'PERMANENT_CONTACT_ONBOARD',
  'SEA',
  'SECRETARIAT',
  'SERVICE_CHIEF',
  'UNIT_CHIEF',
  'UNKNOWN'
);
