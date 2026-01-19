ALTER TABLE public.last_positions
    ADD COLUMN callsign     varchar(100),
    ADD COLUMN imo          varchar(100),
    ADD COLUMN to_bow       SMALLINT,
    ADD COLUMN to_stern     SMALLINT,
    ADD COLUMN to_port      SMALLINT,
    ADD COLUMN to_starboard SMALLINT,
    ADD COLUMN draught      SMALLINT,
    ADD COLUMN destination  varchar(100),
    ADD COLUMN shipname     varchar(100),
    ADD COLUMN shiptype     INTEGER;

ALTER TABLE public.ais_positions
    ADD COLUMN callsign     varchar(100),
    ADD COLUMN imo          varchar(100),
    ADD COLUMN to_bow       SMALLINT,
    ADD COLUMN to_stern     SMALLINT,
    ADD COLUMN to_port      SMALLINT,
    ADD COLUMN to_starboard SMALLINT,
    ADD COLUMN draught      SMALLINT,
    ADD COLUMN destination  varchar(100),
    ADD COLUMN shipname     varchar(100),
    ADD COLUMN shiptype     INTEGER;