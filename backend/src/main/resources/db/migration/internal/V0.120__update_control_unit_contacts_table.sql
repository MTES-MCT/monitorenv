ALTER TABLE public.control_unit_contacts
ADD COLUMN is_email_distribution_contact BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN is_sms_distribution_contact BOOLEAN NOT NULL DEFAULT false;