--
-- Name: control_topics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.control_topics (
    id serial,
    topic_level_1 text,
    topic_level_2 text,
    topic_level_3 text
);

--
-- Name: control_topics control_topics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_topics
    ADD CONSTRAINT control_topics_pkey PRIMARY KEY (id);
