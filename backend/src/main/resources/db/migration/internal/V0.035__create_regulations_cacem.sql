--
-- PostgreSQL database dump
--

-- Dumped from database version 11.9
-- Dumped by pg_dump version 14.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

--
-- Name: regulations_cacem; Type: TABLE; Schema: public; Owner: postgres
--
-- DROP TABLE IF EXISTS public.regulations_cacem;
CREATE TABLE public.regulations_cacem (
    id serial,
    --geom public.geometry(point,4326),
    geom public.geometry(MultiPolygon,4326),
    entity_name character varying,
    url character varying,
    layer_name character varying,
    facade character varying,
    ref_reg character varying,
    edition character varying,
    editeur character varying,
    source character varying,
    observation character varying,
    thematique character varying,
    echelle character varying,
    date character varying,
    duree_validite character varying,
    date_fin character varying,
    temporalite character varying,
    action character varying,
    objet character varying,
    type character varying,
    signataire character varying
);

--
-- Name: regulations_cacem regulations_cacem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regulations_cacem
    ADD CONSTRAINT regulations_cacem_pkey PRIMARY KEY (id);


--
-- Name: regulations_cacem_sidx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX regulations_cacem_sidx ON public.regulations_cacem USING gist (geom);


--
-- PostgreSQL database dump complete
--

