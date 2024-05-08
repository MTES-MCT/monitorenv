ALTER TABLE public.control_unit_contacts
ADD COLUMN is_email_subscription_contact BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN is_sms_subscription_contact BOOLEAN NOT NULL DEFAULT false;
