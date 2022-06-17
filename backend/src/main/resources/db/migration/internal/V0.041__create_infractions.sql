
--
-- Name: infractions; Type: TABLE; Schema: public;
--

CREATE TABLE public.infractions (
    id integer,
    natinf_code character varying(20),
    regulation character varying(100),
    infraction_category character varying(50),
    infraction text
);