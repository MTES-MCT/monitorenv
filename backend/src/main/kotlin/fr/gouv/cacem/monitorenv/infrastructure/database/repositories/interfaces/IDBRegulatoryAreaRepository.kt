package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBRegulatoryAreaRepository : JpaRepository<RegulatoryAreaModel, Int> {
    @Query(
        value =
            """
            SELECT DISTINCT regulatoryArea
            FROM RegulatoryAreaModel regulatoryArea
            LEFT JOIN regulatoryArea.themes th
            LEFT JOIN regulatoryArea.tags tg
            WHERE (:seaFronts IS NULL OR regulatoryArea.facade IN (:seaFronts))
            AND (:themes IS NULL OR th.theme.id IN :themes)
            AND (:tags IS NULL OR tg.tag.id IN :tags)
            AND (:controlPlan IS NULL OR regulatoryArea.plan LIKE %:controlPlan%)
            AND regulatoryArea.creation IS NOT NULL
            AND (:onlyRecentsAreas IS FALSE OR (
                regulatoryArea.creation >= DATEADD(DAY, -30, CURRENT_TIMESTAMP)
                OR regulatoryArea.editionBo >= DATEADD(DAY, -30, CURRENT_TIMESTAMP)
                OR regulatoryArea.editionCacem >= DATEADD(DAY, -30, CURRENT_TIMESTAMP)
            ))
            AND (:extent IS NULL OR intersects(regulatoryArea.geom, :extent) = true)
            ORDER BY regulatoryArea.layerName
        """,
    )
    fun findAll(
        controlPlan: String? = null,
        seaFronts: List<String>? = null,
        tags: List<Int>? = null,
        themes: List<Int>? = null,
        onlyRecentsAreas: Boolean? = false,
        extent: Geometry? = null,
    ): List<RegulatoryAreaModel>

    @Query(
        value =
            """
            SELECT ST_AsMVT(tile, 'REGULATORY_ENV_PREVIEW', 4096, 'geom')
            FROM (
                WITH filtered_regs AS (
                    SELECT reg.id, reg.geom_3857, reg.poly_name, reg.resume, reg.plan, reg.layer_name, ST_Area(geom_3857) AS area
                    FROM regulatory_areas reg
                    LEFT JOIN themes_regulatory_areas thr ON reg.id = thr.regulatory_areas_id
                    LEFT JOIN tags_regulatory_areas tr ON reg.id = tr.regulatory_areas_id
                    WHERE geom_3857 && ST_TileEnvelope(:z, :x, :y)
                     AND (CAST(:seaFronts as text[]) IS NULL OR facade = ANY(CAST(:seaFronts as text[])))
                     AND (:controlPlan IS NULL OR plan LIKE CONCAT('%', :controlPlan, '%'))
                     AND (CAST(:themes as int[]) IS NULL OR thr.themes_id = ANY(CAST(:themes as int[])))
                     AND (CAST(:tags as int[]) IS NULL OR tr.tags_id = ANY(CAST(:tags as int[])))
                     AND (:query IS NULL 
                        OR UNACCENT(UPPER(poly_name)) LIKE CONCAT('%', UNACCENT(UPPER(:query)), '%')
                        OR UNACCENT(UPPER(layer_name)) LIKE CONCAT('%', UNACCENT(UPPER(:query)), '%')
                        OR UNACCENT(UPPER(ref_reg)) LIKE CONCAT('%', UNACCENT(UPPER(:query)), '%')
                        OR UNACCENT(UPPER(resume)) LIKE CONCAT('%', UNACCENT(UPPER(:query)), '%')
                        )
                    AND (:onlyRecentsAreas IS FALSE OR (
                        reg.creation >= CURRENT_TIMESTAMP - INTERVAL '30 days'
                        OR reg.edition_bo >= CURRENT_TIMESTAMP - INTERVAL '30 days'
                        OR reg.edition_cacem >= CURRENT_TIMESTAMP - INTERVAL '30 days'
                        )
                    )
                    AND ((:minX IS NULL OR :minY IS NULL OR :maxX IS NULL OR :maxY IS NULL)
                        OR ST_Intersects(geom_3857, ST_MakeEnvelope(:minX, :minY, :maxX, :maxY, 3857))
                        )
                    ),
                    tags_agg AS (
                        SELECT
                            tr.regulatory_areas_id,
                            STRING_AGG(DISTINCT
                                CASE
                                    WHEN subtag.id IS NOT NULL
                                    THEN t.name || ',' || subtag.name
                                    ELSE t.name
                                END
                            , ',') AS tags
                        FROM tags_regulatory_areas tr
                        JOIN tags t ON tr.tags_id = t.id
                        LEFT JOIN tags subtag ON subtag.parent_id = t.id
                        WHERE tr.regulatory_areas_id IN (SELECT id FROM filtered_regs)
                        GROUP BY tr.regulatory_areas_id
                    ),
                    themes_agg AS (
                        SELECT
                            tr.regulatory_areas_id,
                            STRING_AGG(DISTINCT
                                CASE
                                    WHEN subthemes.id IS NOT NULL
                                    THEN t.name || ',' || subthemes.name
                                    ELSE t.name
                                END
                            , ',') AS themes
                        FROM themes_regulatory_areas tr
                        JOIN themes t ON tr.themes_id = t.id
                        LEFT JOIN themes subthemes ON subthemes.parent_id = t.id
                        WHERE tr.regulatory_areas_id IN (SELECT id FROM filtered_regs)
                        GROUP BY tr.regulatory_areas_id
                    )
                SELECT
                    filtered_regs.id as id,
                    CONCAT('REGULATORY_ENV_PREVIEW:', filtered_regs.id) as uid,
                    filtered_regs.area,
                    filtered_regs.poly_name AS "polyName",
                    filtered_regs.layer_name AS "layerName",
                    filtered_regs.resume as "resume",
                    filtered_regs.plan as "plan",
                    ST_AsMVTGeom(filtered_regs.geom_3857, ST_TileEnvelope(:z, :x, :y), 4096, 64, true) AS geom,
                    themes_agg.themes as "themes",
                    tags_agg.tags as "tags",
                    true AS "isFilled"
                FROM filtered_regs
                LEFT JOIN tags_agg ON tags_agg.regulatory_areas_id = filtered_regs.id
                LEFT JOIN themes_agg ON themes_agg.regulatory_areas_id = filtered_regs.id
            ) AS tile
            WHERE geom IS NOT NULL
        """,
        nativeQuery = true,
    )
    fun findAllAsTiles(
        controlPlan: String? = null,
        seaFronts: Array<String>? = null,
        tags: Array<Int>? = null,
        themes: Array<Int>? = null,
        onlyRecentsAreas: Boolean? = false,
        query: String? = null,
        minX: Double? = null,
        minY: Double? = null,
        maxX: Double? = null,
        maxY: Double? = null,
        x: Int,
        y: Int,
        z: Int,
    ): ByteArray

    fun findAllByCreationIsNull(): List<RegulatoryAreaModel>

    @Query(
        """
        SELECT regulatoryArea.layerName, COUNT(regulatoryArea)
        FROM RegulatoryAreaModel regulatoryArea
        WHERE regulatoryArea.layerName IS NOT NULL
        GROUP BY regulatoryArea.layerName
        ORDER BY regulatoryArea.layerName
    """,
    )
    fun findAllLayerNames(): List<Array<Any>>

    @Query(
        value =
            """
            SELECT r.id FROM RegulatoryAreaModel r
            WHERE ST_INTERSECTS(st_setsrid(r.geom, 4326), ST_Buffer(st_setsrid(:geometry, 4326), 0))
        """,
    )
    fun findAllIdsByGeom(geometry: Geometry): List<Int>

    @Query(
        value =
            """
            SELECT *
            FROM regulatory_areas regulatoryArea
            WHERE regulatoryArea.id IN (:ids)
            AND regulatoryArea.creation IS NOT NULL
            ORDER BY
                CASE WHEN :axis = 'NORTH_SOUTH' THEN ST_Y(ST_PointOnSurface(regulatoryArea.geom)) END DESC,
                CASE WHEN :axis = 'SOUTH_NORTH' THEN ST_Y(ST_PointOnSurface(regulatoryArea.geom)) END ASC,
                CASE WHEN :axis = 'WEST_EAST'   THEN ST_X(ST_PointOnSurface(regulatoryArea.geom)) END ASC,
                CASE WHEN :axis = 'EAST_WEST'   THEN ST_X(ST_PointOnSurface(regulatoryArea.geom)) END DESC,
            ST_Y(ST_PointOnSurface(regulatoryArea.geom)) DESC
        """,
        nativeQuery = true,
    )
    fun findAllCompleteByIds(
        ids: List<Int>,
        axis: String,
    ): List<RegulatoryAreaModel>
}
