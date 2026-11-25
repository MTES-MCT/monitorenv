ALTER TABLE user_authorizations
    ADD COLUMN id UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE user_authorizations
    DROP CONSTRAINT user_authorizations_pkey;
ALTER TABLE user_authorizations
    ADD PRIMARY KEY (id);

ALTER TABLE user_authorizations
    ADD CONSTRAINT user_authorizations_hashed_email_key UNIQUE (hashed_email);
