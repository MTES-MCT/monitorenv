ALTER TABLE prod.reglementation_env ADD COLUMN geometry_simplified geometry(MULTYPOLYGON,4326);
UPDATE prod.reglementation_env SET geometry = ST_MakeValid(ST_CurveToLine(geometry));
UPDATE prod.reglementation_env SET geometry_simplified = ST_SimplifyPreserveTopology(ST_CurveToLine(geometry), 0.0001);
ALTER TABLE prod.reglementation_env ADD CONSTRAINT geometry_is_valid_check CHECK (st_isvalid(geometry));

-- This trigger function
--   * is triggered whenever a row in the local regulation database is inserted or modified
--   * simplifies the geometry
--   * convert any MULTISURFACE geometry to MULTYPOLYGON geometry type
--
-- The trigger is BEFORE insert of update, so values always have an up-to-date simplified geometry.

DROP FUNCTION IF EXISTS prod.simplify_geometry CASCADE;

CREATE FUNCTION prod.simplify_geometry() RETURNS trigger AS $$
    BEGIN
        NEW.geometry_simplified := ST_multi(ST_MakeValid(ST_SimplifyPreserveTopology(ST_CurveToLine(NEW.geometry), 0.0001)));
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER simplify_geometry
    BEFORE INSERT OR UPDATE OF geom ON prod.reglementation_env
    FOR EACH ROW
    EXECUTE PROCEDURE prod.simplify_geometry();
