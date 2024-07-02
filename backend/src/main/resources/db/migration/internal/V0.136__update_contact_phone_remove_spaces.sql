UPDATE control_unit_contacts
SET phone = REPLACE(phone, ' ', '')
WHERE phone is not null
