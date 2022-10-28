ALTER TABLE public.env_actions add column action_start_datetime_utc TIMESTAMP;
ALTER TABLE public.env_actions add column geom geometry(MULTIPOINT, 4326);
CREATE INDEX env_actions_geom_sidx on public.env_actions using gist(geom);
CREATE INDEX missions_geom_sidx on public.missions using gist(geom);

