SELECT
  setval(
    'tags_id_seq',
    (
      SELECT
        MAX(id)
      FROM
        tags
    )
  );

INSERT INTO
  public.tags (name, parent_id, started_at, ended_at)
VALUES
  ('Dauphin', null, '2026-05-11 00:00:00.000000', null),
  ('Algue', null, '2026-05-11 00:00:00.000000', null),
  ('Coque', null, '2026-05-11 00:00:00.000000', null),
  ('Telline', null, '2026-05-11 00:00:00.000000', null),
  ('Chlordécone', null, '2026-05-11 00:00:00.000000', null),
  ('Canne à pêche', null, '2026-05-11 00:00:00.000000', null),
  ('Casier', null, '2026-05-11 00:00:00.000000', null),
  ('Tortue marine', null, '2026-05-11 00:00:00.000000', null);